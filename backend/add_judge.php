<?php
header('Content-Type: application/json');

// Include your config file
require_once 'config.php';

// Initialize response array
$response = ['success' => false, 'message' => ''];

try {
    // Check if the request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Get and sanitize input data
    $full_name = trim($_POST['judgeName'] ?? '');
    $email = trim($_POST['judgeEmail'] ?? '');
    $phone = trim($_POST['judgePhone'] ?? '');
    $password = $_POST['judgePassword'] ?? '';
    $judge_id = trim($_POST['judgeUsername'] ?? '');

    // Validate required fields
    if (empty($full_name) || empty($email) || empty($password) || empty($judge_id)) {
        throw new Exception('All required fields must be filled');
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Prepare SQL statement
    $stmt = $conn->prepare("INSERT INTO judges (full_name, email, phone, password, judge_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $full_name, $email, $phone, $hashed_password, $judge_id);

    // Execute the statement
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Judge registered successfully!';
    } else {
        // Check for duplicate entry
        if ($stmt->errno === 1062) {
            throw new Exception('Email or Judge ID already exists');
        }
        throw new Exception('Registration failed: ' . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
} finally {
    $conn->close();
    echo json_encode($response);
}
?>