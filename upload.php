<?php
    error_reporting(0);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://www.edscode.com");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['email']) || !isset($data['slideshow'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing parameters"]);
    exit;
}

$email = preg_replace("/[^a-zA-Z0-9@._-]/", "", $data['email']);
$slideshow = preg_replace("/[^a-zA-Z0-9_-]/", "", $data['slideshow']);
$newUser = $data['newUser'];
$myUserIndex = $data['myUserIndex'];
$action = $data['action'];
$public = $data['public'];
$myAbout = $data['about'];
$myWebsite = $data['website'];

$dateActive = $data['dateActive'];
if ($public == "true" && !$dateActive) {
  $dateActive = date('Y-m-d H:i:s');
} else {
    $dateActive = "";
}


$dir = __DIR__ . "/$slideshow";
if ($action != "update") {
    if (file_exists($dir)) {
        echo json_encode(["error" => "That slideshow already exists."]);
        exit;
    }
    // create directory
    mkdir($dir, 0775, true);
    mkdir("$dir/media", 0775, true);
}
// create slideshow config.json
$configData = [
    "title" => $data['title'] ?? $slideshow,
    "description" => $data['description'] ?? "",
    "theme" => $data['theme'] ?? "default",
    "email" => $email,
    "created" => date('Y-m-d H:i:s'),
    "folder" => $data["slideshow"] ??   $slideshow,
    "dateActive" => $dateActive,
    "website" => $myWebsite,
    "about" => $myAbout
];
file_put_contents("$dir/config.json", json_encode($configData, JSON_PRETTY_PRINT));
if ($action != "update") {
  // create redirect index.html
  $indexHTML = <<<HTML
  <!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv="refresh" content="0; url=/startslideshow.html?ProjName=$slideshow">
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Redirecting to slideshow...</p>
  </body>
  </html>
  HTML;
  file_put_contents("$dir/index.html", $indexHTML);

  // update global edscode-config.json
  $mainFile = __DIR__ . "/edscode-config-public.json";
  $main = file_exists($mainFile) ? json_decode(file_get_contents($mainFile), true) : ["users" => []];
  if ($newUser == "true") {
    $newFoldersArray = [$data["slideshow"]];
    $newEntry = [
        "email" => $email,
        "updated" => date('Y-m-d H:i:s'),
        "slideshowFoldersArray" => $newFoldersArray,
        "website" => $data["website"],
        "about" => $data["about"]

    ];
    $main["users"][] = $newEntry;
    $myUserIndex = count($main["users"]) -1;
  } else {
    $main['users'][$myUserIndex]['slideshowFoldersArray'][] = $slideshow;
  }

  file_put_contents($mainFile, json_encode($main, JSON_PRETTY_PRINT));

  echo json_encode(["success" => true, "created" => $slideshow, "userIndex" => $myUserIndex]);
} else {
  echo json_encode(["success" => true, "updated" => $slideshow, "userIndex" => $myUserIndex]);

}
?>