use napi::bindgen_prelude::*;

const MAX_TAG_BUFFER: usize = 4096;

enum State {
  PlainText,
  Html,
  Comment,
}

trait ToChars {
  fn chars(&self) -> napi::Result<std::str::Chars>;
}

impl ToChars for Either3<Buffer, String, Unknown> {
  fn chars(&self) -> napi::Result<std::str::Chars> {
    match self {
      Either3::A(b) => std::str::from_utf8(b).map(|s| s.chars()).map_err(|_| {
        napi::Error::new(
          napi::Status::InvalidArg,
          "input html is not valid utf8 string".to_owned(),
        )
      }),
      Either3::B(s) => Ok(s.as_str().chars()),
      _ => Ok("".chars()),
    }
  }
}

#[napi]
pub fn strip_tags(
  #[napi(ts_arg_type = "Buffer | string")] html_content: Either3<Buffer, String, Unknown>,
) -> Result<String> {
  if let Either3::C(_) = html_content {
    return Err(Error::new(
      Status::InvalidArg,
      "input html should be either Buffer or String".to_owned(),
    ));
  }
  let mut state = State::PlainText;
  let mut tag_buffer = String::with_capacity(MAX_TAG_BUFFER);
  let mut depth = 0;
  let mut in_quote_char = None;
  let mut output = String::with_capacity(match &html_content {
    Either3::A(s) => s.len(),
    Either3::B(b) => b.len(),
    _ => 0,
  });

  html_content.chars()?.for_each(|char| {
    match state {
      State::PlainText => {
        if char == '<' {
          state = State::Html;
          tag_buffer.push(char);
        } else {
          output.push(char);
        }
      }
      State::Html => {
        match char {
          '<' => {
            // ignore '<' if inside a quote
            if in_quote_char.is_some() {
              return;
            }
            // we're seeing a nested '<'
            depth += 1;
          }
          '>' => {
            // ignore '<' if inside a quote
            if in_quote_char.is_some() {
              return;
            }

            if depth != 0 {
              depth -= 1;
              return;
            }

            // this is closing the tag in tag_buffer
            in_quote_char = None;
            state = State::PlainText;

            // tag_buffer += '>';
            tag_buffer = String::with_capacity(MAX_TAG_BUFFER);
          }
          '"' | '\'' => {
            // catch both single and double quotes
            if let Some(quote_char) = in_quote_char {
              if char == quote_char {
                in_quote_char = None;
              }
            } else {
              in_quote_char = Some(char);
            };

            tag_buffer.push(char);
          }
          '-' => {
            if tag_buffer == *"<!-" {
              state = State::Comment;
            }
            tag_buffer.push(char);
          }
          ' ' | '\t' | '\n' | '\r' => {
            if tag_buffer == *"<" {
              state = State::PlainText;
              output.push_str("< ");
              tag_buffer = String::with_capacity(MAX_TAG_BUFFER);
              return;
            }

            tag_buffer.push(char);
          }
          _ => {
            tag_buffer.push(char);
          }
        }
      }
      State::Comment => {
        if char == '>' {
          if tag_buffer.ends_with("--") {
            state = State::PlainText;
          }
          tag_buffer = String::with_capacity(MAX_TAG_BUFFER);
        } else {
          tag_buffer.push(char);
        }
      }
    }
  });

  Ok(output)
}
