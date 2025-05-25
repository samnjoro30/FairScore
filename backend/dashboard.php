<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized']));
}

try {
    // Get all admin data we need
    $stmt = $conn->prepare("SELECT Name, Email, last_login FROM admin_users WHERE username = ?");
    $stmt->bind_param("s", $_SESSION['username']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'data' => [
                'name' => $admin['Name'],
                'email' => $admin['Email'],
                'last_login' => date('F j, Y, g:i a', strtotime($admin['last_login']))
            ]
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Admin not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}