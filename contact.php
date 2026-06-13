<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://ettasystems.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$name    = htmlspecialchars(trim($input['name']    ?? ''), ENT_QUOTES, 'UTF-8');
$email   = filter_var(trim($input['email']   ?? ''), FILTER_SANITIZE_EMAIL);
$company = htmlspecialchars(trim($input['company'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars(trim($input['phone']   ?? ''), ENT_QUOTES, 'UTF-8');
$subject = htmlspecialchars(trim($input['subject'] ?? ''), ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(trim($input['message'] ?? ''), ENT_QUOTES, 'UTF-8');

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

$to      = 'ncatalan@ettasystems.com';
$subjectLine = 'New Contact Form Message' . ($subject ? " — {$subject}" : '');

$body  = "Name:    {$name}\r\n";
$body .= "Email:   {$email}\r\n";
$body .= "Company: {$company}\r\n";
$body .= "Phone:   {$phone}\r\n";
$body .= "Subject: {$subject}\r\n";
$body .= "\r\nMessage:\r\n{$message}\r\n";

$headers  = "From: ETTA Systems Website <no-reply@ettasystems.com>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subjectLine, $body, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Mail send failed']);
}
