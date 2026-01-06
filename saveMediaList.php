
<?php
$baseDir = __DIR__ . '/';

// Read and decode input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['project'], $input['list'])) {
    http_response_code(400);
    echo "Missing project or list";
    exit;
}

// Sanitize project name to prevent directory traversal
$project = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['project']);
$projectDir = $baseDir . $project . '/';

// Ensure project directory exists
if (!is_dir($projectDir)) {
    mkdir($projectDir, 0755, true);
}

$filePath = $projectDir . 'mediaList.json';

// Save list as formatted JSON
if (file_put_contents($filePath, json_encode($input['list'], JSON_PRETTY_PRINT)) !== false) {
    echo "List saved successfully to project: {$project}";
} else {
    http_response_code(500);
    echo "Failed to save list";
}
?>