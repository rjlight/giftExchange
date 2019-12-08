CREATE TABLE couples (
couples_id         INT PRIMARY KEY,
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

queries

SELECT group_username FROM groups WHERE group_username = 'Lights';
SELECT group_password FROM groups WHERE group_password = 'lp';

DELETE FROM singles WHERE single_id = 2;