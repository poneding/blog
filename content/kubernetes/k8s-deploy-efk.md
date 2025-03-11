[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 0-1 K8s部署EFK

# Kubernetes 0-1 K8s部署EFK

![alt text](https://images.poneding.com/2025/03/202503112119520.png)

## 写在前面

本篇目标是在K8s集群中搭建EFK。

EFK是由ElasticSearch，Fluentd，Kibane组成的一套目前比较主流的日志监控系统，使用EFK监控应用日志，可以让开发人员在一个统一的入口查看日志然后分析应用运行情况。

EFK简单的工作原理可以参考下图。通过fluentd的agent收集日志数据，写入es，kibana从es中读取日志数据展示到ui。

![alt text](https://images.poneding.com/2025/03/202503112119800.png)

## 部署ElasticSearch

最好选择部署一个ES集群，这样你的ES可用性更高一点。

采用StatefulSet部署ES。

编写es-statefulSet.yaml文件如下：

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: es-cluster
  namespace: dev
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
        - name: elasticsearch
          image: docker.elastic.co/elasticsearch/elasticsearch:7.7.0
          resources:
            limits:
              cpu: 1000m
            requests:
              cpu: 100m
          ports:
            - containerPort: 9200
              name: rest
              protocol: TCP
            - containerPort: 9300
              name: inter-node
              protocol: TCP
          volumeMounts:
            - name: data
              mountPath: /usr/share/elasticsearch/data
          env:
            - name: cluster.name
              value: k8s-logs
            - name: node.name
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: discovery.seed_hosts
              value: "es-cluster-0.elasticsearch,es-cluster-1.elasticsearch,es-cluster-2.elasticsearch"
            - name: cluster.initial_master_nodes
              value: "es-cluster-0,es-cluster-1,es-cluster-2"
            - name: ES_JAVA_OPTS
              value: "-Xms512m -Xmx512m"
      initContainers:
        - name: fix-permissions
          image: busybox
          command:
            ["sh", "-c", "chown -R 1000:1000 /usr/share/elasticsearch/data"]
          securityContext:
            privileged: true
          volumeMounts:
            - name: data
              mountPath: /usr/share/elasticsearch/data
        - name: increase-vm-max-map
          image: busybox
          command: ["sysctl", "-w", "vm.max_map_count=262144"]
          securityContext:
            privileged: true
        - name: increase-fd-ulimit
          image: busybox
          command: ["sh", "-c", "ulimit -n 65536"]
          securityContext:
            privileged: true
  volumeClaimTemplates:
    - metadata:
        name: data
        labels:
          app: elasticsearch
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: gp2
        resources:
          requests:
            storage: 40Gi
```

编写es.service.yaml文件如下：

```yaml
kind: Service
apiVersion: v1
metadata:
  name: elasticsearch
  namespace: dev
spec:
  selector:
    app: elasticsearch
  type: NodePort
  ports:
    - name: elasticsearch-http
      port: 9200
      targetPort: 9200
```

## 部署Kibana

编写kibana-deployment.yaml文件如下：

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: kibana
  namespace: dev
  labels:
    name: kibana
spec:
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      labels:
        name: kibana
    spec:
      containers:
        - image: docker.elastic.co/kibana/kibana:7.7.0
          imagePullPolicy: Always
          name: kibana
          resources:
            requests:
              cpu: "1000m"
              memory: "256M"
            limits:
              cpu: "1000m"
              memory: "1024M"
          # livenessProbe:
          #   httpGet:
          #     path: /_status/healthz
          #     port: 5000
          #   initialDelaySeconds: 90
          #   timeoutSeconds: 10
          # readinessProbe:
          #   httpGet:
          #     path: /_status/healthz
          #     port: 5000
          #   initialDelaySeconds: 30
          #   timeoutSeconds: 10
          env:
            - name: ELASTICSEARCH_URL
              value: http://elasticsearch:9200
            - name: SERVER_BASEPATH
              value: /kibana
            - name: SERVER_REWRITEBASEPATH
              value: "true"
          # args:
          #   - server.rewriteBasePath=true
          #   - server.basePath=/kibana
          ports:
            - containerPort: 5601
              name: kibana-port
      #     volumeMounts:
      #       - mountPath: /etc/kibana/config
      #         name: grafana-data
      # volumes:
      #   - name: grafana-data
      #     configMap:
      #       name: grafana-config
      restartPolicy: Always
```

编写kibana-service.yaml文件如下：

```yaml
kind: Service
apiVersion: v1
metadata:
  name: kibana
  namespace: dev
spec:
  selector:
    name: kibana
  type: NodePort
  ports:
    - name: kibana-http
      port: 5601
      targetPort: 5601
```

## 部署Fluentd

Fluentd是一个开源的数据收集器，可以做数据的集中收集，便于做数据使用和分析，常用于日志收集。

我们部署Fluentd来收集部署在k8s Pod中的程序的话，首先需要集群赋予它访问Pod的权限，因为我们需要为fluentd分配一个带有Pod相关权限的serviceAccount。

编写fluentd-serviceAccount.yaml文件如下：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: fluentd
  namespace: dev
  labels:
    app: fluentd
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: fluentd
  namespace: dev
  labels:
    app: fluentd
rules:
  - apiGroups:
      - ""
    resources:
      - pods
      - namespaces
    verbs:
      - get
      - list
      - watch
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: fluentd
  namespace: dev
roleRef:
  kind: ClusterRole
  name: fluentd
  apiGroup: rbac.authorization.k8s.io
subjects:
  - kind: ServiceAccount
    name: fluentd
    namespace: dev
```

我们需要在每台节点上都部署Fluent，这相当于是一个日志收集的Agent，因此我们采用DaemonSet的方式部署Fluentd。

编写fluentd-daemonSet.yaml文件如下：

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: dev
  labels:
    app: fluentd
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      serviceAccount: fluentd
      serviceAccountName: fluentd
      tolerations:
        - key: node-role.kubernetes.io/master
          effect: NoSchedule
      containers:
        - name: fluentd
          image: fluent/fluentd-kubernetes-daemonset:v1.10.4-debian-elasticsearch7-1.0
          env:
            - name: FLUENT_ELASTICSEARCH_HOST
              value: "elasticsearch.dev.svc.cluster.local"
            - name: FLUENT_ELASTICSEARCH_PORT
              value: "9200"
            - name: FLUENT_ELASTICSEARCH_SCHEME
              value: "http"
            - name: FLUENTD_SYSTEMD_CONF
              value: disable
          resources:
            limits:
              memory: 512Mi
            requests:
              cpu: 100m
              memory: 256Mi
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
      terminationGracePeriodSeconds: 30
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
```

文件准备好之后，执行

```yaml
kubectl apply -f ./fluentd-serviceAccount.yaml
kubectl apply -f ./fluentd-daemonSet.yaml
```

部署之后，查看fluentd daemonset的部署情况

```shell
kubectl get ds -n kube-system
```

输出信息大致如下：

```tex
NAME      DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
fluentd   3         3         3       3            3           <none>          33s
```

如果DESIRED和READY列值不一致的话，说明是某个Node上的Pod启用失败了。那么可以查看Pod的启用情况：

```shell
kubectl get pod -n kube-system
# 假设Pod fluentd-8hmbd一直未成功启用，使用kubectl describe 或kubectl logs命令检查
kubectl describe pod fluentd-8hmbd -n kube-system
kubectl logs fluentd-8hmbd -n kube-system
```

## 参考资料

- <https://www.digitalocean.com/community/tutorials/how-to-set-up-an-elasticsearch-fluentd-and-kibana-efk-logging-stack-on-kubernetes>
-

---
[« Kubernetes 0-1 K8s部署Dashboard](k8s-deploy-dashboard.md)

[» 可能需要运行多次以下命令，确保k8s资源都创建](k8s-deploy-prometheus-grafana.md)
