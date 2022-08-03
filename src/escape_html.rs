use crate::traits::IntoString;
use napi::bindgen_prelude::*;

#[napi]
pub fn escape_html(
  #[napi(ts_arg_type = "Buffer | string")] input: Either3<Buffer, String, Unknown>,
) -> Result<String> {
  let input = input.to_string()?;
  let decoded_input = html_escape::decode_html_entities(&input);

  Ok(html_escape::encode_safe(&decoded_input).into_owned())
}
