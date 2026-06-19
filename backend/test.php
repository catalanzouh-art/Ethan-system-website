<?php
require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: text/plain');

// 1. Check .env loading
echo "=== .env Check ===\n";
try {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    echo "SMTP_HOST: " . ($_ENV['SMTP_HOST'] ?? 'MISSING') . "\n";
    echo "SMTP_PORT: " . ($_ENV['SMTP_PORT'] ?? 'MISSING') . "\n";
    echo "SMTP_USER: " . ($_ENV['SMTP_USER'] ?? 'MISSING') . "\n";
    echo "SMTP_PASS: " . (isset($_ENV['SMTP_PASS']) ? '*** (set)' : 'MISSING') . "\n";
    echo "RECIPIENT: " . ($_ENV['RECIPIENT_EMAIL'] ?? 'MISSING') . "\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

// 2. Check SMTP connection
echo "\n=== SMTP Connection Test ===\n";
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug  = 2;
    $mail->Host       = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USER'];
    $mail->Password   = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = (int)($_ENV['SMTP_PORT'] ?? 587);

    $mail->setFrom($_ENV['SMTP_USER'], 'Test');
    $mail->addAddress($_ENV['RECIPIENT_EMAIL']);
    $mail->Subject = 'Test from Etta PHP';
    $mail->Body    = 'SMTP test';
    $mail->isHTML(false);
    $mail->send();
    echo "\nSUCCESS: Email sent!\n";
} catch (Exception $e) {
    echo "\nFAILED: " . $e->getMessage() . "\n";
    echo "Mailer error: " . $mail->ErrorInfo . "\n";
}
