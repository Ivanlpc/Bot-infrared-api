
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discord_ID` bigint(255) NOT NULL,
  `user_tag` varchar(255) NOT NULL,
  `rank` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `users` WRITE;

UNLOCK TABLES;

