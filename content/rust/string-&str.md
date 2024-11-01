[🏠 首页](../_index.md) / [Rust 编程](_index.md) / String 还是 &str

# String 还是 &str

好用的规则：

1. 始终在结构体中使用 `String`；
2. 函数入参使用 `&str`，函数出参使用 `String`；
3. 如果函数出参来源于入参，并且函数中没有改变入参，那么出参使用 `&str`。

遵循以上的规则，大部分场景你将很好的避开 `String &str` 使用困难，即使有问题，编译器会告知你问题所在。

---
[« Rust WASM 编程](04-wasm-programming.md)
