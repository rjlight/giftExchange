--simplified db--
SELECT single_name1, single_name2, single_name3, single_name4, single_name5, single_name6, single_name7, single_name8,
c_first_name1, c_second_name1, c_first_name2, c_second_name2, c_first_name3, c_second_name3, c_first_name4, c_second_name4, c_first_name5, c_second_name5,
c_first_name6, c_second_name6, c_first_name7, c_second_name7, c_first_name9, c_second_name9, c_first_name8, c_second_name8,
c_first_name10, c_second_name10, c_first_name11, c_second_name11, c_first_name12, c_second_name12, c_first_name13, c_second_name13
FROM groups
WHERE group_id = 1;

CREATE TABLE groups (
group_id       INT PRIMARY KEY,
single_name1 VARCHAR(25),
c_first_name1 VARCHAR(25),
c_second_name1 VARCHAR(25),
single_name2 VARCHAR(25),
c_first_name2 VARCHAR(25),
c_second_name2 VARCHAR(25),
single_name3 VARCHAR(25),
c_first_name3 VARCHAR(25),
c_second_name3 VARCHAR(25),
single_name4 VARCHAR(25),
c_first_name4 VARCHAR(25),
c_second_name4 VARCHAR(25),
single_name5 VARCHAR(25),
c_first_name5 VARCHAR(25),
c_second_name5 VARCHAR(25),
single_name6 VARCHAR(25),
c_first_name6 VARCHAR(25),
c_second_name6 VARCHAR(25),
single_name7 VARCHAR(25),
c_first_name7 VARCHAR(25),
c_second_name7 VARCHAR(25),
single_name8 VARCHAR(25),
c_first_name8 VARCHAR(25),
c_second_name8 VARCHAR(25),
c_first_name9 VARCHAR(25),
c_second_name9 VARCHAR(25),
c_first_name10 VARCHAR(25),
c_second_name10 VARCHAR(25),
c_first_name11 VARCHAR(25),
c_second_name11 VARCHAR(25),
c_first_name12 VARCHAR(25),
c_second_name12 VARCHAR(25),
c_first_name13 VARCHAR(25),
c_second_name13 VARCHAR(25),

single_email1  VARCHAR(35),
couple_email1 VARCHAR (35),
single_email2  VARCHAR(35),
couple_email2 VARCHAR (35),
single_email3  VARCHAR(35),
couple_email3 VARCHAR (35),
single_email4  VARCHAR(35),
couple_email4 VARCHAR (35),
single_email5  VARCHAR(35),
couple_email5 VARCHAR (35),
single_email6  VARCHAR(35),
couple_email6 VARCHAR (35),
single_email7  VARCHAR(35),
couple_email7 VARCHAR (35),
single_email8  VARCHAR(35),
couple_email8 VARCHAR (35),
couple_email9 VARCHAR (35),
couple_email10 VARCHAR (35),
couple_email11 VARCHAR (35),
couple_email12 VARCHAR (35),
couple_email13 VARCHAR (35)
); 

CREATE TABLE account (
a_id       SERIAL PRIMARY KEY,
a_username VARCHAR(35) NOT NULL,
a_password VARCHAR(255) NOT NULL,
group_id INT,
FOREIGN KEY (group_id) REFERENCES groups (group_id)
);

SELECT group_id FROM account;

INSERT INTO groups (group_id, single_name1, c_first_name1, c_second_name1, single_email1, couple_email1)
VALUES (1, 'liz', 'Brent', 'Rachel', 'liz@yes', 'b@yes');

--create group then account
INSERT INTO groups (group_id)
VALUES ([number]);

INSERT INTO account (a_username, a_password, group_id)
VALUES (username, password, [group_id]);

--single update
UPDATE groups
SET single_email[number] = 'annie@yahoo.com', single_name[samenumber] ='anna'
WHERE group_id = 1;

--couple update
UPDATE groups
SET c_first_name[] = 'annie@yahoo.com', c_second_name[] = , couple_email[] =
WHERE group_id = 1;

--display
SELECT g.single_name1, g.c_first_name1, g.c_second_name1
FROM groups g INNER JOIN account a ON g.group_id = a.group_id;

SELECT g.single_name2, g.c_first_name2, g.c_second_name2
FROM groups g INNER JOIN account a ON g.group_id = a.group_id;

--will require 13 different queries to display all information
--not sure how that will work yet -_-
INSERT INTO account (a_username, a_password, group_id)
VALUES ('Lights', 'lp', 1);

UPDATE groups
SET single_email2 = 'annie@yahoo.com', single_name2 ='anna'
WHERE group_id = 1;

SELECT g.single_name1, g.c_first_name1, g.c_second_name1
FROM groups g INNER JOIN account a ON g.group_id = a.group_id;

SELECT g.single_name2, g.c_first_name2, g.c_second_name2
FROM groups g INNER JOIN account a ON g.group_id = a.group_id;

GRANT ALL PRIVILEGES ON account TO giftadmin;
GRANT ALL PRIVILEGES ON groups TO giftadmin;
GRANT USAGE, SELECT ON SEQUENCE account_a_id_seq TO giftadmin;

SELECT single_name1, single_name2, single_name3, single_name4 FROM groups WHERE group_id = 1;
DELETE FROM groups WHERE c_first_name2 = 'Timmo' AND c_second_name2 ='Debryn';  c_first_name3, c_second_name3, c_first_name5, c_second_name5, c_first_name4, c_second_name4 FROM groups WHERE group_id = 1;
SELECT c_first_name2, c_second_name2,  c_first_name3, c_second_name3, c_first_name5, c_second_name5, c_first_name4, c_second_name4 FROM groups WHERE group_id = 1;

--updated db--
CREATE TABLE couples (
  first_name  VARCHAR(35) NOT NULL,
  second_name VARCHAR(35) NOT NULL,
  couple_email VARCHAR(35) PRIMARY KEY 
);
CREATE TABLE groups (
group_id       SERIAL PRIMARY KEY,
group_username VARCHAR(35) NOT NULL,
group_password VARCHAR(255) NOT NULL,
single_email1  VARCHAR(35),
couple_email1 VARCHAR (35),
single_email2  VARCHAR(35),
couple_email2 VARCHAR (35),
single_email3  VARCHAR(35),
couple_email3 VARCHAR (35),
single_email4  VARCHAR(35),
couple_email4 VARCHAR (35),
single_email5  VARCHAR(35),
couple_email5 VARCHAR (35),
single_email6  VARCHAR(35),
couple_email6 VARCHAR (35),
single_email7  VARCHAR(35),
couple_email7 VARCHAR (35),
single_email8  VARCHAR(35),
couple_email8 VARCHAR (35),
couple_email9 VARCHAR (35),
couple_email10 VARCHAR (35),
couple_email11 VARCHAR (35),
couple_email12 VARCHAR (35),
couple_email13 VARCHAR (35),
FOREIGN KEY (couple_email1) REFERENCES couples (couple_email),
FOREIGN KEY (single_email1) REFERENCES singles (single_email),
FOREIGN KEY (couple_email2) REFERENCES couples (couple_email),
FOREIGN KEY (single_email2) REFERENCES singles (single_email),
FOREIGN KEY (couple_email3) REFERENCES couples (couple_email),
FOREIGN KEY (single_email3) REFERENCES singles (single_email),
FOREIGN KEY (couple_email4) REFERENCES couples (couple_email),
FOREIGN KEY (single_email4) REFERENCES singles (single_email),
FOREIGN KEY (couple_email5) REFERENCES couples (couple_email),
FOREIGN KEY (single_email5) REFERENCES singles (single_email),
FOREIGN KEY (couple_email6) REFERENCES couples (couple_email),
FOREIGN KEY (single_email6) REFERENCES singles (single_email),
FOREIGN KEY (couple_email7) REFERENCES couples (couple_email),
FOREIGN KEY (single_email7) REFERENCES singles (single_email),
FOREIGN KEY (couple_email8) REFERENCES couples (couple_email),
FOREIGN KEY (single_email8) REFERENCES singles (single_email),
FOREIGN KEY (couple_email9) REFERENCES couples (couple_email),
FOREIGN KEY (couple_email10) REFERENCES couples (couple_email),
FOREIGN KEY (couple_email11) REFERENCES couples (couple_email),
FOREIGN KEY (couple_email12) REFERENCES couples (couple_email),
FOREIGN KEY (couple_email13) REFERENCES couples (couple_email)
); 
CREATE TABLE singles (
  single_name  VARCHAR(35) NOT NULL,
  single_email VARCHAR(35) PRIMARY KEY
);

INSERT INTO groups (group_username, group_password)
VALUES ('Lights', 'lp');

INSERT INTO singles (single_name, single_email)
VALUES ('Liz', 'liard@yahoo.com');
INSERT INTO singles (single_name, single_email)
VALUES ('anna', 'annie@yahoo.com');

INSERT INTO couples (first_name, second_name, couple_email)
VALUES ('Brent', 'Rachel', 'b@yahoo.com');

UPDATE groups
SET single_email1 = 'liard@yahoo.com', couple_email1 = 'b@yahoo.com'
WHERE group_username = 'Lights' AND group_password = 'lp';

UPDATE groups
SET single_email2 = 'annie@yahoo.com'
WHERE group_username = 'Lights' AND group_password = 'lp';

SELECT c.first_name as names, c.second_name as names, s.single_name as names
FROM couples c INNER JOIN groups g ON c.couple_email = g.couple_email1 
INNER JOIN singles s ON g.single_email1 = s.single_email;

SELECT c.first_name as names, c.second_name as names, s.single_name as names
FROM couples c INNER JOIN groups g ON c.couple_email = g.couple_email2 
INNER JOIN singles s ON g.single_email2 = s.single_email;



--old db--
CREATE TABLE couples (
couples_id         SERIAL PRIMARY KEY,
first_person_name  VARCHAR(35) NOT NULL,
second_person_name VARCHAR(35) NOT NULL,
first_email        VARCHAR(35) NOT NULL,
second_email       VARCHAR(35) NOT NULL
);

A join to show all group members

SELECT c.first_person_name, c.second_person_name, s.single_name, g.group_id 
FROM couples c INNER JOIN association a ON c.couples_id = a.couples_id 
INNER JOIN singles s ON a.singles_id = s.single_id 
INNER JOIN groups g ON g.group_id = a.group_id;

SELECT c.first_person_name, c.second_person_name, s.single_name, g.group_id 
FROM couples c INNER JOIN association a ON c.couples_id = g.couples_id 
INNER JOIN singles s ON a.singles_id = s.single_id 
INNER JOIN groups g ON g.group_id = a.group_id;

CREATE TABLE singles (
single_id    INT PRIMARY KEY,
single_name  VARCHAR(35) NOT NULL,
single_email VARCHAR(35) NOT NULL
);
CREATE TABLE groups (
group_id       INT PRIMARY KEY,
group_username VARCHAR(35) NOT NULL,
group_password VARCHAR(255) NOT NULL
);
CREATE TABLE association (
assoc_id   SERIAL PRIMARY KEY,
group_id   INT,
couples_id INT,
singles_id INT,
FOREIGN KEY (group_id) REFERENCES groups (group_id),
FOREIGN KEY (couples_id) REFERENCES couples (couples_id),
FOREIGN KEY (singles_id) REFERENCES singles (single_id)
);

INSERT INTO association (group_id, couples_id, singles_id)
VALUES (1, 1, 1);

INSERT INTO groups (group_id, group_username, group_password)
VALUES (1, 'Lights', 'lp');

INSERT INTO singles (single_id, single_name, single_email)
VALUES (1, 'Liz', 'liard@yahoo.com');

INSERT INTO couples (couples_id, first_person_name, second_person_name, first_email, second_email)
VALUES (1, 'Brent', 'Rachel', 'b@yahoo.com', 'r@yahoo.com');

CREATE USER giftadmin WITH PASSWORD 'gifty';

GRANT ALL PRIVILEGES ON couples TO giftadmin;
GRANT ALL PRIVILEGES ON singles TO giftadmin;
GRANT ALL PRIVILEGES ON groups TO giftadmin;
GRANT ALL PRIVILEGES ON association TO giftadmin;

GRANT SELECT, INSERT, UPDATE, DELETE 
ON couples TO giftadmin;

GRANT SELECT, INSERT, UPDATE, DELETE 
ON singles TO giftadmin;

GRANT SELECT, INSERT, UPDATE, DELETE 
ON groups TO giftadmin;

GRANT SELECT, INSERT, UPDATE, DELETE 
ON association TO giftadmin;

#may need to grant to individual tables

GRANT USAGE, SELECT ON SEQUENCE association_assoc_id_seq TO giftadmin;
GRANT USAGE, SELECT ON SEQUENCE account_a_id_seq TO giftadmin;

queries

SELECT group_username FROM groups WHERE group_username = 'Lights';
SELECT group_password FROM groups WHERE group_password = 'lp';

DELETE FROM singles WHERE single_id = 2;