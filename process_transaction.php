<?php
header('Content-Type: application/json');
ob_clean();

$host = 'localhost';
$db   = 'slideshow';
$user = 'root';
$pass = 'Mpatrick#1';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['code' => 500, 'message' => 'DB connection failed']);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'list') {
    $stmt = $pdo->query("SELECT id, trans_code, username, description FROM transactions ORDER BY created_at DESC");
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
            $transCode = !empty($input['transCode']) ? trim($input['transCode']) : 'TXN-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
            
            $stmt = $pdo->prepare("INSERT INTO transactions 
                (trans_code, username, description, trans_date, category, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())");
            $stmt->execute([
                $transCode,
                trim($input['username'] ?? ''),
                trim($input['description'] ?? ''),
                $input['transDate'] ?? date('Y-m-d'),
                $input['category'] ?? null
            ]);

            echo json_encode(['code' => 200, 'message' => "Transaction $transCode inserted successfully."]);
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