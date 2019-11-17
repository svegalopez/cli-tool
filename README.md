# CSV to Database

This is a tool for inserting data from a csv file to a database.

## Install dependencies

run ```npm install``` and then ```npm run```. This will use the 'stories.csv' file located in the project's root.

## Start a Database server

You'll need a db. To run a mysql db:

```
docker run \
-d \
-p 3306:3306 \
--volume=/your-data-directory:/var/lib/mysql \
--name=mysql-server --env="MYSQL_ROOT_PASSWORD=your_password" \
mysql:5.7
```
## Access mysql through container
```
docker exec -ti mysql-server bash
```

```
$ mysql -u root -p
```

enter your password and run :
```
CREATE DATABASE coding_challenge;
```
## DB Configuration



