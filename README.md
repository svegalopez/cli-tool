# CSV to Database

This is a tool for inserting data from a csv file to a database.

## Configure Database

You'll need a db. To run a mysql db:

```
docker run \
-d \
-p 3306:3306 \
--volume=/data:/var/lib/mysql \
--name=mysql-server --env="MYSQL_ROOT_PASSWORD=Guacharaca2019!" \
mysql \
mysqld --default-authentication-plugin=mysql_native_password
```
## Access mysql through container
```
docker exec -ti mysql-server bash
```

```
$ mysql -u root -p
```