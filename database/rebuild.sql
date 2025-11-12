-- ==========================================
-- rebuild.sql
-- Purpose: Builds the CSE 340 database structure and populates tables.
-- ==========================================

-- Drop existing tables (if they exist)
DROP TABLE IF EXISTS inventory, classification, account CASCADE;
DROP TYPE IF EXISTS account_type_enum CASCADE;

-- ==========================================
-- Create ENUM Type for account types
-- ==========================================
CREATE TYPE account_type_enum AS ENUM ('Client', 'Admin');

-- ==========================================
-- Create TABLES
-- ==========================================

-- 1. account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(25) NOT NULL,
    account_lastname VARCHAR(25) NOT NULL,
    account_email VARCHAR(50) UNIQUE NOT NULL,
    account_password VARCHAR(200) NOT NULL,
    account_type account_type_enum DEFAULT 'Client' NOT NULL
);

-- 2. classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(30) UNIQUE NOT NULL
);

-- 3. inventory table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(30) NOT NULL,
    inv_model VARCHAR(30) NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image TEXT NOT NULL,
    inv_thumbnail TEXT NOT NULL,
    inv_price NUMERIC(10,2) NOT NULL,
    inv_stock INT NOT NULL,
    inv_color VARCHAR(20) NOT NULL,
    classification_id INT NOT NULL REFERENCES classification(classification_id)
);

-- ==========================================
-- Populate classification table
-- ==========================================
INSERT INTO classification (classification_name)
VALUES 
('SUV'),
('Sport'),
('Sedan'),
('Truck');

-- ==========================================
-- Populate inventory table
-- ==========================================
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_stock, inv_color, classification_id)
VALUES
('GM', 'Hummer', 'Rugged off-roader with small interiors and bold styling.', '/images/hummer.jpg', '/images/hummer-tn.jpg', 82000, 3, 'Yellow', 1),
('Porsche', '911', 'Iconic performance coupe with agile handling.', '/images/porsche-911.jpg', '/images/porsche-911-tn.jpg', 130000, 2, 'Silver', 2),
('Mazda', 'MX-5', 'Lightweight roadster with precise steering.', '/images/mazda-mx5.jpg', '/images/mazda-mx5-tn.jpg', 32000, 5, 'Red', 2),
('Toyota', 'Camry', 'Reliable sedan with a comfortable ride.', '/images/camry.jpg', '/images/camry-tn.jpg', 28000, 10, 'Blue', 3),
('Ford', 'F-150', 'Best-selling truck with high towing capacity.', '/images/f150.jpg', '/images/f150-tn.jpg', 45000, 8, 'Black', 4);

-- ==========================================
-- Include Assignment 2 queries (4 & 6)
-- ==========================================

-- Query 4: Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 6: Update image paths
UPDATE inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');