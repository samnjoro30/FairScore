<?php
header('Content-Type: application/json');
include 'config.php'; // Include DB connection

$sql = "SELECT participant_id, AVG(score) AS average_score
        FROM scores
        GROUP BY participant_id
        ORDER BY average_score DESC";

$result = $conn->query($sql);

$data = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    $data = ['message' => 'No scores found'];
}

echo json_encode($data);
$conn->close();
?>
