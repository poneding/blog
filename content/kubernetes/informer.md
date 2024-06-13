[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Informer

# Informer

Informer是client-go中实现的一个工具包，目前已经被kubernetes中各个组件所使用，例如controller-manager。Informer本质是一个api资源的缓存。

**主要功能**：

- 将etcd数据同步至本地缓存，客户端通过本地缓存读取和监听资源

- 注册资源Add，Update，Delete的触发事件

**目的**：

本地缓存，避免组件直接与api-server交互，减缓对api-server及etcd的访问压力。

## 组件

- Reflector

- Delta FIFO Queue

- Indexer（local strorage）

下面结合流程示意图简单介绍这些组件的角色。

## 流程示意图

![image](https://fs.poneding.com/images/client-go-controller-interaction.jpeg)

这张示意图展示了client-go类库中各个组件的工作机制，以及它们与咱们将要编写的自定义控制器的交互点（黄颜色标注的块是需要自行开发的部分）。

- **Reflector**：
  
  负责监听（Watch）特定Kubernetes资源对象，监听的资源对象可以是内置的资源例如Pod，Ingress等，也可以是定制的CR对象。
  
  Reflettor与ApiServer建立连接，第一次使用`List&Watch`机制从ApiServer中List特定资源的所有实例，这些实例附带的ResourceVersion字段可以用来区分实例是否更新。后续在使用`List&Watch`机制从ApiServer中Watch特定资源的新增，更新，删除等变化（增量Delta）。
  
  将监听到的资源的新增，更新，删除顺序写入到DeltaFIFO队列中。

- **DeltaFIFO**：
  
  一个增量的先进先出的队列，存储监听到的资源，以及资源事件类型，例如Added，Updated，Deleted，Replaced，Sync。

- **Informer**：
  
- **Indexer**：

  一个自带索引功能的本地存储，用于存储资源对象。Informer从DeltaFIFO中Pop出资源，存储到Indexer。Indexer中资源与k8s etcd数据保持一致。本地读取时直接查询本地存储，从而减少k8s apiserver和etcd的压力。

## 使用示例

自定义控制器

```go
clientset, err := kubernetes.NewForConfig(config)
stopCh := make(chan struct{})
defer close(stopch)
sharedInformers := informers.NewSharedInformerFactory(clientset, time.Minute)
informer := sharedInformer.Core().V1().Pods().Informer()

informer.AddEventHandler(cache.ResourceEventHandlerFuncs{
  AddFunc: func(obj interface{} {
     // ...
   },
   UpdateFunc: func(obj interface{} {
     // ...
   },
   DeleteFunc  : func(obj interface{} {
     // ...
   })
   informer.Run(stopCh)
})
```

- Informer 需要通过 ClientSet 与 Kubernetes API Server 交互；
- 创建 stopCh 是用于在程序进程退出前通知 Informer 提前退出，Informer 是一个持久运行的 goroutine；
- NewSharedInformerFactory 实例化了一个 SharedInformer 对象，用于进行本地资源存储；
- sharedInformer.Core().V1().Pods().Informer() 得到了具体 Pod 资源的 informer 对象；
- AddEventHandler 即图中的第6步，这是一个资源事件回调方法，上例中即为当创建/更新/删除 Pod 时触发事件回调方法；
- 一般而言，其他组件使用 Informer 机制触发资源回调方法会将资源对象推送到 WorkQueue 或其他队列中，具体推送的位置要去回调方法里自行实现。

上面这个示例，当触发了 Add，Update 或者 Delete 事件，就通知 Client-go，告知 Kubernetes 资源事件发生变更并且需要进行相应的处理。

## Infromer机制

### 资源Informer

每个内置的k8s资源对实现了对应的Informer机制，均包含Lister和Informer方法，例如：

```go
type PodInformer interface {
    Lister()  cache.SharedIndexInformer
    Informer()  v1.PodLister
}
```

### SharedInformer共享机制

每实例化一个Informer对象，都需要维护一个对应的Reflector。当同一对象Informer实例被实例化多次时，运行过多的ListAndWatch，这其中包括的

---
[« HTTP 客户端调用 Kubernetes APIServer](http-call-k8s-apiserver.md)

[» 通过 Ingress 进行灰度发布](ingress-gray-deploy.md)
