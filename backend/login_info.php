<?php
session_start();
header('Content-Type: application/json');

// Check if the judge is logged in
if (!isset($_SESSION['judge_logged_in']) || !$_SESSION['judge_logged_in']) {
    echo json_encode([
        'success' => false,
        'error' => 'Not logged in'
    ]);
    exit();
}

$response = [
    'success' => true,
    'judge_name' => $_SESSION['judge_name'] ?? 'Judge',
    'judge_email' => $_SESSION['judge_email'] ?? '',
    'last_login' => isset($_SESSION['last_login']) ? date('Y-m-d H:i:s', $_SESSION['last_login']) : ''
];

echo json_encode($response);
?>
