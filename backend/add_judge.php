<?php
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get input from POST
    $fullName = $_POST['judgeName'] ?? '';
    $email = $_POST['judgeEmail'] ?? '';
    $phone = $_POST['judgePhone'] ?? '';
    $password = $_POST['judgePassword'] ?? '';
    $judgeID = $_POST['judgeUsername'] ?? '';

    // Validate required fields
    if (empty($fullName) || empty($email) || empty($password) || empty($judgeID)) {
        die("Please fill in all required fields.");
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert into DB
    try {
        $stmt = $pdo->prepare("INSERT INTO judges (full_name, email, phone, password, judge_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$fullName, $email, $phone, $hashedPassword, $judgeID]);
        echo "Judge successfully registered.";
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo "Error: Duplicate email or Judge ID.";
        } else {
            echo "Error: " . $e->getMessage();
        }
    }
} else {
    echo "Invalid request method.";
}
?>