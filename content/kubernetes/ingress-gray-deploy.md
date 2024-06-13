[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 通过 Ingress 进行灰度发布

# 通过 Ingress 进行灰度发布

<https://start.aliyun.com/handson/Tn0HcdCZ/grap_publish_by_ingress>

## Step 1 ：实验介绍

本实验，你将运行运行一个简单的应用，部署一个新的应用用于新的发布，并通过 Ingress 能力实现灰度发布。

灰度及蓝绿发布是为新版本创建一个与老版本完全一致的生产环境，在不影响老版本的前提下，按照一定的规则把部分流量切换到新版本，当新版本试运行一段时间没有问题后，将用户的全量流量从老版本迁移至新版本。

通过本实验，你将学习：

- 通过 Ingress 按权重进行灰度发布
- 通过 Ingress 按 Header 进行灰度发布

> **容器服务 Kubernetes 版（简称 ACK）** 本节课使用的 Kubernetes(k8s) 集群就是由 ACK 提供的，本实验涵盖的都是一些基本操作。更多高级用法，可以去[ACK 的产品页面](https://www.aliyun.com/product/kubernetes)了解哦。

## Step 2 ：部署 Deployment V1 应用

创建如下 YAML 文件(app-v1.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-v1
  labels:
    app: my-app
spec:
  ports:
  - name: http
    port: 80
    targetPort: http
  selector:
    app: my-app
    version: v1.0.0
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-v1
  labels:
    app: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
      version: v1.0.0
  template:
    metadata:
      labels:
        app: my-app
        version: v1.0.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9101"
    spec:
      containers:
      - name: my-app
        image: registry.cn-hangzhou.aliyuncs.com/containerdemo/containersol-k8s-deployment-strategies
        ports:
        - name: http
          containerPort: 8080
        - name: probe
          containerPort: 8086
        env:
        - name: VERSION
          value: v1.0.0
        livenessProbe:
          httpGet:
            path: /live
            port: probe
          initialDelaySeconds: 5
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /ready
            port: probe
          periodSeconds: 5
```

执行如下命令部署 Deployement V1 应用：

```bash
kubectl apply -f app-v1.yaml
```

创建如下 Ingress YAML文件(ingress-v1.yaml)

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  rules:
  - host: my-app-898e6352eda2ac9c5cfc5d51c155455b.ca2ef983cc3a64042a32c1a423d32021e.cn-shanghai.alicontainer.com
    http:
      paths:
      - backend:
          serviceName: my-app-v1
          servicePort: 80
        path: /
```

执行如下命令部署 Ingress 资源

```bash
kubectl apply -f ingress-v1.yaml
```

部署完成后通过 `curl` 命令进行测试：

```bash
curl my-app-898e6352eda2ac9c5cfc5d51c155455b.ca2ef983cc3a64042a32c1a423d32021e.cn-shanghai.alicontainer.com
```

会看到如下返回：

```console
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
```

## Step 3 ：部署 Deployment V2 应用

创建如下 YAML 文件(app-v2.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-v2
  labels:
    app: my-app
spec:
  ports:
  - name: http
    port: 80
    targetPort: http
  selector:
    app: my-app
    version: v2.0.0
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-v2
  labels:
    app: my-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-app
      version: v2.0.0
  template:
    metadata:
      labels:
        app: my-app
        version: v2.0.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9101"
    spec:
      containers:
      - name: my-app
        image: registry.cn-hangzhou.aliyuncs.com/containerdemo/containersol-k8s-deployment-strategies
        ports:
        - name: http
          containerPort: 8080
        - name: probe
          containerPort: 8086
        env:
        - name: VERSION
          value: v2.0.0
        livenessProbe:
          httpGet:
            path: /live
            port: probe
          initialDelaySeconds: 5
          periodSeconds: 5
        readinessProbe:
          httpGet:
            path: /ready
            port: probe
          periodSeconds: 5
```

执行如下命令部署 Deployement V2 应用：

```bash
kubectl apply -f app-v2.yaml
```

## Step 4 ：按照权重策略灰度到 Deployment V2 应用

创建如下 Ingress YAML文件(ingress-v2-canary-weigth.yaml)

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: my-app-canary
  labels:
    app: my-app
  annotations:
    # Enable canary and send 10% of traffic to version 2
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"
spec:
  rules:
  - host: my-app-898e6352eda2ac9c5cfc5d51c155455b.ca2ef983cc3a64042a32c1a423d32021e.cn-shanghai.alicontainer.com
    http:
      paths:
      - backend:
          serviceName: my-app-v2
          servicePort: 80
        path: /
```

执行如下命令部署 Ingress 资源

```bash
kubectl apply -f ingress-v2-canary-weigth.yaml
```

执行如下命令进行测试：

```bash
while sleep 0.1;do curl my-app-898e6352eda2ac9c5cfc5d51c155455b.ca2ef983cc3a64042a32c1a423d32021e.cn-shanghai.alicontainer.com; done
```

测试结果如下：

```console
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
Host: my-app-v2-67c69b8857-g82gr, Version: v2.0.0
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
```

## Step 5 ：按照 Header 策略灰度到 Deployment V2 应用

创建如下 Ingress YAML文件(ingress-v2-canary-header.yaml)

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: my-app-canary
  labels:
    app: my-app
  annotations:
    # Enable canary and send traffic with headder x-app-canary to version 2
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-by-header: "x-app-canary"
    nginx.ingress.kubernetes.io/canary-by-header-value: "true"
spec:
  rules:
  - host: my-app-898e6352eda2ac9c5cfc5d51c155455b.ca2ef983cc3a64042a32c1a423d32021e.cn-shanghai.alicontainer.com
    http:
      paths:
      - backend:
          serviceName: my-app-v2
          servicePort: 80
```

执行如下命令部署 Ingress 资源

```bash
kubectl apply -f ingress-v2-canary-header.yaml
```

通过 `curl` 命令对应用进行测试：

```bash
curl my-app-898e6352eda2ac9c5cfc5d51c155455b.ca2ef983cc3a64042a32c1a423d32021e.cn-shanghai.alicontainer.com
```

结果如下：

```console
Host: my-app-v1-68bfcbb7cf-w4rpg, Version: v1.0.0
curl my-app-898e6352eda2ac9c5cfc5d51c155455b.ca2ef983cc3a64042a32c1a423d32021e.cn-shanghai.alicontainer.com -H "x-app-canary: true"
```

结果如下

```console
Host: my-app-v2-67c69b8857-g82gr, Version: v2.0.0
```

---
[« Informer](informer.md)

[» 安装 Kubernetes](installation.md)
