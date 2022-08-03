use napi::bindgen_prelude::*;

pub trait IntoString {
  fn to_string(&self) -> Result<String>;
}

impl IntoString for Either3<Buffer, String, Unknown> {
  fn to_string(&self) -> Result<String> {
    match self {
      Either3::A(b) => match std::str::from_utf8(b) {
        Ok(s) => Ok(s.to_owned()),
        Err(_) => Err(Error::new(
          Status::InvalidArg,
          "input html is not valid utf8 string".to_owned(),
        )),
      },
      Either3::B(s) => Ok(s.to_owned()),
      Either3::C(_) => Err(Error::new(
        Status::InvalidArg,
        "input html should be either Buffer or String".to_owned(),
      )),
    }
  }
}
