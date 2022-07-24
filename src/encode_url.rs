use std::borrow::Cow;
use std::ops::Range;

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

/// Return the strings around `part` if `part` is a non-empty sub-slice of `whole`. Otherwise, return `None`.
fn split_around_subslice<'a>(whole: &'a str, part: &str) -> Option<(&'a str, &'a str)> {
  if part.is_empty() {
    return None;
  }
  let Range {
    start: whole_start,
    end: whole_end,
  } = whole.as_bytes().as_ptr_range();
  let Range {
    start: part_start,
    end: part_end,
  } = part.as_bytes().as_ptr_range();
  if part_start < whole_start || part_end > whole_end {
    return None;
  }
  // Safety:
  // 1) We have checked that `part_start` is in bounds of `whole`.
  // 2) We have checked that `part` is a substring of `whole` in memory, plus the whole memory space `whole` spans
  //    should belong to one single allocated object. Therefore, `part` and `whole` are derived from the same object.
  // 3) Any integer is a multiple of size of `u8`, which is 1.
  // 4) Given `part_start` points to somewhere between `whole_range`, the pointer difference (in bytes) cannot overflow
  //    an `isize` if `whole.len()` < `isize::MAX`, which is guaranteed by `RawVec`.
  // 5) A `RawVec` guarantees length never overflows.
  let part_offset = unsafe { part_start.offset_from(whole_start) as usize };
  // Safety: same as above
  let tail_start = unsafe { part_end.offset_from(whole_start) as usize };
  Some((&whole[..part_offset], &whole[tail_start..]))
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
  let (head, tail) =
    split_around_subslice(url.as_str(), domain).expect("Domain is empty or outside url");

  let udomain = domain_to_unicode(domain).0;
  let mut out_str = String::with_capacity(head.len() + tail.len() + udomain.len());
  out_str.push_str(head);
  out_str.push_str(&udomain);
  out_str.push_str(tail);
  out_str
}

#[napi]
pub fn encode_url(url: String) -> String {
  encode_url_impl(&url)
}
