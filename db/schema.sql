DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id int NOT NULL AUTO_INCREMENT,
    product_name varchar(255) NOT NULL,
    department_name varchar(255) NOT NULL,
    price INT NOT NULL,
    `stock _quantity` INT NOT NULL,
    PRIMARY KEY (item_id)
);