[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 定制开发 50：扩展调度器

# Kubernetes 定制开发 50：扩展调度器

## 简介

Kubernetes Scheduler（调度器）是一个控制面进程，负责将 Pods 指派到节点上。调度器基于约束和可用资源为调度队列中每个 Pod 确定其可合法放置的节点。调度器之后对所有合法的节点进行排序，将 Pod 绑定到一个合适的节点。

`kube-scheduler` 是 Kubernetes 自带的一个默认调度器，它会根据 Pod 的资源需求和节点的资源容量，将 Pod 调度到合适的节点上。

如果默认调度器不符合你的需求，你可以实现自己的调度器，并且你的调度器可以和默认调度器或其他调度器一起运行在集群中。你可以通过声明 Pod 的 `spec.schedulerName` 字段来指定要使用的调度器。

## 扩展调度器

有三种方式可以实现自定义调度器：

- 修改 kube-scheduler 源码调度逻辑，然后编译成定制的调度器镜像，然后使用这个镜像部署调度进程
- 自定义 Pod 控制器，监听 Pod 的 spec.schedulerName 字段，在 Pod 被创建时，为其绑定节点
- 使用 Scheduler Extender 的方式，这种方式不需要修改默认调度器的配置文件

### 编译定制调度器镜像

克隆 kubernetes 源码，然后修改 kube-scheduler 源码，然后编译成定制的调度器镜像。

```bash
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
# 修改源码
make
```

编写 Dockerfile：

```dockerfile
FROM alpine

ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

编译并推送镜像：

```bash
docker build -t poneding/my-kube-scheduler:v1.0 .
docker push poneding/my-kube-scheduler:v1.0
```

编写部署清单文件：

*deploy-maniest.yaml*：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-scheduler
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: my-scheduler-as-kube-scheduler
subjects:
- kind: ServiceAccount
  name: my-scheduler
  namespace: kube-system
roleRef:
  kind: ClusterRole
  name: system:kube-scheduler
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-scheduler-config
  namespace: kube-system
data:
  my-scheduler-config.yaml: |
    apiVersion: kubescheduler.config.k8s.io/v1
    kind: KubeSchedulerConfiguration
    profiles:
      - schedulerName: my-scheduler
    leaderElection:
      leaderElect: false    
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: my-scheduler-as-volume-scheduler
subjects:
- kind: ServiceAccount
  name: my-scheduler
  namespace: kube-system
roleRef:
  kind: ClusterRole
  name: system:volume-scheduler
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    component: scheduler
    tier: control-plane
  name: my-scheduler
  namespace: kube-system
spec:
  selector:
    matchLabels:
      component: scheduler
      tier: control-plane
  replicas: 1
  template:
    metadata:
      labels:
        component: scheduler
        tier: control-plane
    spec:
      serviceAccountName: my-scheduler
      containers:
      - command:
        - /usr/local/bin/kube-scheduler
        - --config=/etc/kubernetes/my-scheduler/my-scheduler-config.yaml
        image: poneding/my-kube-scheduler:v1.0
        livenessProbe:
          httpGet:
            path: /healthz
            port: 10259
            scheme: HTTPS
          initialDelaySeconds: 15
        name: my-scheduler
        readinessProbe:
          httpGet:
            path: /healthz
            port: 10259
            scheme: HTTPS
        resources:
          requests:
            cpu: '0.1'
        securityContext:
          privileged: false
        volumeMounts:
          - name: config-volume
            mountPath: /etc/kubernetes/my-scheduler
      hostNetwork: false
      hostPID: false
      volumes:
        - name: config-volume
          configMap:
            name: my-scheduler-config
```

部署：

```bash
kubectl apply -f deploy-maniest.yaml
```

测试：

```bash
kubectl run nginx-by-my-scheduler --image=nginx --overrides='{"spec":{"schedulerName":"my-scheduler"}}'

kubectl get pod -o wide -w
```

如果一切正常，将观察到 Pod 将会被正常调度到节点上。

使用这种方式来扩展调度器，对开发者来说，需要了解调度器的源码然后修改逻辑，有一定的难度。

### 自定义调度控制器

基于 controller-runtime 包编写一个调度控制器，原理是通过协调 Pod ，选择一个适合的节点，创建 Binding 对象，将 Pod 绑定到指定的节点上。

创建项目：

```bash
mkdir my-scheduler && cd my-scheduler
go mod init my-scheduler
touch main.go
```

编写 `main.go` 调度器逻辑（本质是一个 Pod 的协调控制器）：

```go
package main

import (
    "context"
    "log"
    "math/rand"

    corev1 "k8s.io/api/core/v1"
    "k8s.io/apimachinery/pkg/runtime"
    ctrl "sigs.k8s.io/controller-runtime"
    "sigs.k8s.io/controller-runtime/pkg/client"
    "sigs.k8s.io/controller-runtime/pkg/event"
    "sigs.k8s.io/controller-runtime/pkg/manager"
    "sigs.k8s.io/controller-runtime/pkg/predicate"
)

func main() {
    mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), manager.Options{})
    if err != nil {
        log.Fatalf("new manager err: %s", err.Error())
    }

    err = (&MyScheduler{
        Client: mgr.GetClient(),
        Scheme: mgr.GetScheme(),
    }).SetupWithManager(mgr)
    if err != nil {
        log.Fatalf("setup scheduler err: %s", err.Error())
    }

    err = mgr.Start(context.Background())
    if err != nil {
        log.Fatalf("start manager err: %s", err.Error())
    }
}

const mySchedulerName = "my-scheduler"

type MyScheduler struct {
    Client client.Client
    Scheme *runtime.Scheme
}

func (s *MyScheduler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    nodes := new(corev1.NodeList)
    err := s.Client.List(ctx, nodes)
    if err != nil {
        return ctrl.Result{Requeue: true}, err
    }

    // 随机选择一个节点
    targetNode := nodes.Items[rand.Intn(len(nodes.Items))].Name

    // 创建绑定关系
    binding := new(corev1.Binding)
    binding.Name = req.Name
    binding.Namespace = req.Namespace
    binding.Target = corev1.ObjectReference{
        Kind:       "Node",
        APIVersion: "v1",
        Name:       targetNode,
    }

    err = s.Client.Create(ctx, binding)
    if err != nil {
        return ctrl.Result{Requeue: true}, err
    }

    return ctrl.Result{}, nil
}

// SetupWithManager sets up the controller with the Manager.
func (s *MyScheduler) SetupWithManager(mgr ctrl.Manager) error {
    // 过滤目标 Pod
    filter := predicate.Funcs{
        CreateFunc: func(e event.CreateEvent) bool {
            pod, ok := e.Object.(*corev1.Pod)
            if ok {
                return pod.Spec.SchedulerName == mySchedulerName && pod.Spec.NodeName == ""
            }
            return false
        },
        UpdateFunc: func(e event.UpdateEvent) bool {
            return false
        },
        DeleteFunc: func(e event.DeleteEvent) bool {
            return false
        },
    }
    return ctrl.NewControllerManagedBy(mgr).
        For(&corev1.Pod{}).
        WithEventFilter(filter).
        Complete(s)
}
```

运行自定义调度器：

```bash
go run main.go
```

也可以参考前面的部署方式，先制作一个镜像，然后部署到集群中。

运行一个 Pod，指定调度器为 `my-scheduler`：

```bash
kubectl run nginx-by-my-scheduler --image=nginx --overrides='{"spec":{"schedulerName":"my-scheduler"}}'
```

一切正常的话，将会观察到 Pod 被正常调度到节点上。

### Scheduler Extender

通过 Scheduler Extender 来扩展 Kubernetes 调度器，它将以 Webhook 的形式运行，并且在调度器框架阶段中进行干扰。

| 阶段 | 描述 |
| --- | --- |
| Filter | 调度框架将调用过滤函数，过滤掉不适合被调度的节点。 |
| Priority | 调度框架将调用优先级函数，为每个节点计算一个优先级，优先级越高，节点越适合被调度。 |
| Bind | 调度框架将调用绑定函数，将 Pod 绑定到一个节点上。 |

Scheduler Extender 通过 HTTP 请求的方式，将调度框架阶段中的调度决策委托给外部的调度器，然后将调度结果返回给调度框架。我们只需要实现一个 HTTP 服务，然后将其注册到调度器中，就可以实现自定义调度器。在这个 HTTP 服务中，我们可以实现上述阶段中的任意一个或多个阶段的接口，来定制我们的调度需求。

接口列表：

#### Filter 接口

接口方法：POST

接口请求参数：

```go
type ExtenderArgs struct {
    Pod *v1.Pod
    Nodes *v1.NodeList
    NodeNames *[]string
}
```

接口请求结果：

```go
type ExtenderFilterResult struct {
    Nodes *v1.NodeList
    NodeNames *[]string
    FailedNodes FailedNodesMap
    FailedAndUnresolvableNodes FailedNodesMap
    Error string
}
```

#### Priority 接口

接口方法：POST

接口请求参数：和 Filter 接口请求参数一致。

接口请求结果：

```go
type HostPriorityList []HostPriority

type HostPriority struct {
    Host string
    Score int64
}
```

#### Bind 接口

接口方法：POST

接口请求参数：

```go
type ExtenderBindingArgs struct {
    PodName string
    PodNamespace string
    PodUID types.UID
    Node string
}
```

接口请求结果：

```go
type ExtenderBindingResult struct {
    Error string
}
```

#### 实现

我们使用 Scheduler Extender 的方式来实现自定义调度器，供参考。

*main.go*：

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"

    extenderv1 "k8s.io/kube-scheduler/extender/v1"
)

func Filter(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusMethodNotAllowed)
        return
    }
    var args extenderv1.ExtenderArgs
    var result *extenderv1.ExtenderFilterResult

    err := json.NewDecoder(r.Body).Decode(&args)
    if err != nil {
        result = &extenderv1.ExtenderFilterResult{
            Error: err.Error(),
        }
    } else {
        result = filter(args)
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    if err := json.NewEncoder(w).Encode(result); err != nil {
        log.Printf("failed to encode result: %v", err)
    }
}

func Prioritize(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusMethodNotAllowed)
        return
    }
    var args extenderv1.ExtenderArgs
    var result *extenderv1.HostPriorityList

    err := json.NewDecoder(r.Body).Decode(&args)
    if err != nil {
        result = &extenderv1.HostPriorityList{}
    } else {
        result = prioritize(args)
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    if err := json.NewEncoder(w).Encode(result); err != nil {
        log.Printf("failed to encode result: %v", err)
    }
}

func Bind(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusMethodNotAllowed)
        return
    }
    var args extenderv1.ExtenderBindingArgs
    var result *extenderv1.ExtenderBindingResult

    err := json.NewDecoder(r.Body).Decode(&args)
    if err != nil {
        result = &extenderv1.ExtenderBindingResult{
            Error: err.Error(),
        }
    } else {
        result = bind(args)
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    if err := json.NewEncoder(w).Encode(result); err != nil {
        log.Printf("failed to encode result: %v", err)
    }
}

func main() {
    http.HandleFunc("/filter", Filter)
    http.HandleFunc("/priority", Prioritize)
    http.HandleFunc("/bind", Bind)
    http.ListenAndServe(":8080", nil)
}
```

*filter.go*：没有具体实现节点过滤逻辑，直接返回所有节点。

```go
package main

import (
    "log"

    extenderv1 "k8s.io/kube-scheduler/extender/v1"
)

func filter(args extenderv1.ExtenderArgs) *extenderv1.ExtenderFilterResult {
    log.Println("my-scheduler-extender filter called.")

    return &extenderv1.ExtenderFilterResult{
        Nodes:     args.Nodes,
        NodeNames: args.NodeNames,
    }
}
```

*prioritize.go*：模拟打分，按照节点顺序给节点累加一个分数。

```go
package main

import (
    "log"

    extenderv1 "k8s.io/kube-scheduler/extender/v1"
)

func prioritize(args extenderv1.ExtenderArgs) *extenderv1.HostPriorityList {
    log.Println("my-scheduler-extender prioritize called.")

    var result extenderv1.HostPriorityList
    for i, node := range args.Nodes.Items {
        result = append(result, extenderv1.HostPriority{
            Host:  node.Name,
            Score: int64(i),
        })
    }

    return &result
}
```

*bind.go*：没有具体实现绑定逻辑，直接返回成功。

```go
package main

import (
    "context"
    "log"

    corev1 "k8s.io/api/core/v1"
    "k8s.io/client-go/kubernetes/scheme"
    "k8s.io/client-go/rest"
    extenderv1 "k8s.io/kube-scheduler/extender/v1"
    ctrl "sigs.k8s.io/controller-runtime"
    "sigs.k8s.io/controller-runtime/pkg/client"
)

var kconfig *rest.Config
var kruntimeclient client.Client

func init() {
    kconfig = ctrl.GetConfigOrDie()
    var err error
    kruntimeclient, err = client.New(kconfig, client.Options{
        Scheme: scheme.Scheme,
    })
    if err != nil {
        log.Fatalf("failed to create k8s runtime client: %v", err)
    }
}

func bind(args extenderv1.ExtenderBindingArgs) *extenderv1.ExtenderBindingResult {
    log.Println("my-scheduler-extender bind called.")
    log.Printf("pod %s/%s is bind to %s", args.PodNamespace, args.PodName, args.Node)

    // 创建绑定关系
    binding := new(corev1.Binding)
    binding.Name = args.PodName
    binding.Namespace = args.PodNamespace
    binding.Target = corev1.ObjectReference{
        Kind:       "Node",
        APIVersion: "v1",
        Name:       args.Node,
    }

    result := new(extenderv1.ExtenderBindingResult)

    err := kruntimeclient.Create(context.Background(), binding)
    if err != nil {
        result.Error = err.Error()
    }

    return result
}
```

编译成二进制文件：

```bash
GOOS=linux GOARCH=amd64 go build -o my-scheduler-extender
```

编写 Dockerfile：

```dockerfile
FROM alpine
ARG TARGETOS TARGETARCH
ADD ./bin/$TARGETOS/$TARGETARCH/my-scheduler-extender /my-scheduler-extender
ENTRYPOINT ["/my-scheduler-extender"]
```

编译并推送镜像：

```bash
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bin/linux/amd64/my-scheduler-extender
GOOS=linux GOARCH=arm64 CGO_ENABLED=0 go build -o bin/linux/arm64/my-scheduler-extender

docker buildx build --push --platform linux/amd64,linux/arm64 -t poneding/my-kube-scheduler-extender:v1.0 .
```

编写部署清单文件，部署清单中包括额外的调度器（参考上述编译定制调度器镜像的方式）和我们开发的 Scheduler Extender：

> 注意：为了简化部署清单，给了 my-scheduler-extender 和 my-scheduler-with-extender 容器 cluster-admin 权限，实际上不需要这么高的权限。

*deploy-manifests.yaml*：

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-scheduler-with-extender
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: my-scheduler-with-extender
subjects:
- kind: ServiceAccount
  name: my-scheduler-with-extender
  namespace: kube-system
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-scheduler-with-extender-config
  namespace: kube-system
data:
  my-scheduler-with-extender-config.yaml: |
    apiVersion: kubescheduler.config.k8s.io/v1
    kind: KubeSchedulerConfiguration
    profiles:
      - schedulerName: my-scheduler-with-extender
    leaderElection:
      leaderElect: false
    extenders:
    - urlPrefix: "http://my-scheduler-extender.kube-system.svc:8080"
      enableHTTPS: false
      filterVerb: "filter"
      prioritizeVerb: "prioritize"
      bindVerb: "bind"
      weight: 1
      nodeCacheCapable: false
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    component: my-scheduler-with-extender
    tier: control-plane
  name: my-scheduler-with-extender
  namespace: kube-system
spec:
  selector:
    matchLabels:
      component: my-scheduler-with-extender
      tier: control-plane
  replicas: 1
  template:
    metadata:
      labels:
        component: my-scheduler-with-extender
        tier: control-plane
    spec:
      serviceAccountName: my-scheduler-with-extender
      containers:
      - command:
        - kube-scheduler
        - --config=/etc/kubernetes/my-scheduler-with-extender/my-scheduler-with-extender-config.yaml
        image: registry.k8s.io/kube-scheduler:v1.29.0
        livenessProbe:
          httpGet:
            path: /healthz
            port: 10259
            scheme: HTTPS
          initialDelaySeconds: 15
        name: my-scheduler-with-extender
        readinessProbe:
          httpGet:
            path: /healthz
            port: 10259
            scheme: HTTPS
        resources:
          requests:
            cpu: '0.1'
        securityContext:
          privileged: false
        volumeMounts:
          - name: config-volume
            mountPath: /etc/kubernetes/my-scheduler-with-extender
      hostNetwork: false
      hostPID: false
      volumes:
        - name: config-volume
          configMap:
            name: my-scheduler-with-extender-config
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    component: my-scheduler-extender
    tier: control-plane
  name: my-scheduler-extender
  namespace: kube-system
spec:
  selector:
    matchLabels:
      component: my-scheduler-extender
      tier: control-plane
  replicas: 1
  template:
    metadata:
      labels:
        component: my-scheduler-extender
        tier: control-plane
    spec:
      serviceAccountName: my-scheduler-with-extender
      containers:
      - image: poneding/my-kube-scheduler-extender:v1.0
        name: my-scheduler-extender
        imagePullPolicy: Always
---
apiVersion: v1
kind: Service
metadata:
  name: my-scheduler-extender
  namespace: kube-system
spec:
  selector:
    component: my-scheduler-extender
    tier: control-plane
  ports:
  - port: 8080
    targetPort: 8080
```

部署：

```bash
kubectl apply -f deploy-manifests.yaml
```

运行一个测试 Pod，查看 my-scheduler-extender 容器的日志：

```bash
kubectl run nginx-by-my-scheduler-extender --image=nginx --overrides='{"spec":{"schedulerName":"my-scheduler-with-extender"}}'

# 查看 my-scheduler-extender 日志
kubectl logs deploy/my-scheduler-extender -n kube-system -f
```

代码传送门：[my-scheduler-extender](https://github.com/poneding/programming-kubernetes/tree/master/advanced/my-scheduler-extender)

## 参考

- [调度器配置](https://kubernetes.io/zh-cn/docs/reference/scheduling/config/)
- [Kubernetes Extender](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/1819-scheduler-extender/README.md)
- [Create a custom Kubernetes scheduler](https://developer.ibm.com/articles/creating-a-custom-kube-scheduler)

---
[« Kubernetes 定制开发 02：CRD](k8s-dev-02-crd.md)

[» 简单介绍 K8s](k8s-get-started.md)
