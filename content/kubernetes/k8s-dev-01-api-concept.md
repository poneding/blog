[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 定制开发 01：K8s API 概念

# Kubernetes 定制开发 01：K8s API 概念

在 K8s 集群中，API 是一切的基础，K8s 的所有资源对象都是通过 API 来管理的，所以我们在定制开发的时候，首先要了解 K8s 的 API 概念。

## 基本概念

**Group（G）**：

API 组，例如：`apps`、`networking.k8s.io` 等

**Version（V）**：

API 版本，例如：`v1alpha1`、`v1`、`v2` 等

**Resource（R）**：

API 资源，例如：`pods`，`configmaps` 等

**Kind（K）**：

API 类型，例如：Deployment，Service 等
通过 `kubectl api-versions` 获取集群中所有 API 的版本列表：

```bash
$ kubectl api-versions
acme.cert-manager.io/v1
admissionregistration.k8s.io/v1
apiextensions.k8s.io/v1
apiregistration.k8s.io/v1
apps/v1
authentication.k8s.io/v1
```

通过 `kubectl api-resources` 命令获取集群所有 API 的资源列表，并且可以看到资源的简写名称，版本以及类型：

```bash
$ kubectl api-resources
NAME                              SHORTNAMES   APIVERSION                             NAMESPACED   KIND
bindings                                       v1                                     true         Binding
componentstatuses                 cs           v1                                     false        ComponentStatus
configmaps                        cm           v1                                     true         ConfigMap
endpoints                         ep           v1                                     true         Endpoints
events                            ev           v1                                     true         Event
limitranges                       limits       v1                                     true         LimitRange
namespaces                        ns           v1                                     false        Namespace
nodes                             no           v1                                     false        Node
```

## API 资源端点

GVR 端点：

- `/api`，只会获取到 v1 的 APIVersion（组名为空）
- `/apis`，获取到所有非核心 API 的 APIGroupList
- `/api/v1`，获取到 APIResourceList
- `/apis/{g}/`，获取到 APIGroup
- `/apis/{g}/v1`，获取到 APIResourceList

命名空间资源端点：

- 核心 api：`/api/{v}/namespaces/{ns}/{r}`，例如：/api/v1/namespaces/default/configmaps
- 其他 api：`/apis/{g}/{v}/namespaces/{ns}/{r}`，例如：apis/apps/v1/namespaces/default/deployments

集群资源端点：

- 核心 api：`/api/{v}/{r}`，例如：/api/v1/nodes
- 其他资源：`/apis/{g}/{v}/{r}`，例如：/apis/rbac.authorization.k8s.io/v1/clusterroles

在使用 `kubectl get` 命令获取集群资源实例时，可以通过添加 `-v 6` 查看执行命令的请求端点：

```bash
$ k get nodes -v 6
I0915 11:32:43.715795   18197 loader.go:373] Config loaded from file:  /Users/dp/.kube/config
I0915 11:32:43.855325   18197 round_trippers.go:553] GET https://127.0.01:6443/api/v1/nodes?limit=500 200 OK in 135 milliseconds
NAME    STATUS   ROLES           AGE    VERSION
local   Ready    control-plane   115d   v1.27.2
```

## APIService

每个 API 版本都对应一个 APIService：

```bash
$ k api-versions | wc -l
  30
$ k get apiservices.apiregistration.k8s.io| wc -l
  30
```

## 创建一个 CRD

*foo-crd.yaml*：

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # 固定格式 {kind_plural}.{group}，其中 foos 对应 spec.names.plural，play.ketches.io 对应 spec.group
  name: foos.play.ketches.io
spec:
  group: play.ketches.io # 资源组，用在 URL 标识资源所属 Group，如 /apis/play.ketches.io/v1/foos 之 foos.play.ketches.io
  names:
    kind: Foo
    listKind: FooList
    plural: foos  # 资源名复数，用在 URL 标识资源类型，如 /apis/play.ketches.io/v1/foos 之 foos
    singular: foo # 资源名单数，可用于 kubectl 匹配资源
    shortNames:   # 资源简称，可用于 kubectl 匹配资源
    - fo
  scope: Namespaced # Namespaced/Cluster
  versions:
  - name: v1
    served: true # 是否启用该版本，可使用该标识启动/禁用该版本 API
    storage: true # 唯一落存储版本，如果 CRD 含有多个版本，只能有一个版本被标识为 true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            required: ["msg"] # 必须赋值
            properties:
              msg:
                type: string
                maxLength: 6
    additionalPrinterColumns: # 声明 kubectl get 输出列，默认在 name 列之外额外输出 age 列，改为额外输出 age 列，message 列
    - name: age
      jsonPath: .metadata.creationTimestamp
      type: date
    - name: message
      jsonPath: .spec.msg
      type: string
```

获取 CRD 对应的 APIService：

```bash
~ k get apiservices.apiregistration.k8s.io v1.play.ketches.io
NAME                 SERVICE   AVAILABLE   AGE
v1.play.ketches.io   Local     True        3h26m
```

一般这时候 SERVICE 为 Local，表示 对该资源的 APIService 请求会在本地处理，也就是 kube-apiserver 处理，我们可以将其改为一个在集群中运行的 Service 名，例如：default/play-v1-svc。你需要修改 APIService 的声明：

```yaml
apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  labels:
    kube-aggregator.kubernetes.io/automanaged: "true"
  name: v1.play.ketches.io
spec:
  group: play.ketches.io
  groupPriorityMinimum: 1000
  version: v1
  versionPriority: 100
  service:
    name: play-v1-svc
    namespace: default
  insecureSkipTLSVerify: true
```

这时候对 `play.ketches.io/v1` 组下的资源的请求处理会交给该服务。
即：`/apis/play.ketches.io/v1/namespaces/{ns}/foos/*` => `default/play-v1-svc`，其实这就是一个 自定义的 apiserver 了。
但是一个自定义的 apiserver 需要实现以下这些处理（Handler）：

- for API Discovery
  - /apis
  - /apis/play.ketches.io
  - /apis/play.ketches.io/v1
- for OpenAPI Schema
  - /openapi/v2
  - /openapi/v3
- for Foo CRUD
  - /apis/play.ketches.io/v1/foos
  - /apis/play.ketches.io/v1/namespaces/{namespace}/foos
  - /apis/play.ketches.io/v1/namespaces/{namespace}/foos/{name}

### OpenAPI

API 的 Schema 会
`kubectl explain` 命令输出内容来源于 OpenAPI Spec。

## 参考

- [K8s CustomResourceDefinitions (CRD) 原理](https://www.zeng.dev/post/2023-k8s-api-by-crd)
- [实现一个极简 K8s apiserver](https://www.zeng.dev/post/2023-k8s-apiserver-from-scratch/)

---
[« Kubernetes 0-1 K8s部署Zookeeper和Kafka](k8s-deploy-zookeeper-kafka.md)

[» Kubernetes 定制开发 02：CRD](k8s-dev-02-crd.md)
