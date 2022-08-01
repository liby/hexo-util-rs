use napi::bindgen_prelude::*;

#[napi]
pub fn escape_diacritic(
  #[napi(ts_arg_type = "string")] input: Either<String, Unknown>,
) -> Result<String> {
  match input {
    Either::A(s) => Ok(diacritics::remove_diacritics(&s)),
    Either::B(_) => Err(Error::new(
      Status::InvalidArg,
      "input should be String".to_owned(),
    )),
  }
}
