use napi::{bindgen_prelude::Buffer, Either};

#[napi(object)]
pub struct Options {
  pub length: Option<u32>,
  pub omission: Option<String>,
  pub separator: Option<String>,
}

const MAX_RESULT: usize = 4096;

trait AsString {
  fn as_string(&self) -> napi::Result<std::string::String>;
}

impl AsString for Either<String, Buffer> {
  fn as_string(&self) -> napi::Result<std::string::String> {
    match self {
      Either::A(s) => Ok(s.to_owned()),
      Either::B(b) => match std::str::from_utf8(b) {
        Ok(s) => Ok(s.to_owned()),
        Err(_) => Err(napi::Error::new(
          napi::Status::InvalidArg,
          "input html is not valid utf8 string".to_owned(),
        )),
      },
    }
  }
}

#[napi]
pub fn truncate(str: Either<String, Buffer>, options: Option<Options>) -> napi::Result<String> {
  let options = match options.is_none() {
    true => Options {
      length: Some(30),
      omission: Some("...".to_owned()),
      separator: None,
    },
    false => options.unwrap(),
  };

  let str = str.as_string()?;
  let length = options.length.unwrap() as usize;
  if str.len() < length {
    return Ok(str);
  }

  let omission = match options.omission {
    None => "...".to_owned(),
    _ => options.omission.unwrap(),
  };
  let omission_length = omission.len();

  let mut result = String::with_capacity(MAX_RESULT);
  if options.separator.is_none() {
    result = str
      .chars()
      .skip(0)
      .take(length - omission_length)
      .collect::<String>();
    result += &omission;
    return Ok(result);
  }

  let separator = options.separator.unwrap();
  let words = str.split(separator.as_str()).collect::<Vec<&str>>();
  let mut result_length = 0;

  for word in words {
    if (result_length + word.len() + omission_length) < length {
      result += word;
      result += &separator;
      result_length = result.len();
    } else {
      result = result
        .chars()
        .skip(0)
        .take(result_length - 1)
        .collect::<String>();

      result += &omission;
      return Ok(result);
    }
  }

  Ok(result)
}
