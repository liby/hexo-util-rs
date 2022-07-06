use napi::{bindgen_prelude::Buffer, Either};

#[macro_use]
extern crate napi_derive;

#[cfg(all(
  not(all(target_os = "linux", target_env = "musl", target_arch = "aarch64")),
  not(debug_assertions)
))]
#[global_allocator]
static ALLOC: mimalloc_rust::GlobalMiMalloc = mimalloc_rust::GlobalMiMalloc;

const MAX_TAG_BUFFER: usize = 4096;

enum State {
  PlainText,
  Html,
  Comment,
}

trait ToChars {
  fn chars(&self) -> napi::Result<std::str::Chars>;
}

impl ToChars for Either<String, Buffer> {
  fn chars(&self) -> napi::Result<std::str::Chars> {
    match self {
      Either::A(s) => Ok(s.as_str().chars()),
      Either::B(b) => std::str::from_utf8(&b).map(|s| s.chars()).map_err(|_| {
        napi::Error::new(
          napi::Status::InvalidArg,
          "input html is not valid utf8 string".to_owned(),
        )
      }),
    }
  }
}

#[napi]
pub fn strip_tags(html_content: Either<String, Buffer>) -> napi::Result<String> {
  let mut state = State::PlainText;
  let mut tag_buffer = String::with_capacity(MAX_TAG_BUFFER);
  let mut depth = 0;
  let mut in_quote_char = None;
  let mut output = String::with_capacity(match &html_content {
    Either::A(s) => s.len(),
    Either::B(b) => b.len(),
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
        return;
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
            return;
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
            return;
          }
          '"' | '\'' => {
            // catch both single and double quotes
            if in_quote_char.is_some() && char == in_quote_char.unwrap() {
              in_quote_char = None;
            } else {
              in_quote_char = if in_quote_char.is_some() {
                in_quote_char
              } else {
                Some(char)
              };
            }

            tag_buffer.push(char);
            return;
          }
          '-' => {
            if tag_buffer == *"<!-" {
              state = State::Comment;
            }
            tag_buffer.push(char);
            return;
          }
          ' ' | '\t' | '\n' | '\r' => {
            if tag_buffer == *"<" {
              state = State::PlainText;
              output.push_str("< ");
              tag_buffer = String::with_capacity(MAX_TAG_BUFFER);
              return;
            }

            tag_buffer.push(char);
            return;
          }
          _ => {
            tag_buffer.push(char);
            return;
          }
        }
      }
      State::Comment => {
        if char == '>' {
          if tag_buffer.ends_with("--") {
            state = State::PlainText;
          }
          tag_buffer = String::with_capacity(MAX_TAG_BUFFER);
          return;
        } else {
          tag_buffer.push(char);
          return;
        }
      }
    }
  });

  Ok(output)
}
