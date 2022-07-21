use std::borrow::Cow;

use idna::domain_to_unicode;
use percent_encoding::{percent_decode_str, percent_encode, AsciiSet};
use url::{ParseError, Url};

const fn get_ascii_set() -> AsciiSet {
  // A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #
  // characters above are not escaped in `encodeURI`.
  // [space] " # < >
  // characters above will be escaped by the parser.
  let bytes = *b",/?:@&=+$-_.!~*'()# \"#<>";
  let mut set = percent_encoding::NON_ALPHANUMERIC.remove(b';');
  let mut i = 0;
  while i < bytes.len() {
    set = set.remove(bytes[i]);
    i += 1;
  }
  set
}

// `percent_encoding::percent_encode` need a `&'static AsciiSet`.
const ASCII_SET: &AsciiSet = &get_ascii_set();

fn encoding_override(c: &str) -> Cow<[u8]> {
  // decode, then encode
  let dec = percent_decode_str(c).decode_utf8_lossy();
  Cow::<str>::from(percent_encode(dec.as_bytes(), ASCII_SET))
    .to_string()
    .into_bytes()
    .into()
}

fn encode_url_impl(input: &str) -> String {
  let enc = Some(&encoding_override as _);
  // Provide an `encoding_override` function to manually transform query part. Otherwise, url crate tends to leave
  // percent signs as-is.
  let mut parse_result = Url::options().encoding_override(enc).parse(input);
  let mut is_relative = false;
  if let Err(ParseError::RelativeUrlWithoutBase) = &parse_result {
    is_relative = true;
    // For relative URLs, we provide a short base URL which will be striped later.
    let base = Url::parse("http://.").expect("http://. must be a valid URL");
    parse_result = Url::options()
      .base_url(Some(&base))
      .encoding_override(enc)
      .parse(input);
  }
  let url = match parse_result {
    Ok(u) => u,
    Err(_) => return input.to_owned(),
  };
  if is_relative {
    let mut str = String::from(url);
    if input.as_bytes()[0] == b'/' {
      // Strip "http://."
      str.drain(..8);
    } else {
      // An unnecessary leading slash was added to the URL during parsing.
      str.drain(..9);
    }
    return str;
  }
  let domain = match url.domain() {
    Some(d) => d,
    None => return url.into(), // `javascript:` etc.
  };
  // The domain provided by url crate is punycode-encoded. We need to convert the domain back to unicode form, and copy
  // over remaining URL parts. However, there seems no easy way to find what's before and after domain within a URL.
  // Assuming the domain str slice is a part of the URL (inferred from elided lifetime on `url::Url::domain()`'s
  // signature), we can obtain the relative byte position where domain starts within a URL by calculating the pointer
  // difference between them, which will later be used to extract whatever surrounding the domain.

  let url_str = url.as_str();
  let url_ptr = url_str.as_ptr();
  let domain_ptr = domain.as_ptr();
  let domain_len = domain.len();
  assert!(domain_len > 0);
  assert!(domain_len <= url_str.len());
  assert!(domain_ptr >= url_ptr);
  assert!(
    // Safety:
    // 1) Since the domain part is guaranteed to be non-empty, `domain_ptr` should point to a valid allocated memory
    //    address, and the resulting pointer will be exactly one byte past the end of the same string.
    // 2) A `RawVec` guarantees never allocating more than isize::MAX bytes.
    // 3) A `RawVec` guarantees length never overflows.
    unsafe { domain_ptr.add(domain_len) } <=
    // Safety: same as above
    unsafe { url_ptr.add(url_str.len()) }
  );
  // Safety:
  // 1) Given `domain_ptr` >= `url_ptr` and `domain_ptr`+`domain_len` <= `url_ptr`+`url_len` and no overflow happens,
  //    we can say that `url_ptr` <= `domain_ptr` <= `url_ptr`+`url_len`-`domain_len` <= `url_ptr`+`url_len`.
  // 2) We have checked that `domain` is a substring of `url_str` in memory, plus the whole memory space `url_str`
  //    spans should belong to one single allocated object. Therefore, `domain` and `url_str` are derived from the same
  //    object.
  // 3) Any integer is a multiple of size of `u8`, which is 1.
  // 4) Given `domain_ptr` points to somewhere between `url_ptr` and `url_ptr`+`url_len`, the pointer difference (in
  //    bytes) cannot overflow an `isize` if `url_len` < `isize::MAX`, which is guaranteed by `RawVec`.
  // 5) A `RawVec` guarantees length never overflows.
  let domain_offset = unsafe { domain_ptr.offset_from(url_ptr) as usize };

  let udomain = domain_to_unicode(domain).0;
  let mut out_str = String::with_capacity(url_str.len() - domain_len + udomain.len());
  out_str.push_str(&url_str[..domain_offset]);
  out_str.push_str(&udomain);
  out_str.push_str(&url_str[domain_offset + domain_len..]);
  out_str
}

#[napi]
pub fn encode_url(url: String) -> String {
  encode_url_impl(&url)
}
