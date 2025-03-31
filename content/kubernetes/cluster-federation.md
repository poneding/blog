[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 集群联邦

# 集群联邦

云服务提供商的集群联邦是一种将多个独立的 Kubernetes 集群组合在一起的方法。这种方法允许用户在多个集群之间共享资源，例如 Pods、Services、Deployments 等。集群联邦的目标是在多个集群上引入新的控制面板，提供一个统一的视图，使用户可以在多个集群之间无缝地部署和管理应用程序。

![alt text](https://images.pding.top/2024/06/202406051732153.png)

## 概念

- 数据中心：Region，是一个物理位置，包含多个可用性区域。
- 可用性区域：Availability Zone（AZ），是一个独立的数据中心，包含 N 多服务器节点。
- 管理集群：或者宿主集群，是一个集群联邦的核心，用于管理多个工作集群。
- 联邦集群：或者工作集群，是一个普通的 Kubernetes 集群，用于部署工作负载。

## 集群联邦需要解决的问题

- 跨集群服务发现：连通多个集群，使得服务可以在多个集群之间发现，让请求跨越集群边界。
- 跨集群调度：将负载调度到多个集群，保证服务的稳定性以及可用性。

## 集群联邦开源项目

### Kubefed

[项目地址](https://github.com/kubernetes-retired/kubefed)

之前由 Kubernetes 官方多集群兴趣小组开发，目前已经停止维护。

![alt text](https://images.pding.top/2024/06/202406052303231.png)

架构原理：

将联邦资源（FederationResource）从管理集群同步到工作集群。

![alt text](https://images.pding.top/2024/06/202406052308628.png)

这其中通过三个概念来实现：

- Template：定义了联邦资源的模板，用于指定联邦资源的属性
- Placement：定义了联邦集群资源的部署位置，用于指定联邦资源的部署位置。
- Overrides：定义了联邦集群资源的覆盖规则，用于覆盖联邦资源的属性。

kubefed 为所有的 Kubernetes 原生资源提供了对应的联邦资源，例如 `FederatedService`、`FederatedDeployment` 等。

联邦资源中定义了原生资源的 Template、又通过 Overrides 定义了资源同步到不同的工作集群时需要做的变更，例如：

```yaml
kind: FederatedDeployment
...
spec:
  ...
  overrides:
  # Apply overrides to cluster1
    - clusterName: cluster1
      clusterOverrides:
        # Set the replicas field to 5
        - path: "/spec/replicas"
          value: 5
        # Set the image of the first container
        - path: "/spec/template/spec/containers/0/image"
          value: "nginx:1.17.0-alpine"
        # Ensure the annotation "foo: bar" exists
        - path: "/metadata/annotations"
          op: "add"
          value:
            foo: bar
        # Ensure an annotation with key "foo" does not exist
        - path: "/metadata/annotations/foo"
          op: "remove"
        # Adds an argument `-q` at index 0 of the args list
        # this will obviously shift the existing arguments, if any
        - path: "/spec/template/spec/containers/0/args/0"
          op: "add"
          value: "-q"
```

### Karmada

- [项目地址](https://github.com/karmada-io/karmada)

![alt text](https://images.pding.top/2024/06/202406052338468.png)

管理集群包含三个主要组件：

1. APIServer
2. ControllerManager：将联邦资源同步到工作集群并管理联邦资源的生命周期。
3. Scheduler

![alt text](https://images.pding.top/2024/06/202406052341730.png)

Karmada 将资源模板转换成成员集群的资源需要经过以下几个步骤：

1. Deployment、Service、ConfigMap 等资源模板经过 PropagationPolicy 生成一组 ResourceBinding，每个 ResourceBinding 都对应特定的成员集群；
2. ResourceBinding 根据 OverridePolicy 改变一些资源以适应的不同成员集群，例如：集群名等参数，这些资源定义会存储在 Work 对象中；
3. Work 对象中存储的资源定义会被提交到成员集群中，成员集群中的 Controller Manager 等控制面板组件会负责这些资源的处理，例如：根据 Deployment 创建 Pod 等。

如下示例：

```yaml
# propagationpolicy.yaml
apiVersion: policy.karmada.io/v1alpha1
kind: PropagationPolicy
metadata:
  name: example-policy
spec:
  resourceSelectors:
    - apiVersion: apps/v1
      kind: Deployment
      name: nginx
  placement:
    clusterAffinity:
      clusterNames:
        - member1

# overridepolicy.yaml
apiVersion: policy.karmada.io/v1alpha1
kind: OverridePolicy
metadata:
  name: example-override
  namespace: default
spec:
  resourceSelectors:
    - apiVersion: apps/v1
      kind: Deployment
      name: nginx
  overrideRules:
    - targetCluster:
        clusterNames:
          - member1
      overriders:
        plaintext:
          - path: "/metadata/annotations"
            operator: add
            value:
              foo: bar
```

![alt text](https://images.pding.top/2024/06/202406052347811.png)

---
[« Kubernetes 0-1 尝试理解云原生](cloud-native-understood.md)

[» 了解 ConfigMap](configmap-understood.md)
