<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $folderPath = $_POST['folderPath'] ?? '';

    // Security: prevent deleting outside allowed base directory
    $baseDir = realpath(__DIR__ . '/');
    $targetDir = realpath($folderPath);
    if ($targetDir && strpos($targetDir, $baseDir) === 0 && is_dir($targetDir)) {
        deleteDirectory($targetDir);
        echo "success: php Folder deleted successfully";
    		//echo json_encode(['success' => true, 'message' => 'php Folder deleted successfully']);        
    } else {
        echo "failed: php Invalid folder path or access denied";
    		//echo json_encode(['success' => false, 'message' => 'php Invalid folder path or access denied']);                
    }
}

function deleteDirectory($dir) {
    $items = array_diff(scandir($dir), ['.', '..']);
    foreach ($items as $item) {
        $path = "$dir/$item";
        is_dir($path) ? deleteDirectory($path) : unlink($path);
    }
    rmdir($dir);
}
?>