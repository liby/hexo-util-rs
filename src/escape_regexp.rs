#[napi(strict)]
pub fn escape_reg_exp(input: String) -> String {
  regex::escape(&input)
}
