<?php
include('../includes/config.php');
$id = $_GET['id'];
$votes = $_GET['votes'];
$query="update posts set votes='$votes' where id='$id'";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);
// $affected = $mysqli->affected_rows;
?>