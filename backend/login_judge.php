<?php
session_start();
require_once 'config.php';

// Enable full error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verify database connection immediately
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'error' => 'Database connection failed',
        'debug' => $conn->connect_error ?? 'Connection object not found'
    ]));
}

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die(json_encode(['success' => false, 'error' => 'Method not allowed']));
}

// Get and sanitize input with thorough trimming
$email = trim($conn->real_escape_string($_POST['email'] ?? ''));
$judge_id = trim($conn->real_escape_string($_POST['judge_id'] ?? ''));

if (empty($email) || empty($judge_id)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Email and Judge ID are required']));
}

try {
    // DEBUG: Log the incoming values
    error_log("Login attempt - Email: '$email', Judge ID: '$judge_id'");

    // Case-insensitive email comparison, exact judge_id match
    $stmt = $conn->prepare("SELECT id, judge_id, email, full_name FROM judges WHERE LOWER(email) = LOWER(?) AND judge_id = ?");
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . $conn->error);
    }
    
    $stmt->bind_param("ss", $email, $judge_id);
    
    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    // DEBUG: Log number of matches
    error_log("Found matches: " . $result->num_rows);
    
    if ($result->num_rows === 1) {
        $judge = $result->fetch_assoc();
        
        // DEBUG: Log successful match
        error_log("Matched judge: " . print_r($judge, true));
        
        session_regenerate_id(true);
        
        $_SESSION = [
            'judge_logged_in' => true,
            'judge_id' => $judge['id'],
            'judge_email' => $judge['email'],
            'judge_name' => $judge['full_name'],
            'last_login' => time()
        ];
        
        // Update last login
        $update_stmt = $conn->prepare("UPDATE judges SET last_login = NOW() WHERE id = ?");
        $update_stmt->bind_param("i", $judge['id']);
        $update_stmt->execute();
        
        echo json_encode([
            'success' => true,
            'user' => $judge,
            'redirect' => 'dashboard.html'
        ]);
        exit();
    }
    
    // DEBUG: Show the exact query that failed
    throw new Exception("No matching judge found. Query: SELECT id, judge_id, email, full_name FROM judges WHERE LOWER(email) = LOWER('$email') AND judge_id = '$judge_id'");
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid credentials',
        'debug' => [
            'message' => $e->getMessage(),
            'input' => ['email' => $email, 'judge_id' => $judge_id]
        ]
    ]);
}