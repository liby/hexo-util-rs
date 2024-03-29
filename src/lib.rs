#![deny(clippy::all)]
#[macro_use]
extern crate napi_derive;

#[cfg(all(
  not(all(target_os = "linux", target_env = "musl", target_arch = "aarch64")),
  not(debug_assertions)
))]
#[global_allocator]
static ALLOC: mimalloc_rust::GlobalMiMalloc = mimalloc_rust::GlobalMiMalloc;

mod decode_url;
mod encode_url;
mod escape_diacritic;
mod escape_html;
mod escape_regexp;
mod is_external_link;
mod slugize;
mod strip_html;
mod traits;
mod unescape_html;
mod word_wrap;
