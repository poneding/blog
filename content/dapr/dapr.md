[🏠 首页](../_index.md) / [Dapr](_index.md) / Dapr 0-1

# Dapr 0-1

## 介绍

Dapr（Distributed Application Runtime）,提供分布式应用运行所需要的环境。

Sidecar架构。

目的：

快速落地微服务，将业务和基础设施分离，专注于业务开发，降低微服务的复杂性。

运行环境：

- 服务发现
- 负载均衡
- 故障转移
- 熔断限流
- 缓存
- 异步通信
- 日志组件
- 链路监控
- ...

核心功能：

1. Service Invocation（服务调用）
2. State Management（状态管理）
3. Publish and Subscribe（消息发布订阅）
4. Resource bingdings and triggers（资源绑定，事件触发）
5. Actors（单线程模型）分布式锁
6. Observability（遥测）ELK，链路监控，告警
7. Secrets（安全）IdentityServer4

## 安装

### 依赖

- Docker：<https://docs.docker.com/install/>

> 注意：windows平台，Docker必须运行Linux Containers模式

### 安装cli

<https://github.com/dapr/cli>

以在linux中安装dapr为例：

```bash
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O-|/bin/bash
```

```bash
dapr init --runtime-version
```

## Service Invocation

解决微服务之间通信的问题。

![alt text](https://images.poneding.com/2025/03/202503111825519.png)
