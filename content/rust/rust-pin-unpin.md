[🏠 首页](../_index.md) / [Rust 编程](_index.md) / Rust Pin 和 Unpin

# Rust Pin 和 Unpin

Pin 和 Unpin 是 Rust 异步编程中的概念，Pin 是一个包裹了指针的结构体。

```rust
pub struct Pin<P> {
	pointer: P,
}
```

Rust 中的类型可以分为两类：
- 类型的值可以在内存中安全的移动：绝大多数的类型（自动实现了 Unpin 特征）
- 自引用类型

自引用类型示例：

```rust
struct SelfRef {
	val: String,
	pointer_of_val: *mut String
}
```

> 其中 `pointer_of_val` 是指向 `val` 的裸指针。这时候，如果 val 被移动，那么 pointer_of_val  指向的地址会引起一个 bug 了。

Pin 即为了避免这类情况发生，表示该指针指向的数据不会被移动。Unpin 则相反。

## Unpin 

不好意思，Unpin 是一个实打实的特征。

Pin 住的值并没有实现啥我们想象的 Pin 特征，而是实现了 `!Unpin` 特征。`!` 表示没有实现某个特征的意思。`!Unpin` 说明类型没有实现 Unpin 特征，那就说明可以被 Pin。绝大多数我们知道的类型都默认实现了 Unpin，那么自然，这些类型是不能被 Pin 的，即使写法上允许 Pin，但是并没有任何效果。

所以，一个类型如果不能移动，必须实现 `!Unpin` 特征。

和 `Send/Sync` 对比：
- 都是标记特征（marker trait），该特征未定义任何行为，适用于标记；
- 都可以通过 `!` 语法去除实现；
- 绝大多数情况下自动实现

## Pin

现在我们可以将 Pin 理解为一种处理自引用类型的解决方案。

---
[« Rust WASM 编程](04-wasm-programming.md)

[» String 还是 &str](string-&str.md)
