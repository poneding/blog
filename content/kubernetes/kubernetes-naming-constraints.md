[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 中资源名称规范

# Kubernetes 中资源名称规范

在Kubernetes中，同一种资源（GVR）在同一个命名空间下名称是唯一。但是名称也需要遵循命名规则。本篇主要介绍 Kubernetes 中三种资源名称的命名规范。

## DNS1123Subdomain

- 不能超过 253 个字符
- 只能包含小写字母、数字，以及 '-' 和 '.'
- 必须以字母数字开头
- 必须以字母数字结尾

以此规范约束的资源有：

- Ingress
- Pod
- ConfigMap
- NetworkPolicy

## DNS1123Label

- 最多 63 个字符
- 只能包含小写字母、数字，以及 '-'
- 必须以字母数字开头
- 必须以字母数字结尾

以此规范约束的资源有：

- Namespace
- Service

## DNS1035Label

- 最多 63 个字符
- 只能包含小写字母、数字，以及 '-'
- 必须以字母开头
- 必须以字母数字结尾

以此规范约束的资源有：

- Deployment
- StatefulSet

## 建议

如果资源命名符合 DNS1035Label 规范，那么一定符合 Kubernetes 资源命名规范。假如在容器平台开发过程中，为了命名约束更加统一，建议使用 DNS1035Label 规范来约束资源命名。

可以使用下面的代码（Go）来检查资源名称是否符合规范：

引入包：

```bash
go get k8s.io/apimachinery/pkg/util/validation
```

示例代码：

```go
package main

import (
    "k8s.io/apimachinery/pkg/util/validation"
)

func main() {
    namespace: = "test-ns"

    if msgs := validation.IsDNS1123Subdomain(namespace); len(msgs) > 0 {
        fmt.Println("namespace name is not valid")
    }
}
```

---
[« Kubernetes Dashboard](kubernetes-dashboard.md)

[» Kuberentes](kubernetes.md)
