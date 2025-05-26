<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

$response = ['success' => false, 'error' => null];

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON input');
    }

    if (!$input) {
        throw new Exception('No input data received');
    }

    $required = ['judge_id', 'participant_id', 'score'];
    foreach ($required as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    $judgeId = trim($input['judge_id']); // No (int) cast
    $participantId = trim($input['participant_id']); // No (int) cast
    $score = $input['score'];

    if (empty($judgeId)) {
        throw new Exception('Invalid Judge ID');
    }
    if (empty($participantId)) {
        throw new Exception('Invalid Participant ID');
    }

    if (!is_numeric($score)) {
        throw new Exception('Score must be numeric');
    }

    $score = (int)$score;
    if ($score < 0 || $score > 10) {
        throw new Exception('Score must be between 0 and 10');
    }
    
    $dbScore = $score; // Store score as-is (no *10)
    

    // Verify participant exists
    $checkParticipant = $conn->prepare("SELECT id FROM participants WHERE participant_id = ?");
    $checkParticipant->bind_param("s", $participantId);
    $checkParticipant->execute();
    if (!$checkParticipant->get_result()->num_rows) {
        throw new Exception('Participant does not exist');
    }

    // Verify judge exists
    $checkJudge = $conn->prepare("SELECT id FROM judges WHERE id = ?");
    $checkJudge->bind_param("s", $judgeId);
    $checkJudge->execute();
    if (!$checkJudge->get_result()->num_rows) {
        throw new Exception('Judge does not exist');
    }

    // Check if score exists
    $checkQuery = "SELECT id FROM scores WHERE judge_id = ? AND participant_id = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $judgeId, $participantId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        throw new Exception('Score has already been submitted and cannot be changed');
    
    } else {
        // Insert new score
        $insertQuery = "INSERT INTO scores (judge_id, participant_id, score) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param("ssi", $judgeId, $participantId, $dbScore);
    }

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        throw new Exception('Database operation failed: ' . $conn->error);
    }

} catch (Exception $e) {
    http_response_code(400);
    $response['error'] = $e->getMessage();
} finally {
    if (isset($conn)) $conn->close();
    echo json_encode($response);
}
