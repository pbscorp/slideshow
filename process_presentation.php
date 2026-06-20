<?php
// process_transaction.php
header('Content-Type: application/json');
ob_clean();

// Load configuration
require_once '../edscode-config/slideshow.php';

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage());
    echo json_encode(['code' => 500, 'message' => 'Service temporarily unavailable']);
    exit;
}

// ... rest of your existing code (list, get, insert, update, delete) stays the same
$action = $_GET['action'] ?? '';

if ($action === 'list') {
    $stmt = $pdo->query("SELECT id, username, description FROM transactions ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($action === 'get' && isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM transactions WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC) ?: []);
    exit;
}

// === POST operations ===
$input = json_decode(file_get_contents('php://input'), true);
$operation = strtolower($input['operation'] ?? '');

try {
    switch ($operation) {
        case 'insert':
            
            $stmt = $pdo->prepare("INSERT INTO transactions 
                (username, description, trans_date, category, created_at)
                VALUES (?, ?, ?, ?, NOW())");
            $stmt->execute([
                trim($input['username'] ?? ''),
                trim($input['description'] ?? ''),
                $input['transDate'] ?? date('Y-m-d'),
                $input['category'] ?? null
            ]);

            echo json_encode(['code' => 200, 'message' => "user inserted successfully."]);
            break;

        case 'update':
            $id = $input['recordId'] ?? null;
            if (!$id) throw new Exception('Record ID required');

            $stmt = $pdo->prepare("UPDATE transactions SET 
                username = ?, description = ?, trans_date = ?, category = ?
                WHERE id = ?");
            $stmt->execute([
                trim($input['username'] ?? ''),
                trim($input['description'] ?? ''),
                $input['transDate'] ?? null,
                $input['category'] ?? null,
                $id
            ]);

            echo json_encode(['code' => 200, 'message' => 'Transaction updated successfully.']);
            break;

        case 'delete':
            $id = $input['recordId'] ?? null;
            if (!$id) throw new Exception('Record ID required');

            $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['code' => 200, 'message' => 'Transaction deleted successfully.']);
            break;

        default:
            echo json_encode(['code' => 400, 'message' => 'Invalid operation']);
    }
} catch (Exception $e) {
    echo json_encode(['code' => 500, 'message' => $e->getMessage()]);
}
?>