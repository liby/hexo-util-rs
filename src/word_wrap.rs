use napi::bindgen_prelude::*;
use napi::Status::InvalidArg;
#[napi(object)]
pub struct WordWrapOptions {
  pub width: u32,
}

#[napi]
pub fn word_wrap(s: String, options: Option<WordWrapOptions>) -> Result<String> {
  let width = options
    .map(|opts| {
      if opts.width == 0 {
        Err(Error::new(
          InvalidArg,
          "width must be greater than 0!".to_string(),
        ))
      } else {
        Ok(opts.width)
      }
    })
    .transpose()?
    .unwrap_or(80);
  let mut result = String::with_capacity(s.len());

  for line in s.lines() {
    let mut start_idx = 0;

    while start_idx < line.len() {
      let mut end_idx = start_idx + width as usize;
      if end_idx >= line.len() {
        result.push_str(&line[start_idx..]);
        start_idx = end_idx;
      } else {
        // Find the space to split at
        while end_idx > start_idx && !line[end_idx..end_idx + 1].trim().is_empty() {
          end_idx -= 1;
        }

        // If no space is found, use the original width
        if end_idx == start_idx {
          end_idx = start_idx + width as usize;
        } else {
          end_idx += 1; // Include the space
        }

        result.push_str(line[start_idx..end_idx].trim());
        start_idx = end_idx;
      }
      if start_idx < line.len() {
        result.push('\n');
      }
    }
  }

  Ok(result)
}

#[cfg(test)]
mod tests {
  use crate::word_wrap::{word_wrap, WordWrapOptions};

  #[test]
  fn it_works() {
    let result = "Once upon a time".to_string();
    assert_eq!(
      result,
      word_wrap("Once upon a time".to_string(), None).unwrap()
    );
  }

  #[test]
  fn it_works_with_default_options() {
    let result = "Once upon a time, in a kingdom called Far Far Away, a king fell ill, and finding
a successor to the throne turned out to be more trouble than anyone could have
imagined..."
      .to_string();
    assert_eq!(
      result,
      word_wrap(
        "Once upon a time, in a kingdom called Far Far Away, a king fell ill, and finding a successor to the throne turned out to be more trouble than anyone could have imagined...".to_string(),None
      )
          .unwrap()
    );
  }

  #[test]
  fn it_works_with_eight_width() {
    let result = "O\nn\nc\ne\nu\np\no\nn\na\nt\ni\nm\ne";
    assert_eq!(
      result,
      word_wrap(
        "Once upon a time".to_string(),
        Some(WordWrapOptions { width: 8 })
      )
      .unwrap()
    );
  }

  #[test]
  fn it_works_with_one_width() {
    let result = "Once\nupon\na\ntime";
    assert_eq!(
      result,
      word_wrap(
        "Once upon a time".to_string(),
        Some(WordWrapOptions { width: 1 })
      )
      .unwrap()
    );
  }
}
