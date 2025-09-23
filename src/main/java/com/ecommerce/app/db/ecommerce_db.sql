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
CREATE DATABASE IF NOT EXISTS `ecommerce_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `ecommerce_db`;

-- Dumping structure for table ecommerce_db.addresses
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` bit(1) NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zip_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1fa36y2oqhao3wgg2rw1pi459` (`user_id`),
  CONSTRAINT `FK1fa36y2oqhao3wgg2rw1pi459` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.addresses: ~4 rows (approximately)
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT IGNORE INTO `addresses` (`id`, `address_type`, `city`, `country`, `full_name`, `is_default`, `phone`, `state`, `street`, `zip_code`, `user_id`) VALUES
	(2, 'HOME', ' Hà Nội', 'Việt Nam', 'Nguyễn Chung Phong', b'1', '0354412060', '69', 'Ngõ 48A Thượng Phúc , Tả Thanh Oai , Thanh Trì , Hà Nội', '2000', 4),
	(3, 'WORK', 'Hà Nội', 'Việt Nam', 'Nguyễn Chung Phong', b'0', '0354412060', '69', 'Ngõ 48A Thượng Phúc , Tả Thanh Oai , Thanh Trì , Hà Nội', '2000', 4),
	(4, 'OTHER', 'Hà Nội', 'Việt Nam', 'Nguyễn Chung Phong', b'0', '0354412060', '69', 'Ngõ 48A Thượng Phúc , Tả Thanh Oai , Thanh Trì , Hà Nội', '2000', 4),
	(5, 'WORK', 'Hà Nội', 'Việt Nam', 'Nguyễn Chung Phong', b'0', '0354412060', 'Hà Nội', '115 Trần Duy Hưng', '2000', 4);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.carts
CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `updated_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.carts: ~2 rows (approximately)
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT IGNORE INTO `carts` (`id`, `user_id`, `created_date`, `updated_date`) VALUES
	(1, 4, '2025-09-20 08:56:09.000000', '2025-09-20 08:56:09.000000'),
	(2, 9, '2025-09-23 08:01:58.000000', '2025-09-23 08:01:58.000000');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.cart_items
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
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.cart_items: ~0 rows (approximately)
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.categories
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.orders: ~14 rows (approximately)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT IGNORE INTO `orders` (`id`, `customer_email`, `customer_name`, `customer_phone`, `order_date`, `order_number`, `payment_method`, `payment_status`, `shipping_address`, `status`, `total_amount`, `updated_date`, `user_id`, `notes`) VALUES
	(1, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-20 10:43:24.000000', 'ORD-1758365004806-542', 'COD', 'PAID', 'Thanh Trì', 'DELIVERED', 140000.00, '2025-09-20 14:38:42.000000', 4, 'Đang giao hàng đến >>\n'),
	(2, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-20 10:47:04.000000', 'ORD-1758365224809-247', 'COD', 'PENDING', 'Hà Nội', 'PROCESSING', 25000.00, '2025-09-20 14:18:59.000000', 4, NULL),
	(3, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-21 04:40:43.000000', 'ORD-1758429643624-848', 'COD', 'PENDING', '48', 'PENDING', 55000.00, '2025-09-21 04:40:43.000000', 4, NULL),
	(4, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-21 06:29:09.000000', 'ORD-1758436149911-194', 'BANK_TRANSFER', 'PENDING', '123123', 'PENDING', 30000.00, '2025-09-21 06:29:09.000000', 4, NULL),
	(5, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-21 06:31:43.000000', 'ORD-1758436303547-558', 'BANK_TRANSFER', 'PENDING', '48', 'PENDING', 85000.00, '2025-09-21 06:31:43.000000', 4, NULL),
	(6, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-21 07:04:33.000000', 'ORD-1758438273746-693', 'COD', 'PENDING', 'dq2321', 'PENDING', 85000.00, '2025-09-21 07:04:33.000000', 4, NULL),
	(7, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-21 07:09:54.000000', 'ORD-1758438594643-428', 'COD', 'PENDING', 'e12qwq', 'PENDING', 25000.00, '2025-09-21 07:09:54.000000', 4, NULL),
	(8, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-21 07:11:46.000000', 'ORD-1758438706966-933', 'COD', 'PENDING', '123123', 'PENDING', 85000.00, '2025-09-21 07:11:46.000000', 4, NULL),
	(9, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-21 09:10:39.000000', 'ORD-1758445839468-529', 'COD', 'PENDING', 'Ngõ 48A Thượng Phúc , Tả Thanh Oai , Thanh Trì , Hà Nội', 'PENDING', 25000.00, '2025-09-21 09:10:39.000000', 4, NULL),
	(10, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-22 16:01:44.000000', 'ORD-1758556904934-186', 'COD', 'PENDING', 'Ngõ 48A Thượng Phúc , Tả Thanh Oai , Thanh Trì , Hà Nội', 'PENDING', 105000.00, '2025-09-22 16:01:44.000000', 4, NULL),
	(11, '123@gmail.com', 'cccccccccccc', '123123', '2025-09-23 07:45:45.000000', 'ORD-1758613545350-436', 'COD', 'PENDING', '123123', 'PENDING', 170000.00, '2025-09-23 07:45:45.000000', 4, NULL),
	(12, '123@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-23 08:17:44.000000', 'ORD-1758615464432-979', 'COD', 'PENDING', '115 Trần Duy Hưng', 'PENDING', 85000.00, '2025-09-23 08:17:44.000000', 9, NULL),
	(13, '123@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-23 08:31:47.000000', 'ORD-1758616307171-360', 'COD', 'PENDING', '115 Trần Duy Hưng', 'PENDING', 170000.00, '2025-09-23 08:31:47.000000', 9, NULL),
	(14, 'phongnguyen1999.10.30@gmail.com', 'Nguyễn Chung Phong', '0354412060', '2025-09-23 16:24:43.000000', 'ORD-1758644683238-733', 'COD', 'PAID', 'Ngõ 48A Thượng Phúc , Tả Thanh Oai , Thanh Trì , Hà Nội', 'DELIVERED', 115000.00, '2025-09-23 16:25:16.000000', 4, '');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.order_items
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.order_items: ~32 rows (approximately)
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT IGNORE INTO `order_items` (`id`, `quantity`, `subtotal`, `unit_price`, `order_id`, `product_id`) VALUES
	(1, 2, 50000.00, 25000.00, 1, 6),
	(2, 2, 60000.00, 30000.00, 1, 7),
	(3, 1, 30000.00, 30000.00, 1, 8),
	(4, 1, 25000.00, 25000.00, 2, 6),
	(5, 1, 25000.00, 25000.00, 3, 6),
	(6, 1, 30000.00, 30000.00, 3, 7),
	(7, 1, 30000.00, 30000.00, 4, 7),
	(8, 1, 25000.00, 25000.00, 5, 6),
	(9, 1, 30000.00, 30000.00, 5, 7),
	(10, 1, 30000.00, 30000.00, 5, 8),
	(11, 1, 25000.00, 25000.00, 6, 6),
	(12, 1, 30000.00, 30000.00, 6, 7),
	(13, 1, 30000.00, 30000.00, 6, 8),
	(14, 1, 25000.00, 25000.00, 7, 6),
	(15, 1, 25000.00, 25000.00, 8, 6),
	(16, 1, 30000.00, 30000.00, 8, 7),
	(17, 1, 30000.00, 30000.00, 8, 8),
	(18, 1, 25000.00, 25000.00, 9, 6),
	(19, 1, 30000.00, 30000.00, 10, 13),
	(20, 3, 75000.00, 25000.00, 10, 6),
	(21, 2, 50000.00, 25000.00, 11, 6),
	(22, 2, 60000.00, 30000.00, 11, 7),
	(23, 2, 60000.00, 30000.00, 11, 8),
	(24, 1, 25000.00, 25000.00, 12, 6),
	(25, 1, 30000.00, 30000.00, 12, 7),
	(26, 1, 30000.00, 30000.00, 12, 8),
	(27, 2, 50000.00, 25000.00, 13, 6),
	(28, 2, 60000.00, 30000.00, 13, 7),
	(29, 2, 60000.00, 30000.00, 13, 8),
	(30, 1, 25000.00, 25000.00, 14, 6),
	(31, 2, 60000.00, 30000.00, 14, 7),
	(32, 1, 30000.00, 30000.00, 14, 8);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.products
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
CREATE TABLE IF NOT EXISTS `role_url` (
  `role_id` bigint(20) NOT NULL,
  `url_id` bigint(20) NOT NULL,
  PRIMARY KEY (`role_id`,`url_id`),
  KEY `FK59494iepe61dnpf7domwckk42` (`url_id`),
  CONSTRAINT `FK59494iepe61dnpf7domwckk42` FOREIGN KEY (`url_id`) REFERENCES `urls` (`id`),
  CONSTRAINT `FK5c2fwqwq32gj1wywe6j48plnv` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.role_url: ~43 rows (approximately)
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
	(3, 38),
	(3, 39),
	(3, 40),
	(3, 41),
	(3, 42),
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
	(4, 32),
	(4, 38),
	(4, 39),
	(4, 40),
	(4, 41),
	(4, 42);
/*!40000 ALTER TABLE `role_url` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.urls
CREATE TABLE IF NOT EXISTS `urls` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `http_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pattern` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.urls: ~29 rows (approximately)
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
	(37, 'Api Admin Management', 'PUT', '/api/admin/orders/**'),
	(38, 'Profile Manager', 'GET', '/profile'),
	(39, 'Adrresses Manager', 'GET', '/addresses'),
	(40, 'Api Profile Manger', 'GET', '/api/profile/**'),
	(41, 'Api Adresses Manger', 'GET', '/api/addresses/**'),
	(42, 'Api Profile Change Manger', 'GET', '/api/profile/change-password/**');
/*!40000 ALTER TABLE `urls` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.users
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.users: ~4 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT IGNORE INTO `users` (`id`, `email`, `enabled`, `full_name`, `password`, `role`, `username`) VALUES
	(3, 'admin@email.com', b'1', 'Administrator', '$2a$10$kN14YPnGXQlgR1oIYhOhlO1/RlvYbfnN2j2D/E76.mIleKVhsweyS', NULL, 'admin'),
	(4, 'user@email.com', b'1', 'Client User', '$2a$10$DCmlHJv1p8q.XVaFVjruYuLnJ8v21w6rLe8bnvPdNDtQ8NJMeYR2.', NULL, 'user'),
	(8, 'phongnguyen1999.10.30@gmail.com', b'1', 'Nguyễn Chung Phong', '$2a$10$/vPabnBs4Pe.3pjrZjEc1.09JEe2R87SImzFF3tp708aZoIEsWWB.', NULL, 'phongnc'),
	(9, 'phongnguyen19099.10.30@gmail.com', b'1', 'Trần Đăng Khoa', '$2a$10$S0pjq.oMpzvxGiW2ld82E.uqr7xkDzWSK5eFPmJv1Hug2FFYoDvQK', NULL, 'khoatd');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table ecommerce_db.user_role
CREATE TABLE IF NOT EXISTS `user_role` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKt7e7djp752sqn6w22i6ocqy6q` (`role_id`),
  CONSTRAINT `FKj345gk1bovqvfame88rcx7yyx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKt7e7djp752sqn6w22i6ocqy6q` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ecommerce_db.user_role: ~4 rows (approximately)
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES
	(3, 3),
	(4, 4),
	(8, 3),
	(9, 4);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
