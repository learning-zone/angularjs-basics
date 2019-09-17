<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/users', 'getUsers');
$app->post('/users', 'addUser');

$app->get('/users/:id',	'getUser');
$app->get('/users/search/:query', 'findByName');
$app->put('/users/:id', 'updateUser');
$app->delete('/users/:id', 'deleteUser');

$app->run();

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="root";
	$dbname="angular-mysql";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

function getUsers() {
	$sql = "select * FROM users ORDER BY id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getUser($id) {
	$sql = "SELECT * FROM users WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$user = $stmt->fetchObject();  
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addUser() {
	error_log('addUser\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$user = json_decode($request->getBody());
	$sql = "INSERT INTO users (firstname, lastname, email, company) VALUES (:firstname, :lastname, :email, :company)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("firstname", $user->firstname);
		$stmt->bindParam("lastname", $user->lastname);
		$stmt->bindParam("email", $user->email);
		$stmt->bindParam("company", $user->company);
		$stmt->execute();
		$user->id = $db->lastInsertId();
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateUser($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$user = json_decode($body);
	$sql = "UPDATE users SET firstname=:firstname, lastname=:lastname, email=:email, company=:company WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("firstname", $user->firstname);
		$stmt->bindParam("lastname", $user->lastname);
		$stmt->bindParam("email", $user->email);
		$stmt->bindParam("company", $user->company);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteUser($id) {
	$sql = "DELETE FROM users WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM users WHERE UPPER(firstname) LIKE :query ORDER BY firstname";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"user": ' . json_encode($users) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

?>