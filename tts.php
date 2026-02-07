<?php
// Force errors to show for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Enable logging


ini_set('log_errors', 1);
ini_set('error_log', 'tmp/php-tts-errors.log'); // creates a log file you can tail

// Allow JSON requests from browser
header('Content-Type: application/json');

// Basic CORS (adjust for your domain in production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


// Read JSON body
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['text']) || trim($input['text']) === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing text']);
    exit;
}

$text = $input['text'];
$folder = $input['folder'];
$recordKey = $input['recordKey'];
$voice = $input['defaultPresenter'];

// Load API key from environment or config
$apiKey = getenv('INWORLD_API_KEY');  // set this in your hosting env panel

// load config from file
$config = require '../edscode-config/inworld.php';
$apiKey = $config['INWORLD_API_KEY'] ?? null;

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'INWORLD_API_KEY not configured']);
    
    exit;
}

$url = 'https://api.inworld.ai/tts/v1/voice';

$payload = [
    'text' => $text,
    'voice_id' => $voice,
    'audio_config' => [
        'audio_encoding' => 'MP3',
        'speaking_rate' => 1,
    ],
    'temperature' => 1.1,
    'model_id' => 'inworld-tts-1-max',
];

$headers = [
    'Authorization: Basic ' . $apiKey,
    'Content-Type: application/json',
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false) {
    $error = curl_error($ch);
    curl_close($ch);
    http_response_code(500);
    echo json_encode(['error' => 'cURL error: ' . $error]);
    exit;
}

curl_close($ch);

// If Inworld returned an error status
if ($httpCode < 200 || $httpCode >= 300) {
    http_response_code($httpCode);
    echo $response; // or a simpler error message
    exit;
}

// Forward JSON result (includes audioContent base64)
$result = json_decode($response, true);
if (!isset($result['audioContent'])) {
    http_response_code(500);
    echo json_encode(['error' => 'No audioContent in response']);
    exit;
}
$audioContent = $result['audioContent'];
$audioBuffer = base64_decode($audioContent);

file_put_contents("$folder/media/$recordKey.mp3", $audioBuffer);

echo json_encode([
    'audioContent' => $result['audioContent'],
]);
