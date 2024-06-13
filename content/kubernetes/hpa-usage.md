[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 0-1 实现Pod自动扩缩HPA

# Kubernetes 0-1 实现Pod自动扩缩HPA

<https://blog.51cto.com/14143894/2458468?source=dra>

## 前言

在K8s集群中，我们可以通过部署Metrics Server来持续收集Pod的资源利用指标数据，我们可以根据收集到的指标数据来评估是否需要调整Pod的数量以贴合它的使用需求。例如，当我们观察到Pod的CPU利用率过高时，我们可以适当上调Deployment的Replicas字段值，来手动实现Pod的横向扩容。

- Metrics Server的指标数据可以通过Dashboard查看到；
-

## 安装Metrics Server

## HPA介绍

HPA（Horizontal Pod Autoscaler，Pod水平自动扩缩），根据Pod的资源利用率自动调整Pod管理器中副本数：Pod资源利用率低，降低Pod副本数，降低资源的使用，节约成本；Pod资源利用率高，增加Pod副本数，提高应用的负载能力。

![image-20200812220038054](https://fs.poneding.com/images/image-20200812220038054.png)

## 示例

以部署redis为例，现使用redis

---
[« Kubernetes 0-1 Helm Kubernetes 的包管理工具](helm-k8s-package-management-tool.md)

[» HTTP 客户端调用 Kubernetes APIServer](http-call-k8s-apiserver.md)
