-- 1) INSERT Tony Stark into the account table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2) UPDATE Tony Stark's account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3) DELETE the Tony Stark account
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4) Update GM Hummer description using REPLACE
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5) INNER JOIN: return make, model, classification name for 'Sport' items
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6) Update all inv_image and inv_thumbnail paths to include '/vehicles'
UPDATE inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
