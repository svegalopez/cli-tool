# CSV to Database

This is a tool for inserting data from a csv file to a database. Is was designed to support large files, see the [comments](https://github.com/svegalopez/data-migration-tool/blob/master/README.md#comments).

## Quick Start

Before you start follow the [steps below](https://github.com/svegalopez/data-migration-tool/blob/master/README.md#start-a-database-server), then run:

```$ npm install``` and then ```$ npm run```. This will use the ```'stories.csv'``` file located in the project's root.

### Start a Database server

You'll need a db. To run a mysql db:

```
$ docker run \
-d \
-p 3306:3306 \
--volume=/your-data-directory:/var/lib/mysql \
--name=mysql-server \
--env="MYSQL_ROOT_PASSWORD=your_password" \
mysql:5.7
```
### Access mysql through container
```
$ docker exec -ti mysql-server bash
```

```
$ mysql -u root -p
```

enter your password and run :
```
CREATE DATABASE coding_challenge;
```
### DB Configuration

The db configuration file is located at ```'src/data/config/db-config.ts'```.
You will need at minimum three env variables. 
Place your environment variables in a ```.env``` file located in the project's root: 

```
DB_USERNAME=root
DB_PASSWORD=your-password
DB_NAME=coding_challenge
```

### Initial Migration

You'll also need a table to insert rows into. 
Before you can run migrations you have to install the projects dependencies: ```$ npm i ```.
Then, to create the table in the db run: ```$ npm run migrate:run```.
This will run the migrations located at ```'src/data/migrations'```.

Finally, to run the script: ```$ npm run```

## Comments 

I tried this approach using streams with the idea that the csv file could potentially include millions of rows.
For this particular example we only had approx 350 rows so a simpler approach would have worked, but I wanted to experiment.
Using streams, and specifically the ```.pipe``` method, node.js handles the back pressure, so the program will not choke the available memory of the host. A csv row is read, transformed into an object and accumulated in an array ```rows```.
When the length of that array reaches ```numRows```, the rows in the array are inserted into the db using a single sql query.
When I was developing I used about 900k rows, and set ```numRows=10000```, and it was pretty fast.


