<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

require_once 'config.php';

$response = [];

try {
    if (!isset($_GET['judge_id'])) {
        throw new Exception('Judge ID is required');
    }

    $judgeId = trim($_GET['judge_id']);

    $stmt = $conn->prepare("
        SELECT 
            p.full_name,
            s.score,
            s.created_at
        FROM scores s
        JOIN participants p ON s.participant_id = p.participant_id
        WHERE s.judge_id = ?
        ORDER BY s.created_at DESC
    ");
    $stmt->bind_param("s", $judgeId);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conn->close();
}
