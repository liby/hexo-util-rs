use idna;
use napi::bindgen_prelude::*;
use percent_encoding;
use std::borrow::Cow;
use url::{self, ParseError};

const fn get_ascii_set() -> percent_encoding::AsciiSet {
  let bytes = *b",/?:@&=+$-_.!~*'()# \"#<>";
  let mut set = percent_encoding::NON_ALPHANUMERIC.remove(b';');
  let mut i = 0;
  while i < bytes.len() {
    set = set.remove(bytes[i]);
    i += 1;
  }
  set
}

const ASCII_SET: &percent_encoding::AsciiSet = &get_ascii_set();

fn encoding_override(c: &str) -> Cow<[u8]> {
  let dec = percent_encoding::percent_decode_str(c).decode_utf8_lossy();
  Cow::<str>::from(percent_encoding::percent_encode(dec.as_bytes(), &ASCII_SET))
    .to_string()
    .into_bytes()
    .into()
}

fn encode_url_impl(input: &str) -> String {
  let enc = Some(&encoding_override as _);
  let mut parse_result = url::Url::options().encoding_override(enc).parse(input);
  let mut is_relative = false;
  if let Err(ParseError::RelativeUrlWithoutBase) = &parse_result {
    is_relative = true;
    let base = url::Url::parse("http://.").unwrap();
    parse_result = url::Url::options()
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
    str.drain(..8);
    return str;
  }
  let domain = match url.domain() {
    Some(d) => d,
    None => return url.into(),
  };
  let url_str = url.as_str();
  let url_ptr = url_str.as_ptr();
  let domain_ptr = domain.as_ptr();
  let domain_len = domain.len();
  assert!(domain_len > 0);
  assert!(domain_len <= url_str.len());
  assert!(domain_ptr >= url_ptr);
  assert!(unsafe { domain_ptr.add(domain_len) } <= unsafe { url_ptr.add(url_str.len()) });
  let domain_offset = unsafe { domain_ptr.offset_from(url_ptr) as usize };

  let udomain = idna::domain_to_unicode(domain).0;
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
