# Rust Pin 和 Unpin

Pin 和 Unpin 是 Rust 异步编程中的概念。

Rust 中的类型可以分为两类：

- 类型的值可以在内存中安全的移动：绝大多数的类型
- 自引用类型

自引用类型示例：


