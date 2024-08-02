
Detailed Steps to execute the Project


MySQL:
1.	Download the mysql server from this link  https://dev.mysql.com/downloads/mysql/8.0.html
2.	Open the link and click on recommended msi download
3.	Then click on download windows(x84, 32bit),mysql installer community 8.0.39.msi,MSI installer.
4.	Then click on “no thanks just start my download”
5.	Once it is downloaded, install the server
6.	In the first page select the server and click add
7.	Then from server select mysql 8.0.39
8.	Click next till it finishes the installation, let the port number be default to 3306 and remember the root password which you have entered in this installation process.
9.	Download Mysql workbench from this link https://dev.mysql.com/downloads/workbench/
10.	Open the link  and download windows(x84, 64bit),MSI installer,
11.	Once it is downloaded, install the workbench
12.	After it is installed, open it
13.	select local instance from mysql connections
14.	it will ask for root password, enter the password which you have entered while installing mysql server
15.	Now it will be connected to localhost
16.	Open the query Editor and execute the queries from queries section below

Queries:
1)create database social_media;
2)use social_media;
3) CREATE TABLE `user_details` (
	`user_id` VARCHAR(128) NOT NULL DEFAULT '' COLLATE 'utf8mb4_0900_ai_ci',
	`user_name` VARCHAR(64) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`password` VARCHAR(64) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`name` VARCHAR(64) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`email` VARCHAR(64) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`gender` VARCHAR(64) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`bio` VARCHAR(64) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`image` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`dob` VARCHAR(64) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`question` TEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`answer` TEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	PRIMARY KEY (`user_id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB;

4) CREATE TABLE `follows` (
	`follower_id` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`followed_id` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`created_ts` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	`status` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`follower_id`, `followed_id`) USING BTREE,
	INDEX `followed_id` (`followed_id`) USING BTREE,
	CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `user_details` (`user_id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `user_details` (`user_id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB;
5)
CREATE TABLE `post` (
	`post_id` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_0900_ai_ci',
	`user_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`text_content` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`content_url` LONGTEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`created_ts` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`post_id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB;
6) CREATE TABLE `likes` (
	`like_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`post_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`user_id` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`created_ts` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`like_id`) USING BTREE,
	UNIQUE INDEX `post_id` (`post_id`, `user_id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB;
7) CREATE TABLE `comments` (
	`comment_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`post_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`user_id` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`comment_text` TEXT NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`created_ts` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`comment_id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;






Front End:
1.	After unzipping the file, open the projectFinal folder in the visual studio code Editor
2.	Now open the terminal, your path will be till projectFinal. So Navigate to project folder which is inside the projectFinal folder and then install dependendencies from package and run the front end with these commands
3.	cd project
4.	npm  i
5.	npm  start

Back End:
1.	Open the pyFinal folder in a new window of visual studio code
2.	Open connection.py file from this path pyFinalPyflask-rest-apidbconnection.py and update the password for root user with the password selected while installing mysql server.
3.	Open and Terminal, your path will be till pyFinal. So Navigate to Py, then to flask-rest-api  and execute app.py file with these commands
4.	cd Py
5.	cd flask-rest-api
6.	python app.py
