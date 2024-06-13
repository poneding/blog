[🏠 首页](../_index.md) / [Istio](_index.md) / 应用层级设置访问白名单

# 应用层级设置访问白名单

## 需求

两个应用，`foo` 和 `bar`，应用 `foo` 只允许 `IP` 地址为 `1.2.3.4` 访问，应用 `bar` 只允许 `IP` 地址为 `5.6.7.8` 访问。

## 实现

基于 `istio` 的 `AuthorizationPolicy` 实现。

假设，现在 `K8s` 集群中已经安装 `istio`，并且有一个正在运行着的 `istio-ingressgateway` 转发应用 `foo` 和 `bar`：

> 通过：<https://www.example.com/foo> 访问 `foo`;
>
> 通过：<https://www.example.com/bar> 访问 `bar`;

### 插曲

按照 `istio` 官方文档，使用 `AuthorizationPolicy` 即可实现基于应用层级的访问白名单设置：

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: foo
spec:
  selector:
    matchLabels:
      app: foo
  action: ALLOW
  rules:
    - from:
        - source:
            ipBlocks: ["1.2.3.4"]
```

> 想让以上AuthorizationPolicy生效，需要在 `foo` 工作负载所在的命名空间注入 `istio-proxy`，通过给命名空间添加 label，添加 lable 后，工作负载启动新的 Pod 会自动注入 `istio-proxy` 容器：
>
> ```bash
> kubectl label namespace default istio-injection=enabled
> ```

但是，你会发现你使用 `https://www.example.com/foo` 一直返回的信息都是 `RBAC: access denied`。为什么会这样呢？

如果你在 `ipBlocks` 中加入 `istio-ingressgateway`（是一个 Deployment）Pod 的 IP，你会发现这时候是可以成功访问的。

分析流量的转发路径应该就能知道，实际上到达目标应用 `foo` 的请求，都由`istio-ingressgateway`转发了，所以源 IP 都会是 `istio-ingressgateway` Pod 的 IP，从而导致外部访问 IP 的白名单设置无法生效。

那么如果获取外部IP呢。

### 最终方案

**Step 0: 获取客户端源IP**：

> 如果使用 AWS-EKS 创建 `istio-ingressgateway` 服务时默认创建的 `classic` 类型的 LoadBalancer，需要修改成 `network`类型：
>
> 通过向 istio-ingressgateway Service 添加 annotation：`service.beta.kubernetes.io/aws-load-balancer-type: nlb`

更新 `istio-gateway` Service：`spec.externalTrafficPolicy: Local`，现在访问工作负载可以获取到源 IP，这就为我们设置 IP 白名单造就了条件。

现在只需要为这个 `istio-ingressgateway` 应用上 `AuthorizationPolicy` 即可：

**Step 1: 默认允许所有 `IP` 访问 `istio-ingressgateway`**：

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: allow-all-for-istio-ingressgateway
  namespace: istio-system
spec:
  selector:
    matchLabels:
      istio: ingressgateway
  action: ALLOW
  rules:
    - from:
        - source:
            ipBlocks: ["0.0.0.0/0"]
```

> 默认是允许所有 `IP` 都可以访问 `istio-ingressgateway` 下转发的服务的，如果有服务例如 `foo` 和 `bar` 需要单独添加 `IP` 访问百名单则继续参考下面的步骤。

**Step 2: 只允许 IP `1.2.3.4` 访问 `foo`**：

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: foo
  namespace: istio-system
spec:
  selector:
    matchLabels:
      istio: ingressgateway
  action: DENY
  rules:
    - from:
        - source:
            notIpBlocks: ["1.2.3.4"]
      to:
        - operation:
            hosts:
              - www.example.com
            paths:
              - /foo
              - /foo/*
```

> 由于默认是允许所有 `IP` 都可以访问 `istio-ingressgateway` 下转发的服务，所以为单独应用设置访问百名的时候使用 `DENY` + `notIpBlocks` 来完成。
>
> `ipBlocks` 和 `notIpBlocks` 允许配置IP和IP的CIDR，例如：`1.2.3.4` 或 `1.2.3.4/24`。

**Step 3: 只允许 IP `5.6.7.8` 访问 `bar`**：

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: bar
  namespace: istio-system
spec:
  selector:
    matchLabels:
      istio: ingressgateway
  action: DENY
  rules:
    - from:
        - source:
            notIpBlocks: ["5.6.7.8"]
      to:
        - operation:
            hosts:
              - www.example.com
            paths:
              - /bar
              - /bar/*
```

## 附录

如果相同的 LoadBalancer 下的服务都是用同一白名单设置的话，则没必要这么麻烦的设置 `AuthorizationPolicy` 了，只需要为 Service 设置参数即可：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: istio-gateway
...
spec:
  type: LoadBalancer
  loadBalancerSourceRanges:
    - "1.2.3.4/24"
...
```

---
[« 使用 Istio 实现服务超时](istio-timeout.md)

[» 实现 Https 协议的转发](tls-transform.md)
