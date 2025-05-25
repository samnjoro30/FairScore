<?php
session_start();
ob_start();

session_start();
require_once 'config.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set JSON headers
header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die(json_encode(['success' => false, 'error' => 'Method not allowed']));
}

// Get and sanitize input
$username = trim($conn->real_escape_string($_POST['username'] ?? ''));
$password = $_POST['password'] ?? '';

// Validate input
if (empty($username) || empty($password)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Username and password are required']));
}

try {
    // Prepare statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT username, password, Name, Email, last_login FROM admin_users WHERE username = ?");
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Regenerate session ID to prevent fixation
            session_regenerate_id(true);
            
            // Set session variables
            $_SESSION = [
                'admin_logged_in' => true,
                'username' => $user['username'],
                'name' => $user['Name'],
                'email' => $user['Email'],
                'last_login' => time(),
                'db_last_login' => $user['last_login']
            ];
            
            // Update last login time
            $update_stmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE username = ?");
            $update_stmt->bind_param("s", $username);
            $update_stmt->execute();
            
            // Success response
            echo json_encode([
                'success' => true,
                'user' => [
                    'name' => $user['Name'],
                    'email' => $user['Email']
                ],
                'redirect' => 'index.html'
            ]);
            exit();
        }
    }
    
    // Generic error message to prevent user enumeration
    throw new Exception('Invalid credentials');
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    exit();
}