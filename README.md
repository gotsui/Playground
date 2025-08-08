# WebAssembly


## rust

参考

[Rust から WebAssembly にコンパイル](https://developer.mozilla.org/ja/docs/WebAssembly/Guides/Rust_to_Wasm)

### ライブラリプロジェクト作成

```sh
cargo init --lib .
```

### コンパイル

Cargo.toml

```diff
+ [lib]
+ crate-type = ["cdylib"]

[dependencies]
+ wasm-bindgen = "0.2"
```

ビルド

```sh
wasm-pack build --target web
```

npmでWebAssemblyモジュールを使用する場合

```sh
wasm-pack build --target bundler
```

## node

### プロジェクト作成

```sh
npx create-next-app --typescript .

✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like your code inside a `src/` directory? … Yes
✔ Would you like to use App Router? (recommended) … Yes
✔ Would you like to use Turbopack for `next dev`? … Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No
```

### webpackのインストール

```sh
npm i -D webpack
```

依存関係

```sh
npm i -D webpack@5 webpack-cli@5 webpack-dev-server@5 copy-webpack-plugin@12
```

next.config.ts

```diff
import type { NextConfig } from "next";
+ import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
+   webpack(config: Configuration, { isServer }) {
+     config.experiments = {
+       ...config.experiments,
+       asyncWebAssembly: true,
+       layers: true,
+     }
+   }
};

+ module.exports = nextConfig;

export default nextConfig;
```
