[🏠 首页](../_index.md) / [Istio](_index.md) / 实现 Https 协议的转发

# 实现 Https 协议的转发

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: demo
spec:
  http:
  - headers:
      request:
        set:
          X-Forwarded-Proto: https
    match:
    - uri:
        prefix: /
    name: demo.default
```

---
[« 应用层级设置访问白名单](istio-white-manifest.md)

[» Istio 0-1 流量管理方案](traffic-management.md)
