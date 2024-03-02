CREATE DATABASE templato_blog;


CREATE TABLE blogpost (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author VARCHAR(50) ,
  username VARCHAR(50),
  blogtitle VARCHAR(50) ,
  blogpost VARCHAR(250),
  mood VARCHAR(50) ,
  submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
) ENGINE=INNODB;

INSERT INTO blogpost (author, username, blogtitle, blogpost, mood, submitted) VALUES('Raymond', 'Raymond', 'Great Day','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.consequat.','happy','2022-02-19'),('Bill', 'Bill','Confusing Day','Lorem ipsum dolor sit amet, consectetur ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris consequat.','confused','2022-02-19'),('Kevin', 'Kevin','Why pay council tax','Lorem ipsum tempor incididunt ut labore et dolore magna aliqua. exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.','angry','2022-02-19'), ('Tyler', 'Tyler','I hate Boris Johnson','Lorem ipsum tempor incididunt ut labore et dolore magna aliqua. exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.','angry','2022-02-19');


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(50) UNIQUE,
  hashpassword VARCHAR(100) ,
  date_submitted DATE 
) ENGINE=INNODB;
