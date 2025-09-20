-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.6.5-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ecommerce_db
DROP DATABASE IF EXISTS `ecommerce_db`;
CREATE DATABASE IF NOT EXISTS `ecommerce_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `ecommerce_db`;

-- Dumping structure for table ecommerce_db.carts
DROP TABLE IF EXISTS `carts`;
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `updated_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.carts: ~1 rows (approximately)
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT IGNORE INTO `carts` (`id`, `user_id`, `created_date`, `updated_date`) VALUES
	(1, 4, '2025-09-20 08:56:09.000000', '2025-09-20 08:56:09.000000');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.cart_items
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) DEFAULT NULL,
  `cart_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `added_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FK1re40cjegsfvw58xrkdp6bac6` (`product_id`),
  CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.cart_items: ~0 rows (approximately)
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.categories
DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.categories: ~2 rows (approximately)
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT IGNORE INTO `categories` (`id`, `description`, `name`) VALUES
	(1, 'bánh nướng de', 'bánh nướng'),
	(2, 'bánh  dẻo de', 'bánh dẻo');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `updated_date` datetime(6) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `notes` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnthkiu7pgmnqnu86i2jyoe2v7` (`order_number`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.orders: ~2 rows (approximately)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT IGNORE INTO `orders` (`id`, `customer_email`, `customer_name`, `customer_phone`, `order_date`, `order_number`, `payment_method`, `payment_status`, `shipping_address`, `status`, `total_amount`, `updated_date`, `user_id`, `notes`) VALUES
	(1, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-20 10:43:24.000000', 'ORD-1758365004806-542', 'COD', 'PAID', 'Thanh Trì', 'DELIVERED', 140000.00, '2025-09-20 14:38:42.000000', 4, 'Đang giao hàng đến >>\n'),
	(2, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-20 10:47:04.000000', 'ORD-1758365224809-247', 'COD', 'PENDING', 'Hà Nội', 'PROCESSING', 25000.00, '2025-09-20 14:18:59.000000', 4, NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.order_items
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(38,2) NOT NULL,
  `unit_price` decimal(38,2) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.order_items: ~4 rows (approximately)
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT IGNORE INTO `order_items` (`id`, `quantity`, `subtotal`, `unit_price`, `order_id`, `product_id`) VALUES
	(1, 2, 50000.00, 25000.00, 1, 6),
	(2, 2, 60000.00, 30000.00, 1, 7),
	(3, 1, 30000.00, 30000.00, 1, 8),
	(4, 1, 25000.00, 25000.00, 2, 6);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `stock` int(11) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `active` bit(1) DEFAULT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `dimensions` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `material` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `review_count` int(11) DEFAULT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `weight` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.products: ~13 rows (approximately)
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT IGNORE INTO `products` (`id`, `description`, `image_url`, `name`, `price`, `stock`, `category_id`, `active`, `brand`, `color`, `created_at`, `dimensions`, `material`, `rating`, `review_count`, `sku`, `updated_at`, `weight`) VALUES
	(5, 'Bánh nướng thập cẩm đẳng cấp thế giới ,Bánh nướng thập cẩm đẳng cấp thế giới ', '/images/3c3d64f0-a3e5-4544-b403-4acaefa01190.jpg', 'Bánh nướng thập cẩm ', 25000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Red', '2025-09-19 08:31:20.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:27:54.000000', NULL),
	(6, 'Bánh nướng đậu xanhBánh nướng đậu xanhBánh nướng đậu xanh', '/images/f4666022-c7be-4b6f-81c3-6f529aa34528.jpg', 'Bánh nướng đậu xanh', 25000.00, 30, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Green', '2025-09-19 09:21:08.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-20 10:02:18.000000', NULL),
	(7, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 30, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-20 10:02:22.000000', NULL),
	(8, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 30, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-20 10:02:27.000000', NULL),
	(9, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:32:32.000000', NULL),
	(10, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:32:32.000000', NULL),
	(11, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:32:32.000000', NULL),
	(12, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:32:32.000000', NULL),
	(13, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:32:32.000000', NULL),
	(15, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:32:32.000000', NULL),
	(16, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:32:32.000000', NULL),
	(17, 'Bánh nướng khoái môn ,Bánh nướng khoái mônBánh nướng khoái mônBánh nướng khoái môn', '/images/8058fb71-56df-4bdd-9502-68a6b2e34453.jpg', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', 'Bánh Kẹo Sinh Sửu', 'Perple', '2025-09-19 09:32:32.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-19 09:32:32.000000', NULL),
	(18, 'Bánh nướng khoái mônBánh nướng khoái môn', '/images/cbc9ca5f-69e3-4abf-9a06-08d450efba41.png', 'Bánh nướng khoái môn', 30000.00, 1, 1, b'1', ' SKU Brand', 'Perple', '2025-09-20 10:04:28.000000', NULL, NULL, NULL, NULL, 'SKU', '2025-09-20 10:04:28.000000', NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.roles
DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.roles: ~2 rows (approximately)
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT IGNORE INTO `roles` (`id`, `description`, `name`) VALUES
	(3, 'Administrator', 'ADMIN'),
	(4, 'Regular User', 'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.role_url
DROP TABLE IF EXISTS `role_url`;
CREATE TABLE IF NOT EXISTS `role_url` (
  `role_id` bigint(20) NOT NULL,
  `url_id` bigint(20) NOT NULL,
  PRIMARY KEY (`role_id`,`url_id`),
  KEY `FK59494iepe61dnpf7domwckk42` (`url_id`),
  CONSTRAINT `FK59494iepe61dnpf7domwckk42` FOREIGN KEY (`url_id`) REFERENCES `urls` (`id`),
  CONSTRAINT `FK5c2fwqwq32gj1wywe6j48plnv` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.role_url: ~33 rows (approximately)
/*!40000 ALTER TABLE `role_url` DISABLE KEYS */;
INSERT IGNORE INTO `role_url` (`role_id`, `url_id`) VALUES
	(3, 14),
	(3, 15),
	(3, 16),
	(3, 17),
	(3, 18),
	(3, 19),
	(3, 20),
	(3, 21),
	(3, 22),
	(3, 23),
	(3, 24),
	(3, 25),
	(3, 26),
	(3, 27),
	(3, 28),
	(3, 29),
	(3, 33),
	(3, 34),
	(3, 35),
	(3, 36),
	(3, 37),
	(4, 14),
	(4, 15),
	(4, 16),
	(4, 17),
	(4, 18),
	(4, 19),
	(4, 20),
	(4, 21),
	(4, 22),
	(4, 23),
	(4, 30),
	(4, 32);
/*!40000 ALTER TABLE `role_url` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.urls
DROP TABLE IF EXISTS `urls`;
CREATE TABLE IF NOT EXISTS `urls` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `http_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pattern` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.urls: ~24 rows (approximately)
/*!40000 ALTER TABLE `urls` DISABLE KEYS */;
INSERT IGNORE INTO `urls` (`id`, `description`, `http_method`, `pattern`) VALUES
	(14, 'Login page', 'GET', '/login'),
	(15, 'Login processing', 'POST', '/login'),
	(16, 'Logout', 'POST', '/logout'),
	(17, 'User Dashboard', 'GET', '/dashboard'),
	(18, 'Products Page', 'GET', '/products'),
	(19, 'Home Page', 'GET', '/'),
	(20, 'CSS resources', 'GET', '/css/**'),
	(21, 'JavaScript resources', 'GET', '/js/**'),
	(22, 'WebJars resources', 'GET', '/webjars/**'),
	(23, 'Image resources', 'GET', '/images/**'),
	(24, 'Admin Dashboard', 'GET', '/admin/**'),
	(25, 'Admin Users Management', 'GET', '/admin/users/**'),
	(26, 'Admin Products Management', 'GET', '/admin/products/**'),
	(27, 'Admin Categories Management', 'GET', '/admin/categories/**'),
	(28, 'Api Categories Management', 'GET', '/api/categories/**'),
	(29, 'Api Admin Management', 'GET', '/admin/api/**'),
	(30, 'Client Products Management', 'GET', '/client/products/**'),
	(31, 'Api Client Management', 'GET', '/client/api/**'),
	(32, 'Client Carts Management', 'GET', '/client/cart/**'),
	(33, 'Client Checkout', 'GET', '/checkout'),
	(34, 'Api Order Management', 'GET', '/api/orders/**'),
	(35, 'Api Order Client Management', 'GET', '/orders/**'),
	(36, 'Api Admin Management', 'GET', '/api/admin/**'),
	(37, 'Api Admin Management', 'PUT', '/api/admin/orders/**');
/*!40000 ALTER TABLE `urls` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enabled` bit(1) NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ROLE_ADMIN','ROLE_USER') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.users: ~2 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT IGNORE INTO `users` (`id`, `email`, `enabled`, `full_name`, `password`, `role`, `username`) VALUES
	(3, 'admin@email.com', b'1', 'Administrator', '$2a$10$kN14YPnGXQlgR1oIYhOhlO1/RlvYbfnN2j2D/E76.mIleKVhsweyS', NULL, 'admin'),
	(4, 'user@email.com', b'1', 'Regular User', '$2a$10$w6JSDLmqg1QbazTv9cLJuuweBNBFuvIlQ0v4AuNb9hyZn4hfyMW1y', NULL, 'user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.user_role
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE IF NOT EXISTS `user_role` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKt7e7djp752sqn6w22i6ocqy6q` (`role_id`),
  CONSTRAINT `FKj345gk1bovqvfame88rcx7yyx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKt7e7djp752sqn6w22i6ocqy6q` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.user_role: ~2 rows (approximately)
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES
	(3, 3),
	(4, 4);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
