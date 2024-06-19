[🏠 首页](../_index.md) / [开发](_index.md) / Apifox 导入 Kubernetes API

# Apifox 导入 Kubernetes API

本来有一种快捷方式，但是导入报错，提示数据格式不兼容：

Apifox 直接以 Url 方式导入，导入地址如下：

<https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json>

第一步，本地代理：

```bash
kubectl proxy --address 0.0.0.0 --accept-hosts '^*$'
```

第二步，提取 API json 文件至本地：

```bash
curl http://localhost:8001/openapi/v2 > k8s-swagger.json
```

第三步，Apifox 导入即完成。
