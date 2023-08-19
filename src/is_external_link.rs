use napi::bindgen_prelude::*;

fn is_external_link_impl(url: &str, base_url: url::Url, exclude: Vec<String>) -> bool {
  let url = match url::Url::options().base_url(Some(&base_url)).parse(url) {
    Ok(url) => url,
    Err(_) => return false,
  };

  // mailto: javascript: vbscript: URLs do not have a host
  let host = match url.host_str() {
    Some(host) => host,
    None => return false,
  };

  if exclude.into_iter().any(|ex| ex == host) {
    return false;
  }

  host != base_url.host_str().unwrap_or_default()
}

#[napi]
pub fn is_external_link(
  url: String,
  sitehost: String,
  exclude: Option<Either<String, Vec<String>>>,
) -> Result<bool> {
  if !["//", "http:", "https:"]
    .into_iter()
    .any(|prefix| url.starts_with(prefix))
  {
    return Ok(false);
  }

  let sitehost = url::Url::parse(&sitehost)
    .or_else(|_| {
      let mut site_url = String::with_capacity(7 + sitehost.len());
      site_url.push_str("http://");
      site_url.push_str(&sitehost);
      url::Url::parse(&site_url)
    })
    .map_err(|_| {
      Error::new(
        Status::InvalidArg,
        "sitehost is neither a valid URL nor a hostname".to_string(),
      )
    })?;

  let exclude = match exclude {
    None => vec![],
    Some(Either::A(str)) => vec![str],
    Some(Either::B(v)) => v,
  };

  Ok(is_external_link_impl(&url, sitehost, exclude))
}
