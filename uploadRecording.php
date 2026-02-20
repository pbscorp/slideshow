<?php
$targetDirectory = $_GET['folder'] . "/media/";
if ($_GET['filename'] != "temp") {
    $fileName = $_GET['filename']. ".m4a";
} else {
    $fileName = $_GET['filename'] . time() . ".m4a";
}
if (isset($_FILES['audioFile'])) {
   // $fileName = "audio_" . time() . ".webm";
    $targetFile = $targetDirectory . $fileName;

    if (move_uploaded_file($_FILES['audioFile']['tmp_name'], $targetFile)) {
        echo "Success: File saved as: " . $targetFile;
    } else {
        echo "Error: Unable to save file.";
    }
} else {
    echo "No file received.";
}
?>
