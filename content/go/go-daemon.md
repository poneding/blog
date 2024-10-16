[🏠 首页](../_index.md) / [Golang 编程](_index.md) / Golang 守护进程

# Golang 守护进程

在 Go 中编写后台运行的程序（Daemon）的常见步骤涉及到以下几个方面：

## 创建守护进程

守护进程是一个在后台运行、不受用户交互影响的程序。你可以通过调用 `syscall` 包中的一些系统调用让 Go 程序变为后台运行的守护进程。

示例代码：

*fork.go*

```go
package main

import (
  "fmt"
  "os"
  "slices"
  "syscall"
)

func init() {
  if slices.Contains(os.Args, "-d") {
    // Fork 出子进程并获取其 PID
    newArgs := make([]string, 0)
    for _, arg := range os.Args {
      if arg == "-d" {
        continue
      }
      newArgs = append(newArgs, arg)
    }

    pid, err := syscall.ForkExec(os.Args[0], newArgs, &syscall.ProcAttr{
      Files: []uintptr{uintptr(syscall.Stdin), uintptr(syscall.Stdout), uintptr(syscall.Stderr)},
    })
    if err != nil {
      fmt.Println("fork failed:", err)
      return
    }

    // 将子进程 PID 保存到文件
    file, err := os.Create("child_pid.txt")
    if err != nil {
      fmt.Println("create file failed:", err)
      return
    }
    defer file.Close()
    file.WriteString(fmt.Sprintf("pid: %d", pid))

    os.Exit(0) // 父进程退出
  }
}
```

*main.go*

```go
package main

import (
  "fmt"
  "io/fs"
  "log"
  "os"
  "time"
)

func main() {
  // 业务逻辑：每隔一秒向文件写入新内容
  for {
    time.Sleep(1 * time.Second)
    file, err := os.OpenFile("./hello", os.O_CREATE|os.O_WRONLY|os.O_APPEND, fs.FileMode(0644))
    if err != nil {
      log.Println("open file failed:", err)
      return
    }

    _, err = file.WriteString(fmt.Sprintf("[%s] Hello.\n", time.Now().Format(time.RFC3339)))
    if err != nil {
      log.Println("write file failed:", err)
    }
    file.Close()
  }
}
```

## 使用 `nohup` 命令运行

如果不想修改代码，可以直接在启动时使用 Linux 提供的 `nohup` 命令运行 Go 程序，使其不依赖终端，并自动重定向输出：

代码示例：

*main.go*

```go
package main

import (
  "fmt"
  "io/fs"
  "log"
  "os"
  "time"
)

func main() {
  // 业务逻辑：每隔一秒向文件写入新内容
  for {
    time.Sleep(1 * time.Second)
    file, err := os.OpenFile("./hello", os.O_CREATE|os.O_WRONLY|os.O_APPEND, fs.FileMode(0644))
    if err != nil {
      log.Println("open file failed:", err)
      return
    }

    _, err = file.WriteString(fmt.Sprintf("[%s] Hello.\n", time.Now().Format(time.RFC3339)))
    if err != nil {
      log.Println("write file failed:", err)
    }
    file.Close()
  }
}
```

运行：

```bash
go build -o main main.go
nohup ./main > output.log 2>&1 &
```

## 使用第三方库（如 go-daemon 包）

如果觉得自己管理后台运行逻辑比较麻烦，可以使用一些库，如 `github.com/sevlyar/go-daemon`，简化守护进程的实现。

代码示例：

*main.go*

```go
package main

import (
  "fmt"
  "io/fs"
  "log"
  "os"
  "time"

  "github.com/sevlyar/go-daemon"
)

func main() {
  cntxt := &daemon.Context{
    PidFileName: "sample.pid",
    PidFilePerm: 0644,
    LogFileName: "sample.log",
    LogFilePerm: 0640,
    WorkDir:     "./",
    Umask:       027,
  }

  d, err := cntxt.Reborn()
  if err != nil {
    fmt.Println("无法启动后台进程:", err)
    return
  }

  if d != nil {
    return
  }
  defer cntxt.Release()

  // 业务逻辑：每隔一秒向文件写入新内容
  for {
    time.Sleep(1 * time.Second)
    file, err := os.OpenFile("./hello", os.O_CREATE|os.O_WRONLY|os.O_APPEND, fs.FileMode(0644))
    if err != nil {
      log.Println("open file failed:", err)
      return
    }

    _, err = file.WriteString(fmt.Sprintf("[%s] Hello.\n", time.Now().Format(time.RFC3339)))
    if err != nil {
      log.Println("write file failed:", err)
    }
    file.Close()
  }
}
```

你可以根据你的需求选择合适的方法让 Go 程序后台运行。如果你有更具体的需求，欢迎提供更多细节。

---
[« Golang 不同平台架构编译](go-cross-complie.md)

[» Golang 生成证书](go-gen-cert.md)
