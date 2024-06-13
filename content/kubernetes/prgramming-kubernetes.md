[🏠 首页](../_index.md) / [Kubernetes](_index.md) / Kubernetes 编程

# Kubernetes 编程

开始 Kuberntes 编程之旅～

```bash
mkdir programming-kubernetes && cd programming-kubernetes
git mod init programming-kubernetes
```

**常用包**：

- kubeconfig 对应的结构

```go
clientcmdapi "k8s.io/client-go/tools/clientcmd/api"

clientcmdapi.Config
```

## 编写自定义 API

- 随机生成字符

```go
"k8s.io/apimachinery/pkg/util/rand"

rand.String(5)
```

**参考**：

- [kubernetes/code-generator: Generators for kube-like API types (github.com)](https://github.com/kubernetes/code-generator)

- [code-generator 使用](https://tangxusc.github.io/blog/2019/05/code-generator使用/)
- [B站 code-generator 介绍](https://www.bilibili.com/video/BV1Pa411q78H?spm_id_from=333.337.search-card.all.click)

```bash
mkdir hack
vim hack/boilerplate.go.txt
```

```tex
/*
Copyright 2022 programming-kubernetes.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
```

```bash
mkdir -p pkg/apis/demo/v1alpha
vim pkg/apis/demo/v1alpha/doc.go
```

```go
/*
Copyright 2022 programming-kubernetes.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// +k8s:deepcopy-gen=package
// +groupName=demo.pk.io

package v1alpha1
```

> 文件名称一定要是 `doc.go`，要不然无法成功生成 `deepcopy` 代码；
>
> // +groupName=demo.pk.io，将根据该注释在 client 中生成对应的组

```bash
vim pkg/apis/demo/v1alpha/types.go
```

```go
/*
Copyright 2022 programming-kubernetes.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package v1alpha1

import (
 corev1 "k8s.io/api/core/v1"
 metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// +genclient
// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// Foo -
type Foo struct {
 metav1.TypeMeta   `json:",inline"`
 metav1.ObjectMeta `json:"metadata,omitempty" protobuf:"bytes,1,opt,name=metadata"`
 Spec              FooSpec   `json:"spec,omitempty" protobuf:"bytes,2,opt,name=spec"`
 Status            FooStatus `json:"status,omitempty" protobuf:"bytes,3,opt,name=status"`
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object
type FooList struct {
 metav1.TypeMeta `json:",inline"`
 metav1.ListMeta `json:"metadata,omitempty" protobuf:"bytes,1,opt,name=metadata"`
 Items           []Foo `json:"items" protobuf:"bytes,2,rep,name=items"`
}

type FooSpec struct {
 Name string `json:"name" protobuf:"bytes,1,opt,name=name"`
 Desc string `json:"desc" protobuf:"bytes,2,opt,name=desc"`
}

type FooStatus struct {
 Conditions []FooCondition `json:"conditions,omitempty" protobuf:"bytes,1,rep,name=conditions"`
}

type FooCondition struct {
 // Type of team condition.
 Type FooConditionType `json:"type" protobuf:"bytes,1,opt,name=type,casttype=TeamConditionType"`
 // Status of the condition, one of True, False, Unknown.
 Status corev1.ConditionStatus `json:"status" protobuf:"bytes,2,opt,name=status,casttype=k8s.io/api/core/v1.ConditionStatus"`
 // Last time the condition transitioned from one status to another.
 // +optional
 LastTransitionTime metav1.Time `json:"lastTransitionTime,omitempty" protobuf:"bytes,3,opt,name=lastTransitionTime"`
 // The reason for the condition's last transition.
 // +optional
 Reason string `json:"reason,omitempty" protobuf:"bytes,4,opt,name=reason"`
 // A human readable message indicating details about the transition.
 // +optional
 Message string `json:"message,omitempty" protobuf:"bytes,5,opt,name=message"`
}

type FooConditionType string
```

```bash
vim pkg/apis/demo/v1alpha/register.go
```

```go
/*
Copyright 2022 Ketches.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package v1alpha1

import (
 metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
 "k8s.io/apimachinery/pkg/runtime"
 "k8s.io/apimachinery/pkg/runtime/schema"
)

var SchemeGroupVersion = schema.GroupVersion{Group: "demo.pk.io", Version: "v1alpha1"}

var (
 SchemeBuilder      runtime.SchemeBuilder
 localSchemeBuilder = &SchemeBuilder
 AddToScheme        = localSchemeBuilder.AddToScheme
)

func init() {
 // We only register manually written functions here. The registration of the
 // generated functions takes place in the generated files. The separation
 // makes the code compile even when the generated files are missing.
 localSchemeBuilder.Register(addKnownTypes)
}

// Resource takes an unqualified resource and returns a Group qualified GroupResource
func Resource(resource string) schema.GroupResource {
 return SchemeGroupVersion.WithResource(resource).GroupResource()
}

// Adds the list of known types to the given scheme.
func addKnownTypes(scheme *runtime.Scheme) error {
 scheme.AddKnownTypes(SchemeGroupVersion,
  &Foo{},
  &FooList{},
 )

 scheme.AddKnownTypes(SchemeGroupVersion,
  &metav1.Status{},
 )
 metav1.AddToGroupVersion(scheme, SchemeGroupVersion)
 return nil
}
```

需要在机器上克隆下 `k8s.io/code-generator` 仓库：

```bash
mkdir -p $GOPATH/src/k8s.io && cd $GOPATH/src/k8s.io
git clone https://github.com/kubernetes/code-generator.git
```

回到 `programming-kubernetes/hack` 项目目录：

```bash
mkdir hack && cd hack
vim update-codegen.sh
```

```bash
#!/usr/bin/env bash

# Copyright 2022 Ketches.

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -o errexit
set -o nounset
set -o pipefail

SCRIPT_ROOT=$(dirname "${BASH_SOURCE[0]}")/..

# generate the code with:
# - --output-base because this script should also be able to run inside the vendor dir of
#   k8s.io/kubernetes. The output-base is needed for the generators to output into the vendor dir
#   instead of the $GOPATH directly. For normal projects this can be dropped.
~/go/src/k8s.io/code-generator/generate-groups.sh \
    all \
    programming-kubernetes/pkg/client \
    programming-kubernetes/pkg/apis \
    "demo.dev:v1alpha1" \
    --output-base ${SCRIPT_ROOT}/.. \
    --go-header-file ${SCRIPT_ROOT}/hack/boilerplate.go.txt
```

> "demo:v1alpha1" 需要保持 api 的目录一致，而不是 groupname
>
> 如果项目 `mod` 名称中包含 “/”，那么项目也需要放在完整的目录下，例如 `mod` 名称为 `github.com/poneding/programming-kubernetes`，那么项目一定要放在 `[..]/github.com/poneding/programming-kubernetes` 下，此时 `--output-base` 也需要调整，需要增加目录查找长度 `${SCRIPT_ROOT}/../../..`。

测试使用自定义 API 的 client，infromer，lister 等：

```bash
# programming-kubernets 项目目录
mkdir -p manifests/crd
vim manitests/crd/demo-foo.yaml
```

安装 `controller-gen` 工具

```yaml
go install sigs.k8s.io/controller-tools/cmd/controller-gen@latest
```

生成 crd yaml 文件

```go
controller-gen 
```

---
[« Kubernetes 0-1 了解 Pod](pod-understood.md)

[» Prometheus-监控Kong完整操作](prometheus-collect-kong-metrics.md)
