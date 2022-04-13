use laundromat;
create table packages
(
	PID 			varchar(20),
    WeightLimit 	decimal(3,1) NOT NULL,
    MaxWashes 		int NOT NULL,
    Price 			int NOT NULL,
    StartDate 		date NOT NULL,
    EndDate 		date NOT NULL,
    Iron 			bool default False,
    primary key (PID),
    check(EndDate >= StartDate)
);

create table Employee
(
	EID 			varchar(20),
    EmpLID			varchar(20) NOT NULL,
    EmpFirstName 	varchar(20) NOT NULL,
	EmpLastName 	varchar(20) default NULL,
    EmpPhone		varchar(10) NOT NULL UNIQUE,
    EmpEmail		varchar(50) NOT NULL UNIQUE,
	EmpSalary		int DEFAULT 15000,
    Sex				char(1) NOT NULL,
    EmpDOB			date,
    DateOfJoining	date NOT NULL,
    -- JobType			varchar(20) DEFAULT 'Worker',
    PRIMARY KEY (EID)
    -- FOREIGN KEY (EmpLID) REFERENCES Laundromat(LID) ON DELETE CASCADE,
    -- CHECK (JobType = 'Manager' OR JobType = 'Worker') 
);

create table manager
(
	ManagerLogin varchar(20) NOT NULL UNIQUE,
    ManagerPassword varchar(20) Default 'password',
    ManagerID varchar(20) NOT NULL,
    -- ManagerLID varchar(20) NOT NULL,
    PRIMARY KEY(ManagerID),
    -- FOREIGN KEY(ManagerLID) REFERENCES Laundromat(LID) ON DELETE CASCADE,
    FOREIGN KEY(ManagerID) REFERENCES Employee(EID) ON DELETE CASCADE
);

create table Laundromat
(
	LID				varchar(20),
    ManagerID		varchar(20),
    LName			varchar(50) NOT NULL UNIQUE,
    LAddress 		varchar(100) NOT NULL UNIQUE,
    TotalCapacity	int DEFAULT 100,
    PRIMARY KEY (LID),
    FOREIGN KEY (ManagerID) REFERENCES Manager(ManagerID) ON DELETE CASCADE
);

create table Worker
(
	EID varchar(20) NOT NULL,
    LID varchar(20) NOT NULL,
    PRIMARY KEY (EID),
    FOREIGN KEY (EID) REFERENCES Employee(EID) ON DELETE CASCADE,
    FOREIGN KEY (LID) REFERENCES Laundromat(LID) ON DELETE CASCADE
);

create table Machine
(
	MachineID 	varchar(20) NOT NULL,
    LID			varchar(20) DEFAULT 'L001',
    ModelNo 	varchar(20) NOT NULL,
    WarrantDate date,
    Capacity 	int DEFAULT 6,
    PRIMARY KEY(MachineID,LID),
    FOREIGN KEY (LID) REFERENCES Laundromat(LID) ON DELETE no action
);

CREATE TABLE Users
(
	UID Varchar(20) NOT NULL,	
	FirstName Varchar(20) NOT NULL,
    LastName Varchar(20) Default NULL,
    Address Varchar(100) NOT NULL,
	Phone Varchar(10) NOT NULL,
	Email Varchar(50),
    Sex char NOT NULL,
	WashesUsed INT default 0,
	PID Varchar(20) NOT NULL,
	PRIMARY KEY (UID,PID),
	FOREIGN KEY (PID) REFERENCES Packages(PID) ON DELETE RESTRICT 
);

create table Order_Details
(
	OrderID					varchar(20) NOT NULL,
    Weight					int DEFAULT 6,
    OStatus					bool DEFAULT FALSE,
    Submission_Date			date NOT NULL,
    Expected_Delivery_Date	date,
    Actual_Delivery_Date	date default NULL,
    UID						varchar(20) NOT NULL,
	PID						varchar(20) NOT NULL,
	LID						varchar(20) NOT NULL,
    PRIMARY KEY(OrderID),
    foreign key(UID,PID) REFERENCES Users(UID,PID) ON DELETE CASCADE,
    FOREIGN KEY (LID) REFERENCES laundromat(LID) ON DELETE CASCADE
);

alter table employee
	add constraint check(DateOfJoining > EmpDOB);
    
alter table machine
	drop column ModelNo;
    
alter table users
	add column Userpassword varchar(20) DEFAULT 'password' AFTER UID;
-- alter table manager
	-- add column (ManagerLID varchar(20) NOT NULL);
-- alter table manager
	-- add constraint foreign key(ManagerID) references laundromat(LId);
    
-- alter table employee 
		-- drop column EmpLID;

-- alter table employee 
	-- add column EmpLID varchar(20) NOT NULL AFTER EID;

-- procedures START

-- DROP PROCEDURE IF EXISTS check_order;
-- DELIMITER $$
-- CREATE PROCEDURE check_order(IN orderID varchar(10), OUT flag bool)
-- 	MODIFIES SQL DATA
-- BEGIN
-- 	IF(orderID NOT IN (SELECT orderID from order_details)) THEN
-- 		SET flag = true;
-- 	ELSE
-- 		SET flag = false;
-- 	END IF;
-- END$$
-- DELIMITER ;

DROP PROCEDURE IF EXISTS add_order;
DELIMITER $$
CREATE PROCEDURE add_order(IN orderID varchar(10), IN Weight int, IN UID varchar(10), IN PID varchar(10), IN LID varchar(10))
	MODIFIES SQL DATA
BEGIN
	IF(orderID IN (SELECT orderID from order_details)) THEN
		IF(UID IN (SELECT UID FROM Users)) THEN
			IF(PID IN (SELECT PID FROM Users where Users.UID = UID))THEN
				IF(LID IN (SELECT LID FROM Laundromat)) THEN
					IF(weight <= (SELECT weightlimit from packages where packages.PID = PID)) THEN
						IF((SELECT users.washesused from users where users.UID = UID) < (SELECT packages.maxwashes from packages where packages.PID = PID)) THEN
							INSERT into order_details(orderID,Weight,Submission_Date,Expected_Delivery_date,UID,PID,LID) values 
								(orderID,Weight,curdate(),date_add(curdate(),INTERVAL 2 DAY),UID,PID,LID);
							UPDATE users SET users.washesused = users.washesused + 1 where users.UID = UID;
						ELSE
							SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'WASH LIMIT EXCEEDED!';
						END IF;
					ELSE
						SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'WEIGHT LIMIT EXCEEDED!';
					END IF;
				ELSE
					SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'LID DOES NOT EXIST';
				END IF;
			ELSE
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PID DOES NOT EXIST';
			END IF;
		ELSE
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'UID DOES NOT EXIST';
		END IF;
    ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'INCORRECT ORDERID';
	END IF;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS get_status;
DELIMITER $$
CREATE PROCEDURE get_status(IN orderID varchar(10), IN UID varchar(10))
	READS SQL DATA
BEGIN
	IF(orderID IN (SELECT orderID from order_details)) THEN
		IF(UID IN (SELECT UID FROM Users)) THEN
						SELECT OrderID,UID,OStatus FROM order_details WHERE order_details.orderID = orderID;
		ELSE
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'UID DOES NOT EXIST';
		END IF;
    ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'INCORRECT ORDERID';
	END IF;
END$$
DELIMITER ;

DROP FUNCTION IF EXISTS is_overdue;
DELIMITER $$
CREATE FUNCTION is_overdue(orderID varchar(10))
	RETURNS varchar(3)
	DETERMINISTIC
BEGIN
	DECLARE sf_value VARCHAR(3);
	IF(curdate() > (SELECT Expected_delivery_date FROM order_details where order_details.orderID = orderID AND Ostatus = False))
		THEN SET sf_value = 'Yes';
	ELSE
		SET sf_value = 'No';
	END IF;
	RETURN sf_value;
END$$
DELIMITER ;

DROP FUNCTION IF EXISTS count_overdue_days;
DELIMITER $$
CREATE FUNCTION count_overdue_days(orderID varchar(10))
	RETURNS int
	DETERMINISTIC
BEGIN
	DECLARE days int;
		IF(curdate() > (SELECT Expected_delivery_date FROM order_details where order_details.orderID = orderID AND Ostatus = False))
			THEN SET days = datediff(curdate(), (SELECT Expected_delivery_date FROM order_details where order_details.orderID = orderID));
            -- THEN SET days = 1;
		ELSE
			SET days = 0;
		END IF;
	RETURN days;
END$$
DELIMITER ;

-- procedures END

show tables;
select * from employee;
select * from users;
select * from packages;
select * from order_details;
select * from manager;
select * from worker;
select * from laundromat;
select * from machine;

--  drop table worker;
--  drop table order_details;
--  drop table machine;
--  drop table laundromat;
--  drop table manager;
--  drop table employee;
--  drop table users;
-- drop table packages;

-- drop database laundromat;

insert into employee values		-- normal insertion
('E001','L001','Kshitij','Garg','9696969696','hellokg@gmail.com',200000,'M','2002-04-15','2020-04-15'),('E002','L001','Urvashi','Darolia','9696969697','helloud0@gmail.com',15000,'F','2001-01-02','2020-04-15'),
('E003','L002','Chirag','Maheshwari','9696969698','hellocm@gmail.com',200000,'M','2005-10-15','2018-01-15'),('E004','L001','Utkarsh','Darolia','9696969699','helloud@gmail.com',15000,'M','1998-02-10','2021-03-15'),
('E005','L001','Tanveer','Singh','9696969688','hellots@gmail.com',15000,'M','2002-11-06','2020-04-15'),('E006','L002','Shreyas','Ketkar','9696969689','hellosk@gmail.com',15000,'M','2000-01-23','2020-04-15');

insert into employee(eid,emplid,empfirstname,emplastname,empphone,empemail,sex,empDOB,dateofjoining) 	-- insertion using default values 
values('E007','L002','Harsh','Neema','9988665544','hellohn@gmail.com','M','1995-08-09','1999-03-03');

insert into manager(managerlogin,managerid) 
	values('M001','E001'),
			('M002','E003');

insert into laundromat 
	values('L001','E001','CVRLaundromat','CVR Bhawan BITS Pilani',6000),
		  ('L002','E003','MalviyaLaundromat','MAlviya Bhawan BITS Pilani',3000);

insert into worker
	values ('E002','L001'),
			('E004','L001'),
            ('E005','L001'),
            ('E006','L002'),
            ('E007','L002');
    
insert into machine 
	values('MECH001','L001','2025-10-10',6),
			('MECH002','L001','2025-11-10',6),
            ('MECH003','L002','2025-06-20',6),
            ('MECH004','L002','2025-10-10',6);

insert into packages
	values('P001',6,4,1000,'2022-01-01','2022-05-22',False),
			('P002',6,8,2000,'2022-01-01','2022-05-22',False),
			('P003',6,4,1500,'2022-01-01','2022-05-22',True),
			('P004',6,8,3000,'2022-01-01','2022-05-22',True);
          
insert into users
	values ('U001','password','Anish','Kasegaonkar','Shankar 2124 BITS Pilani','8989898989','helloak@gmail.com','M',2,'P001'),
		   ('U002','password','Anisha','Kasegaonkar','Meera 2124 BITS Pilani','8989898984','helloak@gmail.com','F',2,'P002'),
           ('U003','password','Kartik','Kumar','Budh 2122 BITS Pilani','8989898489','hellokk@gmail.com','M',2,'P004');
           
insert into order_details
	values ('ORD001',5,True,'2022-01-15','2022-01-17','2022-01-17','U001','P001','L001'),
			('ORD002',3,True,'2022-01-16','2022-01-18','2022-01-17','U002','P002','L002'),
            ('ORD003',4,True,'2022-01-16','2022-01-18','2022-01-18','U003','P004','L001'),
            ('ORD004',5,True,'2022-02-15','2022-02-17','2022-02-17','U001','P001','L001'),
            ('ORD005',6,True,'2022-03-18','2022-03-20','2022-03-22','U002','P002','L001'),
            ('ORD006',7,False,'2022-03-15','2022-03-17',NULL,'U003','P004','L002');
            
CALL add_order('ORD007',2,'U002','P002','L001');
CALL add_order('ORD008',3,'U001','P001','L002');  
-- CALL add_order('ORD009',12,'U002','P002','L001');  -- weight limit exceed error

CALL get_status('ORD008','U002');
SELECT orderID, is_overdue(order_details.orderID) as 'IS_OVERDUE?', count_overdue_days(order_details.orderID) as 'NO_OF_DAYS' from order_details;

-- delete from users;
-- delete from order_details;

-- delete from order_details where orderID = 'ORD008';         
-- delete from employee where EID = 'E001'; 
-- delete from manager;

