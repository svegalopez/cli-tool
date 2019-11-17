# CSV to Database

This is a tool for inserting data from a csv file to a database. It was designed to support large files, see the [comments](https://github.com/svegalopez/data-migration-tool/blob/master/README.md#comments). The script uses the ```'stories.csv'``` file located in the project's root, but it could be extended to receive a path via the command line.

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

You'll also need to create a table to insert the data into, so we will run a migration.
Before you can run migrations you have to install the project's dependencies: ```$ npm i ```.<br>
Then run: ```$ npm run migrate:run```. This will run the migrations located at ```'src/data/migrations'```.

### Run the script!

Finally, to run the script: ```$ npm run``` That will copy all the rows in the csv into a table, after asserting each row's type at runtime.

## Comments 

I tried this approach using streams with the idea that the csv file could potentially include millions of rows.
For this particular example we only had approx 350 rows so a simpler approach would have worked, but I wanted to experiment.
Using streams, and specifically the ```.pipe``` method, node.js handles the back pressure, so the program will not choke the available memory of the host. A csv row is read, transformed into an object and accumulated in an array ```rows```.
When the length of that array reaches ```numRows```, the rows in the array are inserted into the db using a single sql query.
When I was developing I used about 900k rows, and set ```numRows=10000```, and it was pretty fast.


