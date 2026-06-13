<?php
// process_transaction.php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['transCode']) || empty($input['operation'])) {
    http_response_code(400);
    echo json_encode(['code' => 400, 'message' => 'Transaction Code and Operation are required']);
    exit;
}

$operation = strtolower(trim($input['operation']));
$transCode = trim($input['transCode']);

// === SIMULATED VERSION (no real database needed for testing) ===
$response = match($operation) {
    'insert' => ['code' => 200, 'message' => "Transaction {$transCode} inserted successfully."],
    'update' => ['code' => 200, 'message' => "Transaction {$transCode} updated successfully."],
    'delete' => ['code' => 200, 'message' => "Transaction {$transCode} deleted successfully."],
    default  => ['code' => 400, 'message' => 'Invalid operation']
};

echo json_encode($response);
?>