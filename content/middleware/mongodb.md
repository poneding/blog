[🏠 首页](../_index.md) / [数据中间件](_index.md) / MongoDB

# MongoDB

## 资料

- <http://cw.hubwiz.com/card/c/543b2f3cf86387171814c026/1/1/1/>
- <http://cw.hubwiz.com/card/c/5438c259032c7817c40298b5/1/1/1/>

## 安装

1. 按照官网给出的指南在 ubuntu 系统安装 mongod，参考 <https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/>

2. 验证 mongo 是否安装成功：进入 ubuntu shell 窗口，直接输入

   ```shell
   mongo --version
   ```

   窗口正常输出 mongo 版本就说明 mongo 安装成功

3. 启动 mongo 服务

   ```shell
   sudo systemctl statt mongod
   #/stop/restart
   ```

4. 创建 dba 用户并添加权限验证

   mongodb 没有开启权限验证之前，使用 mongo 命令可以直接连接本地 mongodb；

   ```shell
   sudo mongo
   ```

   ![1571038757101](https://images.poneding.com/2025/03/202503111821763.png)

   使用 db.createUser 命令创建 dba 用户,为 dba 用户添加所有 database 的管理员权限；

   ```shell
   > db.createUser({user:"dba",pwd:"[your pass]",roles:[ {role:"readWriteAnyDatabase",db:"admin"},{role:"dbAdminAnyDatabase",db:"admin"},{role:"userAdminAnyDatabase",db:"admin"},{role:"clusterAdmin",db:"admin"},{role:"restore",db:"admin"},{role:"backup",db:"admin"} ]})
   Successfully added user: {
           "user" : "dba",
           "roles" : [
                   // ...
           ]
   }
   ```

   > dba 包含的 role:
   >
   > - `readWriteAnyDatabase`
   > - `dbAdminAnyDatabase`
   > - `userAdminAnyDatabase`
   > - `clusterAdmin`
   > - `restore`
   > - `backup`

   修改 mongod.conf 文件，mongodb 可以对外访问，并开启权限验证

   ```shell
   sudo vim /etc/mongod.conf
   ```

   mongod.conf 文件原始内容：![1571038597551](https://images.poneding.com/2025/03/202503111821215.png)

   mongod.conf 修改后内容：

   ![1571039525063](https://images.poneding.com/2025/03/202503111821409.png)

   > 注意：如果仅仅是将 bindIPAll 配置为 true，即允许外部网络网络，而没有开启权限验证，那么外部对 mongodb 拥有很大的操作权限，存在很大的安全问题。

   ```shell
   sudo service mongod restart
   ```

   修改完 mongod.conf 文件后一定要重启 mongo 服务生效。

5. 设置权限验证后就，如果直接通过 mongo 命令连接 mongodb，绝大多数操作都是被禁用的，需要配置权限连接

   ```shell
   sudo mongo [ip/domain name]:[port]/[database] -u username -p pwd
   
   # 如：
   sudo mongo 10.0.0.1:27017/admin -u dba -p [your-pass]
   ```

6. 创建 database

   ```shell
   use devops
   ```

   > 1. 使用 use [database]，如果 database 不存在则会默认新建；
   > 2. 新创建但是不存在数据的 database，使用 `show dbs` 将看不到，除非插入数据
   > 3. 也可以使用 db.createdatabase

7. 为专有 database 创建用户

   ```sehll
   > db.createUser({user:"devops",pwd:"[your pass]",roles:[{role:"readWrite",db:"devops"}]})
   Successfully added user: {
           "user" : "devops",
           "roles" : [
                   {
                           "role" : "readWrite",
                           "db" : "devops"
                   }
           ]
   }
   ```

8. devops 插入数据

   ```shell
   sudo mongo 10.0.0.1:27017/devops -u devops -p [your-pass]
   >use devops
   >db.temp.insert({"name":"devops.mongodb"})
   ```

   ![1571046400329](https://images.poneding.com/2025/03/202503111821212.png)

   > 注意：
   >
   > - db.temp.insert，如果没有 temp collection，则会默认创建。
   >
   > 坑：连接 mongo 时，如果密码带有特殊字符，如！(其他没测)需要在密码前后使用单引号引用起来！！！

9. mongodb 角色： <https://docs.mongodb.com/manual/reference/built-in-roles/>

   - 数据库用户角色：read、readWrite;
   - 数据库管理角色：dbAdmin、dbOwner、userAdmin；
   - 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
   - 备份恢复角色：backup、restore；
   - 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
   - 超级用户角色：root
   - // 这里还有几个角色间接或直接提供了系统超级用户的访问（dbOwner 、userAdmin、userAdminAnyDatabase）
   - 内部角色：__system

## 基础查询

- like 查询

  mongodb 查询

```shell
db.getCollection('test').find({"name":{$regex:/dp/i}}) 

/dp/i 忽略大小写
```

 python mongo 查询

```sql
test._get_collection().find(
        {"name": {'$regex': 'dp', '$options': 'i'}})
```

- not like查询

  mongodb查询

```sql
db.getCollection('test').find({"name":{$not:/dp/i}}) 
```

 python mongo 查询

```python
import re
test._get_collection().find({"path": {'$not': re.compile('dp')}})
```

## 创建索引

```sql
db.getCollection("ColName").createIndex({"Name", 1})

# 如果集合数据量比较大了 那么创建索引会非常耗时，建议使用后台创建
db.getCollection("ColName").createIndex({"Name", 1}, {"background": true})
```

## 用户

修改用户密码：

```sql
db.changeUserPassword("username","new_pwd")
```

---
[« Elasticsearch](elasticsearch.md)

[» MySQL](mysql.md)
