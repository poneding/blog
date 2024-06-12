[我的博客](../_index.md) / [数据中间件](_index.md) / Postgres

# Postgres

自增 Id 数据插入权限

```sql
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO <user_name>;
```

修改用户密码

```sql
alter user postgres with password 'admin123';
```

---
[« MySQL](mysql.md)

[» Redis](redis.md)
