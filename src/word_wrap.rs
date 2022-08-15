use napi::bindgen_prelude::*;

#[napi(object)]
pub struct WordWrapOptions {
  pub width: u32,
}

#[napi(strict)]
pub fn word_wrap(input: String, options: Option<WordWrapOptions>) -> Result<String> {
  let width = options.map(|options| options.width).unwrap_or(80);
  Ok(textwrap::fill(&input, width as usize))
}
