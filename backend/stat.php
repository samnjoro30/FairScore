<?php
session_start();
require_once '../config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(401);
    die(json_encode(['error' => 'Unauthorized']));
}

try {
    $db = new Database();
    $conn = $db->connect();

    // Fetch judge count
    $judgeCount = $conn->query("SELECT COUNT(*) as count FROM judges")->fetch_assoc()['count'];
    
    // Fetch participant count
    $participantCount = $conn->query("SELECT COUNT(*) as count FROM participants")->fetch_assoc()['count'];
    
    // Calculate accuracy (example query - adjust based on your business logic)
    $accuracyResult = $conn->query("
        SELECT (COUNT(CASE WHEN status = 'completed' THEN 1 END) / COUNT(*)) * 100 as accuracy 
        FROM evaluations
    ")->fetch_assoc();
    $accuracy = round($accuracyResult['accuracy'] ?? 0, 2);

    echo json_encode([
        'success' => true,
        'data' => [
            'judges' => $judgeCount,
            'participants' => $participantCount,
            'accuracy' => $accuracy
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}