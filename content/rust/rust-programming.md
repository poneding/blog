[🏠 首页](../_index.md) / [Rust 编程](_index.md) / 查看根目录

Rust 编程

## 信息

```bash
# 查看根目录
rustc --print sysroot

# 二进制程序位置
$(rustc --print sysroot)/bin

# 源码位置 
$(rustc --print sysroot)/lib/rustlib/src/
```

## String 与 &str

String：字符串

&str：字符串切片

```rust
let s: &str = "Hello World!";

let s1 = s.to_string(); 
let s1 = String::from(s);

let s2 = &s1[..];
let s2 = s1.as_ref();
```

## Panic

设置 `RUST_BACKTRACE=1` 环境变量值，可以追踪到 panic 位置，例如：

---
[« Rust 入门](getting-started.md)

[» Rust VSCode 调试](vscode-debugging.md)
