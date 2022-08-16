use crate::encode_url::encode_url;
use napi::bindgen_prelude::*;
use regex::Regex;
use std::cmp;
use std::collections::VecDeque;

#[napi(strict)]
pub fn relative_url(from: String, to: String) -> Result<String> {
  let from_parts = from.split('/').collect::<Vec<&str>>();
  let to_parts = to.split('/').collect::<Vec<&str>>();
  let len = cmp::min(from_parts.len(), to_parts.len());
  let mut i = 0;

  for n in 0..len {
    if from_parts[n] != to_parts[n] {
      i = n;
      break;
    }
  }

  let mut out = VecDeque::new();
  out.extend(to_parts.iter().skip(i).copied());

  let mut j = from_parts.len() - i - 1;
  while j > 0 {
    out.push_front("..");
    j -= 1;
  }

  let out_len = out.len();

  let mut out = out.iter().map(|x| x.to_string()).collect::<Vec<String>>();
  // If the last 2 elements of `out` is empty strings, replace them with `index.html`.
  if out.len() > 1 && out[out_len - 1].trim().is_empty() && out[out_len - 2].trim().is_empty() {
    let obj = vec!["index.html".to_string()];
    out = vec![&out[..out_len - 2], &obj].concat();
  }

  let encoded = encode_url(out.join("/"));
  let regex = Regex::new(r#"/{2,}"#).unwrap();
  Ok(regex.replace_all(&encoded, "/").to_string())
}
