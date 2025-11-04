CREATE DATABASE Finnets;
USE Finnets;

CREATE TABLE Customers (             
    cid INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    username VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(40) NOT NULL 
    );

CREATE TABLE Accounts (
    aid INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(12) NOT NULL UNIQUE,
    CHECK (account_number REGEXP '^[0-9]{10,12}$'),
    balance DECIMAL(10,2) NOT NULL,
    type ENUM('savings', 'checking', 'money market') NOT NULL,
    cid INT,
    FOREIGN KEY (cid) REFERENCES Customers(cid)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
    );


CREATE TABLE Transactions (
    tid BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    aid INT,
    activity ENUM('debit', 'credit') NOT NULL,
    FOREIGN KEY (aid) REFERENCES Accounts(aid)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

-- Sample code to update balances after a transaction
-- BEGIN;

-- INSERT INTO Transactions (aid, amount, activity)
-- VALUES (123, 500.00, 'credit');

-- UPDATE Accounts
-- SET balance = balance + 500.00
-- WHERE aid = 123;

-- COMMIT;

-- Sample code to validate end balances
-- SELECT 
--   a.aid,
--   a.account_number,
--   a.balance AS stored_balance,
--   COALESCE(SUM(
--     CASE 
--       WHEN t.activity = 'credit' THEN t.amount
--       WHEN t.activity = 'debit'  THEN -t.amount
--       ELSE 0
--     END
--   ), 0) AS computed_balance,
--   (a.balance - COALESCE(SUM(
--     CASE 
--       WHEN t.activity = 'credit' THEN t.amount
--       WHEN t.activity = 'debit'  THEN -t.amount
--       ELSE 0
--     END
--   ), 0)) AS discrepancy
-- FROM Accounts a
-- LEFT JOIN Transactions t ON a.aid = t.aid
-- GROUP BY a.aid, a.account_number
-- HAVING discrepancy <> 0;

CREATE TABLE Branches (
    bid INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    cid INT,
    FOREIGN KEY (cid) REFERENCES Customers(cid)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
    );

CREATE TABLE Emails (
    email_id INT AUTO_INCREMENT PRIMARY KEY,
    email_address VARCHAR(100) NOT NULL UNIQUE,
    cid INT,
    FOREIGN KEY (cid) REFERENCES Customers(cid)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

CREATE TABLE ChatLogs (
    chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cid INT,
    message TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cid) REFERENCES Customers(cid)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    );

INSERT INTO Customers (first_name, last_name, username, password) VALUES
('John', 'Doe', 'johndoe', 'password123'),
('Jane', 'Smith', 'janesmith', 'password123');

INSERT INTO Accounts (account_number, balance, type, cid) VALUES
('1234567890', 1000.00, 'checking', 1),
('0000000001', 500.00, 'savings', 1),
('0000000002', 1500.00, 'checking', 2),
('0987654321', 2500.00, 'savings', 2),
('0000000003', 600.00, 'checking', 1);

INSERT INTO Emails (email_address, cid) VALUES
('tuananh.ho@sjsu.edu', 1),
('pikalot0@gmail.com', 2);