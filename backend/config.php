<?php
// config.php
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'Fair_score';

// Create MySQLi connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$default_username = "ADM1234";
$default_password = "@Admin254";