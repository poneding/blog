[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 可能需要运行多次以下命令，确保k8s资源都创建

## Step

- 下载相关k8s资源文件

```shell
git clone https://github.com/coreos/kube-prometheus.git
```

- 修改文件kube-prometheus/manifests/prometheus-prometheus.yaml，做这一步的目的是为prometheus的访问分配子路径，访问方式为http(s)://xxx/prometheus

  在prometheus.spec下添加

```yaml
externalUrl: prometheus
routePrefix: prometheus
```

- 修改文件kube-prometheus/manifests/grafana-deployment.yaml，做这一步的目的是为grafana的访问分配子路径，访问方式为：http(s)://xxx/grafana

  在deployment.spec.template.spec.container[0]下添加

```yaml
env:
- name: GF_SERVER_ROOT_URL
  value: "http://localhost:3000/grafana"
- name: GF_SERVER_SERVE_FROM_SUB_PATH
  value: "true"
```

- Apply k8s资源

```shell
# 可能需要运行多次以下命令，确保k8s资源都创建
kubectl create -f manifests/setup -f manifests

# !如果要删除以上创建的k8s资源，运行以下命令
kubectl delete --ignore-not-found=true -f manifests/ -f manifests/setup
```

- Ingress转发

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: prometheus
  namespace: monitoring
spec: 
  rules:
  - host: dp.example.tech
    http:
      paths:
      - path: /prometheus
        backend:
          serviceName: prometheus-k8s
          servicePort: 9090
      - path: /grafana
        backend:
          serviceName: grafana
          servicePort: 3000
      - path: /alertmanager
        backend:
          serviceName: alertmanager-main
          servicePort: 9093
```

---
[« Kubernetes 0-1 K8s部署EFK](k8s-deploy-efk.md)

[» Kubernetes 0-1 K8s部署Zookeeper和Kafka](k8s-deploy-zookeeper-kafka.md)
