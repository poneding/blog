[🏠 首页](../_index.md) / [AWS](_index.md) / Terraform 重新管理资源

# Terraform 重新管理资源

看到这个标题你可能会有点懵，我先来解释下。

在使用Terraform管理AWS的VPC-Subnet资源时（下面是定义资源的代码清单），我遇到了一个问题：当我修改aws_subnet.eks-private-subnet-1资源的cidr_block时，假设我修改成了`172.28.2.0/24`，这时候旧的

```tex
resource "aws_subnet" "eks-private-subnet-1" {
  vpc_id                  = "${var.vpc_id}"
  cidr_block              = "172.28.1.0/24"
  map_public_ip_on_launch = "false"
  availability_zone       = "${var.region}a"

 tags = merge(
        {Name = "${var.cluster_name}-private-subnet-1a"}, 
        "${local.cluster_private_subnet_tags}")
}
```

---
[« K8s 部署 Postgres](k8s-deploy-postgres.md)
