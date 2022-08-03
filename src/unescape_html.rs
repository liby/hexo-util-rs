use crate::traits::IntoString;
use napi::bindgen_prelude::*;

#[napi]
pub fn unescape_html(
  #[napi(ts_arg_type = "Buffer | string")] input: Either3<Buffer, String, Unknown>,
) -> Result<String> {
  Ok(html_escape::decode_html_entities(&input.to_string()?).into_owned())
}
