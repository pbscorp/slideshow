// Example: Modern PDO Connection (2026)
$host = '127.0.0.1:3306';
$db   = 'slideshow';
$user = 'root';
$pass = 'Mpatrick#1';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // Log the error internally and show a generic message to the user
     error_log($e->getMessage());
     die("A technical error occurred. Please try again later.");
}
