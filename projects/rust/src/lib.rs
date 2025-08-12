use wasm_bindgen::prelude::*;

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
