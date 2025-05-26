<?php
header('Content-Type: application/json');
require_once 'config.php';

$response = [];

try {

    $query = "SELECT full_name, email, phone, participant_id FROM participants ORDER BY created_at DESC";
    $result = $conn->query($query);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $participants = [];
    while ($row = $result->fetch_assoc()) {
        $participants[] = $row;
    }

    echo json_encode($participants);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}