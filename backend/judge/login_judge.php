<?php
session_start();
require_once 'config.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Start output buffering
ob_start();

// Set JSON headers
header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die(json_encode(['success' => false, 'error' => 'Method not allowed']));
}

// Get and sanitize input
$email = trim($conn->real_escape_string($_POST['email'] ?? ''));
$judge_id = trim($conn->real_escape_string($_POST['judge_id'] ?? ''));

// Validate input
if (empty($email) || empty($judge_id)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Email and username are required']));
}

try {
    // Check database connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed');
    }

    // Prepare statement
    $stmt = $conn->prepare("SELECT id, judge_id, email, full_name, status FROM judges WHERE email = ? AND username = ?");
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    
    $stmt->bind_param("ss", $email, $username);
    
    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $judge = $result->fetch_assoc();
        
        // Check if judge account is active
        if ($judge['status'] !== 'active') {
            http_response_code(403);
            die(json_encode(['success' => false, 'error' => 'Your account is not active']));
        }
        
        // Regenerate session ID
        session_regenerate_id(true);
        
        // Set session variables
        $_SESSION = [
            'judge_logged_in' => true,
            'judge_id' => $judge['id'],
            'judge_username' => $judge['username'],
            'judge_email' => $judge['email'],
            'judge_name' => $judge['full_name'],
            'last_login' => time()
        ];
        
        // Update last login time
        $update_stmt = $conn->prepare("UPDATE judges SET last_login = NOW() WHERE id = ?");
        $update_stmt->bind_param("i", $judge['id']);
        $update_stmt->execute();
        
        echo json_encode([
            'success' => true,
            'user' => [
                'name' => $judge['full_name'],
                'email' => $judge['email']
            ],
            'redirect' => 'dashboard.html'
        ]);
        exit();
    }
    
    throw new Exception('Invalid email or username');
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    ob_end_flush();
}