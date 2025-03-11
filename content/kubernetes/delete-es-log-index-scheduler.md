[🏠 首页](../_index.md) / [Kubernetes](_index.md) / 定期删除 ElasticSearch 日志索引

# 定期删除 ElasticSearch 日志索引

## 背景

当前在 K8s 集群中部署了一套 EFK 日志监控系统，日复一日，ElasticSearch收集的数据越来越多，内存以及存储占用越来越高，需要定期来删除老旧的日志数据，来解放内存和存储空间，考虑到 K8s 中 cronjob 的功能特性，打算使用它制定一个es日志索引清除脚本，定时清除日志数据。

## ConfigMap

这个configMap用来存储一个shell脚本，该shell脚本执行日志索引清除操作：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: es-log-indices-clear-configmap
  namespace: efk
data:
  clean-indices.sh: |
    #/bin/bash
    LAST_MONTH_DATE=`date -d "1 month ago" +"%Y.%m.%d"`
    echo Start clear es indices  *-${LAST_MONTH_DATE}
    curl -XDELETE http://elasticsearch:9200/*-${LAST_MONTH_DATE}
---
```

> 说明：这里我配置的configmap所在命名空间和efk部署的命名空间一致，并且es的Service的名称是elasticsearch，所以可以使用<http://elasticsearch:9200访问到es服务，否则的话需要是无法访问到的，所以这里需要根据具体情况配置es的服务地址；>

## CronJob

CronJob使用了 `poneding/sparrow`

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: clean-indices
  namespace: efk
spec:
  schedule: "0 0 1/1 * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: auto-recycle-job
              image: poneding/sparrow
              args: ["/bin/sh", "/job/clean-indices.sh"]
              volumeMounts:
                - name: vol
                  mountPath: /job
          volumes:
            - name: vol
              configMap:
                name: es-log-indices-clear-configmap
          restartPolicy: OnFailure
```

> 说明：
>
> 1. 配置 cronjob 镜像为 `poneding/sparrow`，是自制的镜像，因为 `busybox` 镜像里面没有集成 `curl` 命令并且 `date` 的命令也不完全;
> 2. 将 configmap 挂载到 job 目录下；
> 3. 配置 cronjob 调度时间为 `0 0 1/1 * *`，每天的零点执行job目录下的 clean-indices.sh 脚本文件；

## 遇到的问题

在实际测试过程中遇到了一个问题，我们的脚本是通过 curl DElETE 方法来调用 es 的删除索引 api，我们使用 `*-yyyy.MM.dd` 通配符匹配并删除符合的 es 索引，但是 ES 默认是有自己的保护机制的，默认禁止使用通配符或 _all 删除索引，这个做法我们也很容易理解，毕竟不能允许如此轻易的大量删除。

```tex
/var/www/app # curl -XDELETE http://elasticsearch:9200/*-2020.10.09
{"error":{"root_cause":[{"type":"illegal_argument_exception","reason":"Wildcard expressions or all indices are not allowed"}],"type":"illegal_argument_exception","reason":"Wildcard expressions or all indices are not allowed"},"status":400}
```

解决方案是设置 elasticsearch 配置项：`action.destructive_requires_name` 为 `false`.

遗憾的是无论我通过修改es的配置文件 `elasticsearch.yml`（位于 `/usr/share/elasticsearch/config` 路径下）还是增加环境变量都没起到效果：

```yaml
... # es-configmap
data:
  elasticsearch.yml: |
    cluster.name: "es-cluster"
    network.host: 0.0.0.0
    action.destructive_requires_name: false
...    
```

```yaml
... # es-statefulset
          env:
            - name: cluster.name
              value: es-cluster
            - name: action.destructive_requires_name
              value: "false"
...
```

最后，又找到了一个方法：使用 ES 语法修改配置。

```json
PUT /_cluster/settings
{
  "persistent" : {
    "action.destructive_requires_name" : "false"
  }
}
```

![image-20201105113213441](https://images.poneding.com/2025/03/202503112119950.png)

这时候再次使用通配符执行删除：

```tex
/var/www/app# curl -XDELETE http://elasticsearch:9200/*-2020.10.09
{"acknowledged":true}
```

虽然问题是解决了，但是修改配置文件不生效，还是令人困扰，可能是由于 es 集群的关系，单节点的配置并未对集群生效。

追加，貌似可以从这得到答案  => 官方文档：<https://www.elastic.co/guide/en/elasticsearch/reference/current/settings.html>

![image-20201105115131020](https://images.poneding.com/2025/03/202503112119674.png)

---
[« 了解 ConfigMap](configmap-understood.md)

[» 强制删除 K8s 资源](delete-k8s-resource-force.md)
