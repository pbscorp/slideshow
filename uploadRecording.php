<?php
$targetDirectory = $_GET['folder'] . "/media/";
if (isset($_FILES['audioFile'])) {
   // $fileName = "audio_" . time() . ".webm";
    $fileName = "audio_" . time() . ".opus";
   
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
