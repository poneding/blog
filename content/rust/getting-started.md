[🏠 首页](../_index.md) / [Rust 编程](_index.md) / Rust 入门

# Rust 入门

Rust 是一种系统编程语言，类似于 C 和 C++。它的设计目标是提供安全性和并发性，同时保持高性能。Rust 通过所有权系统来实现这些目标。

## 安装 Rust

MacOS，linux 或其他类 Unix 系统用户可以直接在终端中运行以下命令安装 Rust：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Windows 用户可以在 [Rust 官网](https://www.rust-lang.org/tools/install) 下载安装程序。

## Hello, World

让我们从一个简单的 "Hello, World!" 程序开始。创建一个新文件 `main.rs` 并输入以下内容：

```rust
fn main() {
    println!("Hello, World!");
}
```

要运行这个程序，使用 `rustc` 编译器：

```bash
rustc main.rs && ./main
```

执行后，你应该看到输出 `Hello, World!`。

---
[« Rust 开发环境配置](dev-env-config.md)

[» 查看根目录](rust-programming.md)
