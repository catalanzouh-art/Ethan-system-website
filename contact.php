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

/* ── 1. Internal notification to ETTA team ── */
$internalTo      = 'ncatalan@ettasystems.com';
$internalSubject = 'New Contact Form Message' . ($subject ? " — {$subject}" : '');

$internalBody  = "Name:    {$name}\r\n";
$internalBody .= "Email:   {$email}\r\n";
$internalBody .= "Company: {$company}\r\n";
$internalBody .= "Phone:   {$phone}\r\n";
$internalBody .= "Subject: {$subject}\r\n";
$internalBody .= "\r\nMessage:\r\n{$message}\r\n";

$internalHeaders  = "From: ETTA Systems Website <no-reply@ettasystems.com>\r\n";
$internalHeaders .= "Reply-To: {$name} <{$email}>\r\n";
$internalHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
$internalHeaders .= "X-Mailer: PHP/" . phpversion();

$sent = mail($internalTo, $internalSubject, $internalBody, $internalHeaders);

/* ── 2. Confirmation email to submitter ── */
$confirmSubject = 'We received your message — ETTA Systems';
$firstName = explode(' ', $name)[0];

$confirmHtml = '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Thank you — ETTA Systems</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fa;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

      <!-- Header -->
      <tr>
        <td style="background:#1a2a3a;padding:32px 40px;text-align:center;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:2px;">ETTA SYSTEMS</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 12px;font-size:26px;color:#1a2a3a;">Thank you, ' . $firstName . '!</h1>
          <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
            We have received your message and our team will get back to you within <strong>24 business hours</strong>.
          </p>

          <!-- Your message -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0faf9;border:1px solid #c8ede9;border-radius:8px;margin-bottom:28px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#16B5A6;letter-spacing:1.5px;text-transform:uppercase;">Your Message</p>
                <p style="margin:0;font-size:14px;color:#333;line-height:1.6;font-style:italic;">&ldquo;' . $message . '&rdquo;</p>
              </td>
            </tr>
          </table>

          <!-- What happens next -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8edf2;border-radius:8px;margin-bottom:28px;">
            <tr>
              <td style="padding:20px 24px;">
                <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#888;letter-spacing:1.5px;text-transform:uppercase;">What Happens Next?</p>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:14px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="width:32px;height:32px;background:#16B5A6;border-radius:50%;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:13px;font-weight:700;">1</span>
                        </td>
                        <td style="padding-left:14px;font-size:14px;color:#333;">Our team reviews your inquiry</td>
                      </tr></table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:14px;">
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="width:32px;height:32px;background:#16B5A6;border-radius:50%;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:13px;font-weight:700;">2</span>
                        </td>
                        <td style="padding-left:14px;font-size:14px;color:#333;">A specialist is assigned to your case</td>
                      </tr></table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table cellpadding="0" cellspacing="0"><tr>
                        <td style="width:32px;height:32px;background:#16B5A6;border-radius:50%;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:13px;font-weight:700;">3</span>
                        </td>
                        <td style="padding-left:14px;font-size:14px;color:#333;">You receive a detailed reply within 24 hours</td>
                      </tr></table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Urgent contact — phone only -->
          <p style="margin:0 0 8px;font-size:14px;color:#555;">Need urgent assistance? Contact us directly:</p>
          <p style="margin:0 0 24px;font-size:14px;">
            <a href="tel:+963933525517" style="color:#16B5A6;text-decoration:none;font-weight:600;">+963 933525517</a>
          </p>

          <!-- CTA button -->
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1a2a3a;border-radius:8px;">
                <a href="https://ettasystems.com/" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Visit Our Website</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#1a2a3a;padding:24px 40px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#ffffff;letter-spacing:2px;">ETTA SYSTEMS</p>
          <p style="margin:0 0 6px;font-size:12px;color:#8a9bb0;">Damascus, Syria &nbsp;&bull;&nbsp; <a href="https://ettasystems.com/" style="color:#16B5A6;text-decoration:none;">ettasystems.com</a></p>
          <p style="margin:0;font-size:11px;color:#6a7b8a;">&copy; 2026 Etta Systems. All rights reserved.</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>';

$confirmHeaders  = "From: ETTA Systems <no-reply@ettasystems.com>\r\n";
$confirmHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
$confirmHeaders .= "X-Mailer: PHP/" . phpversion();

mail($email, $confirmSubject, $confirmHtml, $confirmHeaders);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Mail send failed']);
}
