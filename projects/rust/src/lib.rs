use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Response};

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn rust_add(augend: f64, addend: f64) -> f64 {
    augend + addend
}

#[wasm_bindgen]
pub fn rust_sub(minuend: f64, subtrahend: f64) -> f64 {
    minuend - subtrahend
}

#[wasm_bindgen]
pub fn rust_mul(multiplicand: f64, multiplier: f64) -> f64 {
    multiplicand * multiplier
}

#[wasm_bindgen]
pub fn rust_div(dividend: f64, divisor: f64) -> f64 {
    dividend / divisor
}

#[wasm_bindgen]
pub fn rust_sum(numbers: Vec<f64>) -> f64 {
    numbers.iter().sum()
}

#[wasm_bindgen]
pub fn rust_max(numbers: Vec<f64>) -> f64 {
    Some(numbers.iter().fold(0.0/0.0, |m, v| v.max(m))).filter(|v| !v.is_nan()).unwrap()
}

#[wasm_bindgen]
pub fn rust_min(numbers: Vec<f64>) -> f64 {
    Some(numbers.iter().fold(0.0/0.0, |m, v| v.min(m))).filter(|v| !v.is_nan()).unwrap()
}

#[wasm_bindgen]
pub async fn fetch_data() -> Result<JsValue, JsValue> {
    let window = web_sys::window().ok_or("")?;
    let url = "http://localhost:28080/api/test";
    let response: Response = JsFuture::from(window.fetch_with_str(url)).await?.into();
    let json = JsFuture::from(response.json()?).await?;

    Ok(json)
}
