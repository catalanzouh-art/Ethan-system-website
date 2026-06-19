<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://ettasystems.com');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$file = __DIR__ . '/visits.txt';

$count = 0;
if (file_exists($file)) {
    $count = (int)file_get_contents($file);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $count++;
    file_put_contents($file, $count, LOCK_EX);
}

echo json_encode(['count' => $count]);
