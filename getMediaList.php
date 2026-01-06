<?php
$baseDir = __DIR__ . '/';
/*
if (!isset($_GET['project'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing project"]);
    exit;
}
*/
// Sanitize project name
$project = preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['project']);
$filePath = $baseDir . $project . '/mediaList.json';

if (!file_exists($filePath)) {
    echo json_encode($filePath); // empty list if none found
}

echo json_encode(file_get_contents($filePath));
?>

