<?php
declare(strict_types=1);
ob_start();
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Catch fatal errors and return JSON
register_shutdown_function(function () {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_clean();
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Server error: ' . $err['message']]);
    }
});

try {
    require __DIR__ . '/vendor/autoload.php';

    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
} catch (\Throwable $e) {
    ob_clean();
    http_response_code(500);
    header('Content-Type: application/json');
    error_log('contact.php boot error: ' . $e->getMessage());
    echo json_encode(['error' => 'Config error: ' . $e->getMessage()]);
    exit;
}

// ── CORS ───────────────────────────────────────────────────
$allowedOrigin = $_ENV['ALLOWED_ORIGIN'] ?? '*';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_clean();
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_clean();
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

// ── Parse JSON body ────────────────────────────────────────
$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    ob_clean();
    http_response_code(400);
    error_log('contact.php: invalid JSON — raw input: ' . substr($raw, 0, 200));
    echo json_encode(['error' => 'Invalid JSON.']);
    exit;
}

$name    = trim((string) ($body['name']    ?? ''));
$email   = trim((string) ($body['email']   ?? ''));
$company = trim((string) ($body['company'] ?? ''));
$phone   = trim((string) ($body['phone']   ?? ''));
$subject = trim((string) ($body['subject'] ?? ''));
$message = trim((string) ($body['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    ob_clean();
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and message are required.']);
    exit;
}

// ── Subject labels ─────────────────────────────────────────
$subjectLabels = [
    'products'    => 'Products Inquiry',
    'services'    => 'Services Inquiry',
    'gmp'         => 'GMP Inquiry',
    'partnership' => 'Partnership',
    'validation'  => 'Validation',
    'other'       => 'General Inquiry',
];
$subjectLabel = $subjectLabels[$subject] ?? 'New Message';

// ── Shared constants ───────────────────────────────────────
$BASE        = 'https://www.ettasystems.com';
$LOGO        = $BASE . '/images/logo.png';
$BANNER      = $BASE . '/images/mockup-banner.png';
$TEAL        = '#16B5A6';
$DARK        = '#0f2d4a';
$now         = date('d M Y, H:i') . ' UTC';
$msgPreview  = mb_substr($message, 0, 200) . (mb_strlen($message) > 200 ? '…' : '');

// ── Reusable email wrapper ─────────────────────────────────
function emailWrap(string $header, string $body, string $footer): string
{
    return '<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

      <!-- HEADER -->
      ' . $header . '

      <!-- BODY -->
      <tr><td style="padding:36px 40px 28px;">
        ' . $body . '
      </td></tr>

      <!-- FOOTER -->
      ' . $footer . '

    </table>
  </td></tr>
</table>
</body></html>';
}

function emailFooter(): string
{
    $TEAL = '#16B5A6';
    $BASE = 'https://www.ettasystems.com';
    return '
      <tr>
        <td style="background:#0f2d4a;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 10px;color:rgba(255,255,255,.55);font-size:12px;letter-spacing:.5px;text-transform:uppercase;">Etta Systems</p>
          <p style="margin:0 0 14px;color:rgba(255,255,255,.7);font-size:13px;">Damascus, Syria &nbsp;&bull;&nbsp;
            <a href="' . $BASE . '" style="color:' . $TEAL . ';text-decoration:none;">ettasystems.com</a>
          </p>
          <p style="margin:0;color:rgba(255,255,255,.35);font-size:11px;">&copy; ' . date('Y') . ' Etta Systems. All rights reserved.</p>
        </td>
      </tr>';
}

// ── Email to company (internal notification) ───────────────
$companyInfoRows = '
  <tr style="border-bottom:1px solid #f1f5f9;">
    <td style="padding:12px 16px;color:#64748b;font-size:13px;width:110px;white-space:nowrap;">Full Name</td>
    <td style="padding:12px 16px;color:#0f2d4a;font-weight:700;font-size:14px;">' . htmlspecialchars($name) . '</td>
  </tr>
  <tr style="border-bottom:1px solid #f1f5f9;">
    <td style="padding:12px 16px;color:#64748b;font-size:13px;">Email</td>
    <td style="padding:12px 16px;font-size:14px;"><a href="mailto:' . htmlspecialchars($email) . '" style="color:' . $TEAL . ';text-decoration:none;font-weight:600;">' . htmlspecialchars($email) . '</a></td>
  </tr>';
if ($company !== '') {
    $companyInfoRows .= '
  <tr style="border-bottom:1px solid #f1f5f9;">
    <td style="padding:12px 16px;color:#64748b;font-size:13px;">Company</td>
    <td style="padding:12px 16px;color:#0f2d4a;font-size:14px;">' . htmlspecialchars($company) . '</td>
  </tr>';
}
if ($phone !== '') {
    $companyInfoRows .= '
  <tr style="border-bottom:1px solid #f1f5f9;">
    <td style="padding:12px 16px;color:#64748b;font-size:13px;">Phone</td>
    <td style="padding:12px 16px;color:#0f2d4a;font-size:14px;">' . htmlspecialchars($phone) . '</td>
  </tr>';
}
$companyInfoRows .= '
  <tr>
    <td style="padding:12px 16px;color:#64748b;font-size:13px;">Subject</td>
    <td style="padding:12px 16px;">
      <span style="background:#e0f9f6;color:' . $TEAL . ';font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:.3px;">' . htmlspecialchars($subjectLabel) . '</span>
    </td>
  </tr>';

$htmlToCompany = emailWrap(
    // header
    '<tr>
      <td style="background:' . $DARK . ';padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:22px 32px;">
              <img src="' . $LOGO . '" alt="Etta Systems" style="height:36px;display:block;" />
            </td>
            <td style="padding:22px 32px;text-align:right;">
              <span style="background:rgba(22,181,166,.18);color:' . $TEAL . ';font-size:11px;font-weight:700;letter-spacing:.8px;padding:5px 12px;border-radius:20px;text-transform:uppercase;">New Inquiry</span>
            </td>
          </tr>
        </table>
        <img src="' . $BANNER . '" alt="" width="600" style="display:block;width:100%;height:180px;object-fit:cover;object-position:center;" />
      </td>
    </tr>',
    // body
    '<h2 style="margin:0 0 6px;color:' . $DARK . ';font-size:22px;">New Contact Form Submission</h2>
    <p style="margin:0 0 28px;color:#64748b;font-size:13px;">Received on ' . $now . '</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:28px;">
      ' . $companyInfoRows . '
    </table>

    <h3 style="margin:0 0 12px;color:' . $DARK . ';font-size:15px;font-weight:700;">Message</h3>
    <div style="background:#f8fafc;border-left:4px solid ' . $TEAL . ';border-radius:0 8px 8px 0;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;color:#334155;font-size:14px;line-height:1.8;white-space:pre-wrap;">' . htmlspecialchars($message) . '</p>
    </div>

    <table cellpadding="0" cellspacing="0"><tr>
      <td style="background:' . $TEAL . ';border-radius:6px;">
        <a href="mailto:' . htmlspecialchars($email) . '" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:.3px;">Reply to ' . htmlspecialchars($name) . '</a>
      </td>
    </tr></table>',
    // footer
    emailFooter()
);

// ── Email to sender (auto-reply) ───────────────────────────
$htmlToSender = emailWrap(
    // header
    '<tr>
      <td style="background:' . $DARK . ';padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:22px 32px 22px;">
              <img src="' . $LOGO . '" alt="Etta Systems" style="height:36px;display:block;" />
            </td>
          </tr>
        </table>
        <img src="' . $BANNER . '" alt="Etta Systems" width="600" style="display:block;width:100%;height:200px;object-fit:cover;object-position:center;" />
      </td>
    </tr>',
    // body
    '<h2 style="margin:0 0 10px;color:' . $DARK . ';font-size:22px;">Thank you, ' . htmlspecialchars($name) . '!</h2>
    <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.7;">
      We have received your message and our team will get back to you within <strong style="color:' . $DARK . ';">24 business hours</strong>.
    </p>

    <div style="background:#f0fdfb;border:1px solid #b2efe9;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 6px;color:' . $TEAL . ';font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;">Your message</p>
      <p style="margin:0;color:#334155;font-size:14px;line-height:1.7;font-style:italic;">&ldquo;' . htmlspecialchars($msgPreview) . '&rdquo;</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:28px;">
      <tr style="background:#f8fafc;">
        <td colspan="3" style="padding:12px 16px;color:#64748b;font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;border-bottom:1px solid #e2e8f0;">What happens next?</td>
      </tr>
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:14px 16px;width:36px;text-align:center;">
          <span style="background:' . $TEAL . ';color:#fff;font-size:12px;font-weight:700;width:24px;height:24px;border-radius:50%;display:inline-block;line-height:24px;text-align:center;">1</span>
        </td>
        <td style="padding:14px 8px 14px 0;color:#334155;font-size:13px;">Our team reviews your inquiry</td>
      </tr>
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:14px 16px;text-align:center;">
          <span style="background:' . $TEAL . ';color:#fff;font-size:12px;font-weight:700;width:24px;height:24px;border-radius:50%;display:inline-block;line-height:24px;text-align:center;">2</span>
        </td>
        <td style="padding:14px 8px 14px 0;color:#334155;font-size:13px;">A specialist is assigned to your case</td>
      </tr>
      <tr>
        <td style="padding:14px 16px;text-align:center;">
          <span style="background:' . $TEAL . ';color:#fff;font-size:12px;font-weight:700;width:24px;height:24px;border-radius:50%;display:inline-block;line-height:24px;text-align:center;">3</span>
        </td>
        <td style="padding:14px 8px 14px 0;color:#334155;font-size:13px;">You receive a detailed reply within 24 hours</td>
      </tr>
    </table>

    <p style="margin:0 0 20px;color:#64748b;font-size:13px;line-height:1.6;">
      Need urgent assistance? Contact us directly:<br>
      <span style="color:#0f2d4a;font-weight:600;">+963 933525517</span>
    </p>

    <table cellpadding="0" cellspacing="0"><tr>
      <td style="background:' . $DARK . ';border-radius:6px;">
        <a href="https://www.ettasystems.com" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:.3px;">Visit Our Website</a>
      </td>
    </tr></table>',
    // footer
    emailFooter()
);

// ── Send via PHPMailer ─────────────────────────────────────
function makeMailer(): \PHPMailer\PHPMailer\PHPMailer
{
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USER'];
    $mail->Password   = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = filter_var($_ENV['SMTP_SECURE'] ?? 'false', FILTER_VALIDATE_BOOLEAN)
        ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = (int) ($_ENV['SMTP_PORT'] ?? 587);
    $mail->CharSet    = 'UTF-8';
    $mail->isHTML(true);
    return $mail;
}

try {
    $mail = makeMailer();
    $mail->setFrom($_ENV['SMTP_USER'], $name);
    $mail->addReplyTo($email, $name);
    $mail->addAddress($_ENV['RECIPIENT_EMAIL']);
    $mail->Subject = '[Etta Systems] ' . $subjectLabel . ' — ' . $name;
    $mail->Body    = $htmlToCompany;
    $mail->send();

    $mail2 = makeMailer();
    $mail2->setFrom($_ENV['SMTP_USER'], 'Etta Systems');
    $mail2->addAddress($email, $name);
    $mail2->Subject = 'We received your message — Etta Systems';
    $mail2->Body    = $htmlToSender;
    $mail2->send();

    ob_clean();
    echo json_encode(['success' => true]);
} catch (\Throwable $e) {
    ob_clean();
    error_log('contact.php mail error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
