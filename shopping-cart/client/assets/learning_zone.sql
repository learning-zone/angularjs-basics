-- MySQL dump 10.10
--
-- Host: localhost    Database: learning_zone
-- ------------------------------------------------------
-- Server version	5.0.13-rc-nt

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(200) NOT NULL,
  `address` text NOT NULL,
  `email` varchar(200) NOT NULL,
  `phone` varchar(20) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--


/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
LOCK TABLES `customer` WRITE;
INSERT INTO `customer` VALUES (11,'Alex','Jl. Ciwidey no 20','alex@yahoo.com','086454743743'),(12,'Amali','Jl. kemandoran no 10 Jakarta','amalia@langit.com','03937263623'),(13,'Angel ','Jl. Ciledug no 45A. tanggerang','angel@gmail.com','082271626121'),(14,'Ujang','Jl. ribut no 90 A','ujang@gmail.com','07846352532'),(15,'Memet','Blok cepu no 14. Bandung','memet@ongkek.com','038372636232'),(16,'Agung','Jl st Petersburg no 34. Russia','agung@yahoo.com','038373273262'),(17,'Jhon Taylor','St paris A . Block 43. paris','jtaylor@yahoo.com','039223232323');
UNLOCK TABLES;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(255) NOT NULL,
  `age` int(3) default NULL,
  `city` varchar(255) default NULL,
  `active` tinyint(1) NOT NULL default '0',
  `salary` double(10,2) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee`
--


/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
LOCK TABLES `employee` WRITE;
INSERT INTO `employee` VALUES (1,'Pradeep Kumar',25,'Ranchi',0,NULL),(2,'John K',35,'Las Vegas',0,NULL),(3,'Ryan Cook',15,'CA',0,NULL),(4,'Bharat Kumar',25,'Delhi',0,NULL),(5,'John K',35,'Bangalore',0,NULL),(6,'Ryan Cook',15,'CA',0,NULL),(7,'Bharat Kumar',25,'Mumbai',0,NULL),(8,'John K',35,'Las Vegas',0,NULL),(9,'Ryan Cook',15,'CA',0,NULL),(10,'Bharat Kumar',25,'Ranchi',0,NULL),(11,'John K',35,'Las Vegas',0,NULL),(12,'Ryan Cook',15,'CA',0,NULL),(13,'Bharat Kumar',25,'Mumbai',0,NULL),(14,'John K',35,'Las Vegas',0,NULL),(15,'Ryan Cook',15,'CA',0,NULL),(16,'Bharat Kumar',25,'Mumbai',0,NULL),(17,'John K',35,'Las Vegas',0,NULL),(18,'Ryan Cook',15,'CA',0,NULL),(19,'Bharat Kumar',25,'Mumbai',0,NULL);
UNLOCK TABLES;



--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) NOT NULL auto_increment,
  `from_user_id` varchar(45) default NULL,
  `to_user_id` varchar(45) default NULL,
  `message` text,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `message`
--


/*!40000 ALTER TABLE `message` DISABLE KEYS */;
LOCK TABLES `message` WRITE;
UNLOCK TABLES;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `username` varchar(10) NOT NULL,
  `password` varchar(20) NOT NULL,
  `online` enum('N','Y') NOT NULL,
  `socketid` varchar(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--


/*!40000 ALTER TABLE `user` DISABLE KEYS */;
LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'pradeep','pradeep','N',''),(2,'kumar','Kumar','N',''),(3,'admin','admin','N','');
UNLOCK TABLES;


