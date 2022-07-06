#[macro_use]
extern crate napi_derive;
use napi::*;

enum State {
  PlainText,
  Html,
  Comment,
}

#[js_function(1)]
fn strip_tags(ctx: CallContext) -> Result<JsString> {
  // if not string, then safely return an empty string
  if ctx.get::<JsString>(0).is_err() {
    return ctx.env.create_string("");
  }

  let html = ctx.get::<JsString>(0)?.into_utf8()?;
  let html_content = html.as_str()?;

  let mut state = State::PlainText;
  let mut tag_buffer = String::new();
  let mut depth = 0;
  let mut in_quote_char = None;
  let mut output = String::new();

  for char in html_content.chars() {
    match state {
      State::PlainText => {
        if char == '<' {
          state = State::Html;
          tag_buffer += &char.to_string();
        } else {
          output.push(char);
        }
        continue;
      }
      State::Html => {
        match char {
          '<' => {
            // ignore '<' if inside a quote
            if in_quote_char.is_some() {
              continue;
            }
            // we're seeing a nested '<'
            depth += 1;
            continue;
          }
          '>' => {
            // ignore '<' if inside a quote
            if in_quote_char.is_some() {
              continue;
            }

            if depth != 0 {
              depth -= 1;
              continue;
            }

            // this is closing the tag in tag_buffer
            in_quote_char = None;
            state = State::PlainText;

            // tag_buffer += '>';
            tag_buffer = String::new();
            continue;
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
            continue;
          }
          '-' => {
            if tag_buffer == *"<!-" {
              state = State::Comment;
            }
            tag_buffer.push(char);
            continue;
          }
          ' ' | '\t' | '\n' | '\r' => {
            if tag_buffer == *"<" {
              state = State::PlainText;
              output.push_str("< ");
              tag_buffer = String::new();
              continue;
            }

            tag_buffer.push(char);
            continue;
          }
          _ => {
            tag_buffer.push(char);
            continue;
          }
        }
      }
      State::Comment => {
        if char == '>' {
          if tag_buffer.ends_with("--") {
            state = State::PlainText;
          }
          tag_buffer = String::new();
          continue;
        } else {
          tag_buffer.push(char);
          continue;
        }
      }
    }
  }

  ctx.env.create_string(&output)
}

#[module_exports]
fn init(mut exports: JsObject) -> Result<()> {
  exports.create_named_method("stripTags", strip_tags)?;
  Ok(())
}
