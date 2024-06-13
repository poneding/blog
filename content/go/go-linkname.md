[🏠 首页](../_index.md) / [Golang 编程](_index.md) / go:linkname 指令

# go:linkname 指令

## 背景

阅读 Golang 源码时，发现在标准库 `time.Sleep` 方法没有没有方法体。如下：

```go
// Sleep pauses the current goroutine for at least the duration d.
// A negative or zero duration causes Sleep to return immediately.
func Sleep(d Duration)
```

当我们直接在代码中写一个空方法 `func Foo()`，编译时会报错：missing function body。所以标准库使用了什么魔法来实现空方法的呢？
进一步研究，得知 `time.Sleep` 运行时实际调用了 `runtime.timeSleep`方法，如下：

```go
// timeSleep puts the current goroutine to sleep for at least ns nanoseconds.
//
//go:linkname timeSleep time.Sleep
func timeSleep(ns int64) {
    if ns <= 0 {
        return
    }

    gp := getg()
    t := gp.timer
    if t == nil {
        t = new(timer)
        gp.timer = t
    }
    t.f = goroutineReady
    t.arg = gp
    t.nextwhen = nanotime() + ns
    if t.nextwhen < 0 { // check for overflow.
        t.nextwhen = maxWhen
    }
    gopark(resetForSleep, unsafe.Pointer(t), waitReasonSleep, traceBlockSleep, 1)
}
```

那么这是如何实现的呢？细心一点的话你就会发现在 `runtime.timeSleep` 的注释上发现 `//go:linkname` 指令，按我们就需要花点时间研究一下这个玩意儿了。

## 介绍

`go:linkname`指令的规范如下：

```go
//go:linkname localname importpath.name
```

这个指令实际是在告诉 Golang 编译器，将本地的变量或方法（localname）链接到导入的变量或方法（importpath.name）。
由于该指令破坏了类型系统和包的模块化原则，只有在引入 `unsafe` 包的前提下才能使用这个指令。
好了，现在我们知其所以然了，我们尝试来实现一个“空方法”吧！

## 示例

创建一个项目：

```go
make golinkname-demo
cd golinkname-demo

go mod init golinkname-demo
touch main.go
```

编写 _main.go_ 代码：

```go
package main

import (
    "fmt"

    _ "unsafe"
)

func main() {
    Foo()
}

//go:linkname Foo main.myFoo
func Foo()

func myFoo() {
    fmt.Println("myFoo called")
}
```

运行：

```go
$ go run main.go
myFoo called
```

完成！

## 拓展

使用 `go:linkname` 来引用第三方包中私有的变量和方法：

```go
package mypkg

import (
    _ "unsafe"

    _ "github.com/xxx/xxx/internal"
)

//go:linkname a github.com/xxx/xxx/internal.a
var a int

//go:linkname Foo github.com/xxx/xxx/internal.foo
func Foo()
```

---
[« Golang 生成证书](go-gen-cert.md)

[» Golang 列表转树](go-list-to-tree.md)
