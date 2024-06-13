[🏠 首页](../_index.md) / [Istio](_index.md) / 授权策略 Authorization Policy

# 授权策略 Authorization Policy

## 授权架构

由于服务网格的 Sidecar 设计模式，每个工作负载都会有一个 Envoy 代理，而每个代理都运行着授权引擎，以此给请求授权。授权引擎依靠授权策略来鉴定请求权限，返回 `ALLOW` 或 `DENY` 鉴权结果。

![授权架构](https://fs.poneding.com/images/authz.svg)

## 授权启用

将授权策略应用到工作负载即生效访问控制。对于没有应用授权策略的工作负载，则不会对请求做访问控制。

## 授权策略

### 资源定义

**selector**：

标签选择器，通过标签选择器选择同命名空间下的目标工作负载，对目标工作负载启用访问控制。

**action**：

当满足rules条件时，控制ALLOW或DENY请求。

**rules**：

访问控制的请求条件：

- from：请求来源
- to：请求目标
- when：应用规则所需的提交

### 示例

以下授权策略允许两个源（服务帐号 `cluster.local/ns/default/sa/sleep` 和命名空间 `dev`），在使用有效的 JWT 令牌发送请求时，可以访问命名空间 foo 中的带有标签 `app: httpbin` 和 `version: v1` 的工作负载。

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
 name: httpbin
 namespace: foo
spec:
 selector:
   matchLabels:
     app: httpbin
     version: v1
 action: ALLOW
 rules:
 - from:
   - source:
       principals: ["cluster.local/ns/default/sa/sleep"]
   - source:
       namespaces: ["dev"]
   to:
   - operation:
       methods: ["GET"]
   when:
   - key: request.auth.claims[iss]
     values: ["https://accounts.google.com"]
```

下例授权策略，如果请求来源不是命名空间 `foo`，请求将被拒绝。

```yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
 name: httpbin-deny
 namespace: foo
spec:
 selector:
   matchLabels:
     app: httpbin
     version: v1
 action: DENY
 rules:
 - from:
   - source:
       notNamespaces: ["foo"]
```

---
[« 安装 Istio](installation.md)

[» 应用平台实现应用金丝雀发布](istio-canary-deploy.md)
