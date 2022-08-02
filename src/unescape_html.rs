use crate::slugize::IntoString;
use napi::bindgen_prelude::*;

#[napi]
pub fn unescape_html(
  #[napi(ts_arg_type = "Buffer | string")] input: Either3<Buffer, String, Unknown>,
) -> Result<String> {
  if let Either3::C(_) = input {
    return Err(Error::new(
      Status::InvalidArg,
      "input html should be either Buffer or String".to_owned(),
    ));
  }

  Ok(html_escape::decode_html_entities(&input.to_string()?).into_owned())
}
