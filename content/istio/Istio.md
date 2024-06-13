[🏠 首页](../_index.md) / [Istio](_index.md) / Istio

# Istio

## 简介

Istio，是一种服务网格的平台。在微服务系统中起着连接，保护，控制和观察服务的作用。它可以降低微服务部署的复杂程度，减轻开发团队压力，无缝接入现有分布式应用程序，可以集成日志，遥测，和策略系统的 API 接口。

**服务网格**：

Service Mesh 是一个基础设施层，用于处理服务间通信。云原生应用有着复杂的服务拓扑，Service Mesh 保证请求可以在这些拓扑中可靠地穿梭。在实际应用当中，Service Mesh 通常是由一系列轻量级的网络代理组成的，它们与应用程序部署在一起，但应用程序不需要知道它们的存在。

用来描述组成应用程序的微服务网络以及它们之间的交互。

实现需求包括：

- 服务发现
- 负载均衡
- 故障恢复
- 指标和监控
- A/B 测试
- 金丝雀发布
- 速率控制
- 访问控制
- 端到端认证

## istioctl

管理 istio 的命令行工具。

## 安装

```bash
curl -L https://istio.io/downloadIstio | sh -

cp istio-x.x.x /usr/local
cd istio-x.x.x
 
export PATH=$PWD/bin:$PATH
```

- Istio 的绝大多数治理能力都是在 Sidecar 而非应用程序中实现，因此是非侵入的；
- Istio 的调用链埋点逻辑也是在 Sidecar 代理中完成，对应用程序非侵入，但应用程序需做适当的修改，即配合在请求头上传递生成的 Trace 相关信息。

关键功能：

- 流量管理
- 可观察性
- 策略执行
- 服务身份和安全
- 平台支持
- 集成和定制

## 架构

![Istio 应用的整体架构](https://fs.poneding.com/images/arch.svg)

### 数据面板

#### Envoy

Envoy 是用 C++ 开发的高性能代理，用于协调服务网格中所有服务的入站和出站流量。Envoy 代理是唯一与数据平面流量交互的 Istio 组件。

### 控制面板

#### Pilot

为 Envoy sidecar 提供服务发现、用于智能路由的流量管理功能（例如，A/B 测试、金丝雀发布等）以及弹性功能（超时、重试、熔断器等）。

**结构**：

- Abstract Model
- Platform Adapter

**功能**：

- 请求路由
- 服务发现和负载均衡
- 故障处理
- 故障注入
- 规则配置

#### Citadel

通过内置的身份和证书管理，可以支持强大的服务到服务以及最终用户的身份验证。

#### Galley

是 Istio 的配置验证、提取、处理和分发组件。它负责将其余的 Istio 组件与从底层平台（例如 Kubernetes）获取用户配置的细节隔离开来。

#### Mixer

## 流量管理

服务注册中心，服务发现系统，默认轮询策略 负载均衡池

### 虚拟服务（Virtual Service）

虚拟服务让您配置如何在服务网格内将请求路由到服务，这基于 Istio 和平台提供的基本的连通性和服务发现能力。

**示例**：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  gateway:
  
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2
  - route:
    - destination:
        host: reviews
        subset: v3
```

#### 路由规则

```yaml
- match:
   - headers:
       end-user:
         exact: jason
- match:
   - uri:
       prefix: /reviews         
```

> 路由规则的优先级：从上往下，满足规则即流向路由目标

#### Destination

```yaml
route:
- destination:
    host: reviews
    subset: v1
  weight: 90
- destination:
    host: reviews
    subset: v2
  weight: 10
```

### 目标规则（Destination Rule）

Deployment => Pod => Service => DestinationRule => VirtualService=> Gateway

负载均衡的子集

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: my-destination-rule
spec:
  host: my-svc
  trafficPolicy:
    loadBalancer:
      simple: RANDOM
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
    trafficPolicy:
      loadBalancer:
        simple: ROUND_ROBIN
  - name: v3
    labels:
      version: v3
```

> 子集基于一个或多个 labels
>
> `subsets.trafficPolicy.loadBalancer.simple` 指定访问 Service 后端的 endpoint 的流量策略。RANDOM：随机，ROUND_ROBIN：轮询。

### 网关（Gateway）

为网格来管理入站和出站流量，可以让您指定要进入或离开网格的流量。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: ext-host-gwy
spec:
  selector:
    app: my-gateway-controller
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    hosts:
    - ext-host.example.com
    tls:
      mode: SIMPLE
      serverCertificate: /tmp/tls.crt
      privateKey: /tmp/tls.key
```

> 将指定 host 的流量流入网格，然后将网关绑定到 VirtualService 上进行路由规则的指定。

### 服务入口（Service Entry）

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: svc-entry
spec:
  hosts:
  - ext-svc.example.com
  ports:
  - number: 443
    name: https
    protocol: HTTPS
  location: MESH_EXTERNAL
  resolution: DNS
```

### Sidecar

### 网络弹性和测试

#### 超时

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - route:
    - destination:
        host: ratings
        subset: v1
    timeout: 10s
```

> 下面的示例是一个虚拟服务，它对 ratings 服务的 v1 子集的调用指定 10 秒超时。

#### 重试

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - route:
    - destination:
        host: ratings
        subset: v1
    retries:
      attempts: 3
      perTryTimeout: 2s
```

> 下面的示例配置了在初始调用失败后最多重试 3 次来连接到服务子集，每个重试都有 2 秒的超时。

#### 熔断

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  subsets:
  - name: v1
    labels:
      version: v1
    trafficPolicy:
      connectionPool:
        tcp:
          maxConnections: 100
```

> 到达目标主机的请求超过预设值，则触发熔断，停止请求连接到该主机。

#### 故障注入（混沌工程）

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - fault:
      delay:
        percentage:
          value: 50
        fixedDelay: 5s      
    route:
    - destination:
        host: ratings
        subset: v1        
```

> 下面的虚拟服务为百分之五十的访问 `ratings` 服务的请求配置了一个 5 秒的延迟。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - fault:
      abort:
        httpStatus: 500
        percentage:
          value: 100
    route:
    - destination:
        host: ratings
        subset: v1
```

> 下面的虚拟服务为所有访问 `ratings` 服务的请求配置了一个中止响应。

#### 流量转移

逐步调整百分比的流量，完成由部分路由到完全路由的迁移升级。

如：v1 80% + v2 20% => v2 100%

## 记录

管理 ingressgateway https 连接使用AWS的 TLS 密钥和证书。

```yaml
kind: Service
apiVersion: v1
metadata:
  name: istio-ingressgateway
  namespace: istio-system
  ...
  annotations:
    ...
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: >-
      arn:aws:acm:ap-southeast-1:314566904004:certificate/379dd055-44a7-42b6-a303-84938146b304
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: https
```

**Gateway**：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: demo-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
    tls:
      httpsRedirect: true # sends 301 redirect for http requests
  - port:
      number: 443
      name: https-443
      protocol: HTTP
    hosts:
    - "*"
```

---
[» 使用 aws-acm 管理 tls 密钥和证书](aws-acm-tls-management.md)
