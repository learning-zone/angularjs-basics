/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Version : 50525
 Source Host           : localhost
 Source Database       : angular-mysql

 Target Server Version : 50525
 File Encoding         : utf-8

 Date: 09/15/2013 16:44:29 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `company` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `users`
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('1', 'John', 'Henry', 'john.henry@acme.com', 'Acme Industries'), ('2', 'Mary', 'Smith', 'mary.smith@ibm.com', 'IBM'), ('3', 'George', 'Reynolds', 'george@microsoft.com', 'Microsoft'), ('4', 'Joanne', 'Klum', 'jo.klum@bauhaus.de', 'Bauhaus');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
