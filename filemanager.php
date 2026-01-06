<?php
header("Access-Control-Allow-Origin: https://www.edscode.com");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$base = __DIR__ . '/';
$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$old_filename = $_GET['oldFile'] ?? ($_POST['oldFile'] ?? '');
$new_filename = $_GET['newFile'] ?? ($_POST['newFile'] ?? '');
switch ($action) {

  // 📝 Get or update text.txt
  case 'gettext':
    $proj = basename($_GET['proj']);
    $file = $base . "$proj/text.txt";
    echo file_exists($file) ? file_get_contents($file) : "";
    break;

  case 'savetext':
    $proj = basename($_POST['proj']);
    $text = $_POST['text'] ?? '';
    file_put_contents($base . "$proj/text.txt", $text);
    echo "saved";
    break;

  case 'upload':
    $proj = basename($_GET['proj'] ?? $_POST['proj'] ?? '');
    $targetDir = $base . "$proj/media/";
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0775, true);
    }
    if (!isset($_FILES['files'])) {
      echo "no file data received";
      exit;
    }

    $responses = [];
    foreach ($_FILES['files']['name'] as $i => $file) {
      //$name = str_ireplace(".mov", ".mp4", $file);
      $name = $file;
      $tmp = $_FILES['files']['tmp_name'][$i];
      $error = $_FILES['files']['error'][$i];
      if ($error === UPLOAD_ERR_OK && is_uploaded_file($tmp)) {
        $dest = $targetDir . basename($name);
        if (move_uploaded_file($tmp, $dest)) {
          $responses[] = "$name uploaded";
        } else {
          $responses[] = "$name move failed";
        }
      } else {
        $responses[] = "$name error code: $error";
      }
    }
    echo implode("\n", $responses);
    break;


  // ❌ rename

  case 'rename':
    $proj = basename($_GET['proj'] ?? $_POST['proj'] ?? '');
    $targetDir = $base . "$proj/media/";
    $old_file = $targetDir . $old_filename;
    $new_file = $targetDir . $new_filename;
    if (file_exists($new_file)) {
      echo "Error: '$new_filename' Already exists";
      break;
    } 
    if (file_exists($old_file)) {
      if (rename($old_file, $new_file)) {
          echo "File renamed successfully from '$old_file' to '$new_file'.";
      } else {
          echo "Error renaming the file.";
      }
    } else {
      echo "File '$old_file' does not exist.";
    }
  break;



  
  // ❌ Delete media file
  case 'delete':
    $proj = basename($_GET['proj']);
    $filename = basename($_GET['file']);
    $path = $base . "$proj/media/$filename";
    if (file_exists($path)) {
      unlink($path);
      echo "deleted";
    } else echo "not found";
    break;
//
  // 📄 List media
  case 'list':
    $proj = basename($_GET['proj']);
    $dir = $base . "$proj/media/";
    $files = [];

    if (file_exists($dir)) {
      foreach (scandir($dir) as $f) {
        if ($f === "." || $f === "..") continue;
        $files[] = $f;
      }
    }
    echo json_encode($files);
    break;

  default:
    echo "invalid action";
}
?>