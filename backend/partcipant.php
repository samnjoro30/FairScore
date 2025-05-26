<?php
header('Content-Type: application/json');
require_once 'config.php';

$response = ['success' => false, 'message' => ''];

try {
    // Only accept POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests allowed', 405);
    }

    // Get JSON input
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data', 400);
    }

    // Validate required fields
    $required = ['full_name', 'email', 'participant_id'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field", 400);
        }
    }

    // Sanitize and validate
    $full_name = trim($data['full_name']);
    $email = trim($data['email']);
    $phone = trim($data['phone'] ?? '');
    $participant_id = trim($data['participant_id']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format', 400);
    }

    // Database operation
    $stmt = $conn->prepare("INSERT INTO participants (full_name, email, phone, participant_id) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception('Database preparation failed', 500);
    }

    $stmt->bind_param("ssss", $full_name, $email, $phone, $participant_id);
    
    if ($stmt->execute()) {
        $response = [
            'success' => true,
            'message' => 'Participant registered successfully',
            'data' => [
                'participant_id' => $participant_id,
                'full_name' => $full_name
            ]
        ];
    } else {
        if ($conn->errno === 1062) {
            throw new Exception('Participant ID already exists', 409);
        }
        throw new Exception('Database error: ' . $stmt->error, 500);
    }

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
    
    echo json_encode($response);
    exit;
}