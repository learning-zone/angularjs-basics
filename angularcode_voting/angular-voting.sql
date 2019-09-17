CREATE DATABASE IF NOT EXISTS angularcode_voting;
 
USE angularcode_voting;


-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) NOT NULL,
  `description` varchar(500) NOT NULL,
  `url` varchar(200) NOT NULL,
  `votes` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `description`, `url`, `votes`) VALUES
(1, 'A simple AngularJS web app that converts text to url format', 'We are going to create a very simple yet powerful web app using AngularJS from Google. Our app will take any input and will convert it into URL format instantly. We will be creating a filter named clean. We can use this filter anywhere in our application like following piece of code', 'http://angularcode.com/a-simple-angularjs-web-app-that-converts-text-to-url-format/', 0),
(2, 'How to create a facebook style autocomplete using AngularJS', 'This tutorial explains how to show autocomplete results for a textbox input using AngularJS, PHP and MySQL with the help of Angular UI directive.', 'http://angularcode.com/how-to-create-a-facebook-style-autocomplete-using-angularjs/', -2),
(3, 'Simple task manager application using AngularJS PHP MySQL', 'This tutorial explains how to create a simple Task Manager application using AngularJS. Here I used PHP for server side communication and MySQL for database.', 'http://angularcode.com/simple-task-manager-application-using-angularjs-php-mysql/', 1),
(4, 'Connecting PHP to Oracle Database 10g', 'PHP is very well compatible with MySQL. But I found connecting PHP to Oracle is a pain. In my current job, my employer uses Oracle Version 10g. It uses an oracle server and an oracle client 10g software to connect to the server. I tried several ways to connect to the oracle database server using PHP.', 'http://angularcode.com/connecting-php-to-oracle-database-10g/', 5);
