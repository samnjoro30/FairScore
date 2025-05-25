<?php
header('Content-Type: application/json');
require_once 'config.php';

$response = ['success' => false, 'data' => [], 'message' => ''];

try {
    $query = "SELECT id, full_name, email, phone, judge_id, DATE_FORMAT(created_at, '%b %d, %Y %h:%i %p') as created_at FROM judges ORDER BY created_at DESC";
    $result = $conn->query($query);

    if ($result) {
        $response['success'] = true;
        while ($row = $result->fetch_assoc()) {
            $response['data'][] = $row;
        }
    } else {
        throw new Exception('Failed to fetch judges: ' . $conn->error);
    }
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
} finally {
    $conn->close();
    echo json_encode($response);
}
?>