use crate::traits::IntoString;
use napi::bindgen_prelude::*;
use regex::Regex;

#[napi(object)]
pub struct PrettyUrlsOptions {
  pub trailing_index: Option<bool>,
  pub trailing_html: Option<bool>,
}

#[napi(strict)]
pub fn pretty_urls(url: String, options: Option<PrettyUrlsOptions>) -> Result<String> {
  let options = options.unwrap_or(PrettyUrlsOptions {
    trailing_index: Some(true),
    trailing_html: Some(true),
  });

  let index_pattern = Regex::new(r"index\.html$").unwrap();
  let html_pattern = Regex::new(r"\.html$").unwrap();

  let url = match (
    options.trailing_index.unwrap_or(true),
    options.trailing_html.unwrap_or(true),
  ) {
    (false, false) => {
      let result = index_pattern.replace_all(&url, "");
      let result = if !index_pattern.is_match(&result) {
        html_pattern.replace_all(&result, "")
      } else {
        result
      };
      result.to_string()
    }
    (true, false) => {
      if !index_pattern.is_match(&url) {
        html_pattern.replace_all(&url, "").to_string()
      } else {
        url
      }
    }
    (false, true) => {
      let result = index_pattern.replace_all(&url, "");
      result.to_string()
    }
    _ => url,
  };

  Ok(url)
}

#[cfg(test)]
mod tests {
  use crate::pretty_urls::{pretty_urls, PrettyUrlsOptions};

  #[test]
  fn default() {
    assert_eq!(
      pretty_urls("//example.com/index.html".to_string(), None).unwrap(),
      "//example.com/index.html"
    );
    assert_eq!(
      pretty_urls("/bar/foo.html".to_string(), None).unwrap(),
      "/bar/foo.html"
    );
    assert_eq!(
      pretty_urls("/bar/foo/".to_string(), None).unwrap(),
      "/bar/foo/"
    );
  }

  #[test]
  fn trailing_index() {
    assert_eq!(
      pretty_urls(
        "//example.com/index.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: Some(false),
          trailing_html: None,
        })
      )
      .unwrap(),
      "//example.com/"
    );
    assert_eq!(
      pretty_urls(
        "/bar/foo/index.html/index.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: Some(false),
          trailing_html: None,
        })
      )
      .unwrap(),
      "/bar/foo/index.html/"
    );
    assert_eq!(
      pretty_urls(
        "/bar/foo.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: Some(false),
          trailing_html: None,
        })
      )
      .unwrap(),
      "/bar/foo.html"
    );
  }

  #[test]
  fn trailing_html() {
    assert_eq!(
      pretty_urls(
        "//example.com/index.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: None,
          trailing_html: Some(false),
        })
      )
      .unwrap(),
      "//example.com/index.html"
    );
    assert_eq!(
      pretty_urls(
        "/bar/foo/index.html/index.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: None,
          trailing_html: Some(false),
        })
      )
      .unwrap(),
      "/bar/foo/index.html/index.html"
    );
    assert_eq!(
      pretty_urls(
        "/bar/foo.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: None,
          trailing_html: Some(false),
        })
      )
      .unwrap(),
      "/bar/foo"
    );
  }

  #[test]
  fn trailing_index_and_trailing_html() {
    assert_eq!(
      pretty_urls(
        "//example.com/index.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: Some(false),
          trailing_html: Some(false),
        })
      )
      .unwrap(),
      "//example.com/"
    );
    assert_eq!(
      pretty_urls(
        "/bar/foo/index.html/index.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: Some(false),
          trailing_html: Some(false),
        })
      )
      .unwrap(),
      "/bar/foo/index.html/"
    );
    assert_eq!(
      pretty_urls(
        "/bar/foo.html".to_string(),
        Some(PrettyUrlsOptions {
          trailing_index: Some(false),
          trailing_html: Some(false),
        })
      )
      .unwrap(),
      "/bar/foo"
    );
  }
}
