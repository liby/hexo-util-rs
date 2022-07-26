use crate::encode_url::encode_url;
use napi::bindgen_prelude::*;

#[inline]
fn from_hex_digit(digit: u8) -> Option<u8> {
  match digit {
    b'0'..=b'9' => Some(digit - b'0'),
    b'A'..=b'F' => Some(digit - b'A' + 10),
    b'a'..=b'f' => Some(digit - b'a' + 10),
    _ => None,
  }
}

pub fn decode_url_impl(url: String) -> String {
  let mut url_bytes = url.as_bytes();
  if !url_bytes.contains(&b'%') {
    return url;
  }
  let mut result = Vec::with_capacity(url_bytes.len());

  loop {
    let mut parts = url_bytes.splitn(2, |&char| char == b'%');
    result.extend_from_slice(parts.next().unwrap());
    match parts.next() {
      None => {
        if result.is_empty() {
          return String::from_utf8_lossy(url_bytes).into_owned();
        }
        break;
      }
      Some(rest) => match rest.get(0..2) {
        Some(&[first, second]) => match (from_hex_digit(first), from_hex_digit(second)) {
          (Some(first_value), Some(second_value)) => {
            result.push((first_value << 4) | second_value);
            url_bytes = &rest[2..];
          }
          (Some(_first_value), None) => {
            result.extend_from_slice(&[b'%', first]);
            url_bytes = &rest[1..];
          }
          (None, _) => {
            result.push(b'%');
            url_bytes = rest;
          }
        },
        _ => {
          result.push(b'%');
          result.extend_from_slice(rest);
          break;
        }
      },
    };
  }
  String::from_utf8_lossy(&result).into_owned()
}

#[napi]
pub fn decode_url(url: String) -> Result<String> {
  let encoded = encode_url(url);
  Ok(decode_url_impl(encoded))
}
