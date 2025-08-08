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
    return augend + addend;
}

#[wasm_bindgen]
pub fn rust_sub(minuend: f64, subtrahend: f64) -> f64 {
    return minuend - subtrahend;
}

#[wasm_bindgen]
pub fn rust_mul(multiplicand: f64, multiplier: f64) -> f64 {
    return multiplicand * multiplier;
}

#[wasm_bindgen]
pub fn rust_div(dividend: f64, divisor: f64) -> f64 {
    return dividend / divisor;
}
