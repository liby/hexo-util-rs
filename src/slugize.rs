use deunicode::deunicode_char;
use napi::bindgen_prelude::*;

#[napi(object)]
pub struct Options {
  pub separator: Option<String>,
  pub transform: Option<u8>,
}

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
      _ => Ok("".to_owned()),
    }
  }
}

#[napi]
pub fn slugize(
  #[napi(ts_arg_type = "Buffer | string")] str: Either3<Buffer, String, Unknown>,
  options: Option<Options>,
) -> Result<String> {
  if let Either3::C(_) = str {
    return Err(Error::new(
      Status::InvalidArg,
      "input html should be either Buffer or String".to_owned(),
    ));
  }

  let options = options.unwrap_or_else(|| Options {
    separator: Some("-".to_owned()),
    transform: None,
  });

  let transform = match options.transform {
    Some(1) => Some(Case::Lower),
    Some(2) => Some(Case::Upper),
    _ => None,
  };

  Ok(slugify(
    &str.to_string().unwrap(),
    &options.separator.unwrap_or_else(|| "-".to_owned()),
    transform,
  ))
}

enum Case {
  Lower,
  Upper,
}

fn slugify(s: &str, sep: &str, transform: Option<Case>) -> String {
  let mut slug: Vec<u8> = Vec::with_capacity(s.len());
  // Starts with true to avoid leading separator
  let mut prev_is_sep = true;
  {
    let mut push_char = |x: u8| match x {
      b'a'..=b'z' => {
        prev_is_sep = false;

        if let Some(Case::Upper) = transform {
          slug.push(x.to_ascii_uppercase());
        } else {
          slug.push(x);
        }
      }
      b'A'..=b'Z' => {
        prev_is_sep = false;
        if let Some(Case::Lower) = transform {
          slug.push(x.to_ascii_lowercase());
        } else {
          slug.push(x);
        }
      }
      b'0'..=b'9' => {
        prev_is_sep = false;
        slug.push(x);
      }
      _ => {
        if !prev_is_sep {
          slug.extend_from_slice(sep.as_bytes());
          prev_is_sep = true;
        }
      }
    };

    for c in s.chars() {
      if c.is_ascii() {
        (push_char)(c as u8);
      } else {
        for &cx in deunicode_char(c).unwrap_or(sep).as_bytes() {
          (push_char)(cx);
        }
      }
    }
  }

  // It's not really unsafe in practice, we know we have ASCII
  let mut string = unsafe { String::from_utf8_unchecked(slug) };
  if string.ends_with(sep) {
    string.pop();
  }
  // We likely reserved more space than needed.
  string.shrink_to_fit();
  string
}
