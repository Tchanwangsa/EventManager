<?php

$sname= "localhost";
$uname= "root";
$password = "";
$port = 3307;

$db_name = "event-manager";

$conn = mysqli_connect($sname, $uname, $password, $db_name, $port);

if (!$conn) {
	echo "Connection failed!";
}
