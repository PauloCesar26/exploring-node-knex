create database db_test_api;
use db_test_api;

create table infoUsers(
id int AUTO_INCREMENT,
userImg varchar(255),
nome varchar(100),
email varchar(100),
slug varchar(100),
primary key(id)
);

create table adminApp(
id_admin int auto_increment,
userName varchar(50),
userPassword varchar(50),
PRIMARY KEY(id_admin)
);

create table content_post(
id_post int auto_increment,
id_card int,
type_content varchar(50),
content text,
position_content int,
image varchar(255),
PRIMARY KEY(id_post),
FOREIGN KEY (id_card) REFERENCES infoUsers(id) ON DELETE CASCADE
);

INSERT INTO adminApp (userName, userPassword)
VALUES ('paulo', '123456');

SELECT * FROM infoUsers;
SELECT * FROM adminApp;
SELECT * FROM content_post;

DROP TABLE infoUsers;
DROP TABLE content_post;