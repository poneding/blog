[🏠 首页](../_index.md) / [Istio](_index.md) / 应用平台实现应用金丝雀发布

# 应用平台实现应用金丝雀发布

## 实现思路

应用正常的 CI 流程添加请求参数：

- CanaryMode【bool，true | false，缺省值 false】
- CanaryWeight 【int，缺省值 10】

使用 Istio 的 `DetinationRule + VirtualService` 实现流量按权重分配到不同版本应用。

## 概念

**Iteration**：发布迭代号，。是一个字段值，使用金丝雀发布时累加该值，从 0 累加。

**Retract**：动作，弃用金丝雀版本。当金丝雀版本存在不可忽视的问题时撤回金丝雀执行该动作。

**Ratify**：动作，确认使用金丝雀版本。当金丝雀版本确认可以全面投入使用执行该动作。

## 前提

使用金丝雀发布的前提条件：

- 应用处于发布状态，已经至少发布一次，当前存在稳定的运行版本；
- 应用已经开启 Istio Gateway，涉及到 VirtualService 的流量转发；
- 应用当前不是金丝雀状态，要不然乱套了。

## 发布细节

CI 发布除了创建或更新 Deployment，Service 之外，默认创建或更新 istio 的 DestinationRule 资源；

*deployment*：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-pbd3n69-v{iteration}  # 出于兼容历史发布，当iteration为0时，name不附带iteration，iteration大于0时，name将附带iteration  
  labels:
    app: myapp-pbd3n69
    version: v{iteration}
spec:
  selector:
    matchLabels:
      app: myapp-pbd3n69
      version: v{iteration}
  template:
    metadata:
      labels:
        app: myapp-pbd3n69
        version: v{iteration}
...
```

*service*：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-pbd3n69
spec:
  selector:
    app: myapp-pbd3n69
...
```

*destination rule*：

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: myapp-pbd3n69
spec:
  host: myapp-pbd3n69  # 注意：这里是 Service 的 name
  subsets:
    - labels:
        version: v{iteration}
      name: subset-v{iteration}
```

*virtual service*：

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: virtual-service-example-com
spec:
  hosts:
    - example.com
  http:
    - match:
        - uri:
            prefix: /xxx
      name: myapp-pbd3n69
      route:
        - destination:
            host: myapp-pbd3n69  # 注意：这里是 Service 的 name
            port:
              number: 80
            subset: subset-v{iteration}
          weight: 100
```

使用金丝雀发布，涉及到金丝雀版本 Deployment 的创建，DestinationRule 和 VirtualService 的更新：

*deployment*：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-pbd3n69-v{iteration+1}  
  labels:
    app: myapp-pbd3n69
    version: v{iteration+1}
spec:
  selector:
    matchLabels:
      app: myapp-pbd3n69
      version: v{iteration+1}
  template:
    metadata:
      labels:
        app: myapp-pbd3n69
        version: v{iteration+1}
```

*destination rule*：

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: ash-pbd3n69
  namespace: test
spec:
  host: ash-pbd3n69  # 注意：这里是 Service 的 name
  subsets:
    - labels:
        version: v{iteration}
      name: subset-v{iteration}
    - labels:
        version: v{iteration+1}
      name: subset-v{iteration+1}
```

*virtual service*：

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: virtual-service-example-com
spec:
  hosts:
    - example.com
  http:
    - match:
        - uri:
            prefix: /xxx
      name: myapp-pbd3n69
      route:
        - destination:
            host: myapp-pbd3n69  # 注意：这里是 Service 的 name
            port:
              number: 80
            subset: subset-v{iteration}
          weight: {canaryWeight}
        - destination:
            host: myapp-pbd3n69  # 注意：这里是 Service 的 name
            port:
              number: 80
            subset: subset-v{iteration+1}
          weight: {100-canaryWeight}
```

发布完成后，Iteration+1，应用状态更新为 Canary。在 Canary 状态下，由于存在两个版本的 Deployment，将无法手动应用垂直或水平扩容。

## 撤回（Retract）

删除金丝雀版本的 Deployment，

DestinationRule 更新

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: ash-pbd3n69
  namespace: test
spec:
  host: ash-pbd3n69  # 注意：这里是 Service 的 name
  subsets:
    - labels:
        version: v{iteration-1}
      name: subset-v{iteration-1}
```

VirtualService 更新

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: virtual-service-example-com
spec:
  hosts:
    - example.com
  http:
    - match:
        - uri:
            prefix: /xxx
      name: myapp-pbd3n69
      route:
        - destination:
            host: myapp-pbd3n69  # 注意：这里是 Service 的 name
            port:
              number: 80
            subset: subset-v{iteration-1}
          weight: 100
```

Iteration-1

## 批准（Ratify）

删除之前稳定版本的 Deployment，

DestinationRule 更新

```yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: ash-pbd3n69
  namespace: test
spec:
  host: ash-pbd3n69  # 注意：这里是 Service 的 name
  subsets:
    - labels:
        version: v{iteration}
      name: subset-v{iteration}
```

VirtualService 更新

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: virtual-service-example-com
spec:
  hosts:
    - example.com
  http:
    - match:
        - uri:
            prefix: /xxx
      name: myapp-pbd3n69
      route:
        - destination:
            host: myapp-pbd3n69  # 注意：这里是 Service 的 name
            port:
              number: 80
            subset: subset-v{iteration}
          weight: 100
```

---
[« 授权策略 Authorization Policy](istio-auth-policy.md)

[» Istio 0-1 使用Istio实现Cors](istio-cors.md)
