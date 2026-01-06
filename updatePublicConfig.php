
<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://www.edscode.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['email']) || !isset($data['folder'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing parameters"]);
    exit;
}

$email = preg_replace("/[^a-zA-Z0-9@._-]/", "", $data['email']);
$folder = preg_replace("/[^a-zA-Z0-9_-]/", "", $data['folder']);
$myUserIndex = $data['myUserIndex'];



// update global edscode-config.json
$mainFile = __DIR__ . "/edscode-config-public.json";
$config = file_exists($mainFile) ? json_decode(file_get_contents($mainFile), true) : ["users" => []];
// Decode JSON into PHP array
//$config = json_decode($jsonString, true);

// Loop through users
foreach ($config['users'] as &$user) {
    // Only modify if key exists and is an array
    if (isset($user['slideshowFoldersArray']) && is_array($user['slideshowFoldersArray'])) {

        // Find the index of "Jokes"
        $index = array_search($folder, $user['slideshowFoldersArray']);

        // If found, remove it
        if ($index !== false) {
            unset($user['slideshowFoldersArray'][$index]);

            // Re-index array (optional but clean)
            $user['slideshowFoldersArray'] = array_values($user['slideshowFoldersArray']);
        }
    }
}

// Encode back to JSON
//$newJson = json_encode($config, JSON_PRETTY_PRINT);
file_put_contents($mainFile, json_encode($config, JSON_PRETTY_PRINT));
echo json_encode(["success" => true, "removed" => $folder]);

//echo $newJson;

?>
