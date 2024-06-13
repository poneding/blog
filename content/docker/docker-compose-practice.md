[🏠 首页](../_index.md) / [Docker](_index.md) / Docker Compose 实践

# Docker Compose 实践

## 安装

如果你安装了 `Docker Desktop`，那么它已经帮你自动安装了 `Docker Compose` 插件。否则，需要额外安装插件。

使用一下命令安装或升级 `Docker Compose`（linux）：

- Ubuntu，Debian：

```bash
sudo apt update
sudo apt install docker-compose-plugin
```

- 基于 RPM 发行版:

```bash
sudo yum update
sudo yum install docker-compose-plugin
```

验证安装版本：

```bash
docker-compose version
```

## 常用命令

运行

```bash
docker-compose up
```

查看运行

```bash
docker-compose ps
```

停止

```bash
docker-compose stop
```

启动&重启

```bash
docker-compose start
docker-compose restart
```

退出

```bash
docker-compose down
```

使用 `docker-compose -h` 查看更多命令及参数。

## 实践

使用 `Docker Compose` 运行一个简单的 golang web 程序。

1. 程序初始化

```bash
mkdir docker-compose-go-demo
cd docker-compose-go-demo
go mod init docker-compose-go-demo
```

2. 创建 `main.go` 文件，并写入程序代码

```golang
package main

import (
    "fmt"
    "net/http"
    "time"
)

func greet(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello Docker Compose! %s", time.Now())
}

func main() {
    http.HandleFunc("/", greet)
    http.ListenAndServe(":8080", nil)
}
```

3. 创建 `Dockerfile` 文件，并编写内容

```dockerfile
FROM golang:alpine
WORKDIR /app
COPY . .

EXPOSE 8080
ENTRYPOINT [ "go","run","main.go" ]
```

4. 创建 `docker-comppose.yml` 文件，并编写内容

```yaml
version: "3.9"
services:
  web:
    build: .
    # image: docker-compose-go-demo_web:v1
    # image: docker-compose-go-demo_web:v2
    ports:
      - "8080:8080"
```

5. 启动服务

```bash
docker-compose up -d
```

场景：

- web 服务业务代码修改了，希望不停机更新服务：

```bash
docker-compose up -d --build
```

- 包含多个服务，例如中间件，但只想重新编译其中业务服务，如 web：

```bash
docker-compose up -d --no-deps --build web
```

> 如果 `docker-compose.yml` 直接使用的镜像，那么直接更新，再次 `docker-compose up -d` 即可。

---
[« Docker 常用命令](docker-commands.md)

[» Docker 容器中安装 PFX 证书](docker-container-install-pfx-cert.md)
