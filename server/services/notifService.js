const dotenv = require('dotenv');
dotenv.config({ quiet: true });
const webpush = require('web-push');
const nodemailer = require('nodemailer');

// 1. Web Push Config (Generate keys via 'npx web-push generate-vapid-keys')
// If keys don't exist in env, push notifications will be skipped with a warning
if (process.env.PUBLIC_VAPID_KEY && process.env.PRIVATE_VAPID_KEY) {
  webpush.setVapidDetails(
    'mailto:monimedph@gmail.com',
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
  );
}

// 2. Email Config (Guardian Alerts)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

/**
 * Send push notification to user device
 * @param {Object} subscription - Push subscription object from users.push_subscription
 * @param {string} medName - Medicine name
 * @param {string} type - Notification type: 'due_now' or 'upcoming'
 */
const sendPushToUser = async (subscription, medName, type) => {
  try {
    if (!process.env.PUBLIC_VAPID_KEY || !process.env.PRIVATE_VAPID_KEY) {
      console.warn('Web Push disabled: VAPID keys not configured');
      return;
    }

    const payload = JSON.stringify({
      title: type === 'due_now' ? '💊 Medication Due Now!' : '⏰ Upcoming Dose',
      body: `Time to take your ${medName}.`,
      icon: '/icon-192x192.png',
      tag: `med-${medName}-${Date.now()}`,
    });

    await webpush.sendNotification(subscription, payload);
    console.log(`✓ Push sent for ${medName} (${type})`);
  } catch (error) {
    console.error(`✗ Push notification failed: ${error.message}`);
    // Don't throw; log and continue
  }
};

/**
 * Send email alert to guardian for missed medication
 * @param {Object} alert - Alert object from guardian_alerts_pending view with fields:
 *   - user_id, guardian_contact, guardian_name, medicine_name, scheduled_time
 */
const sendEmailToGuardian = async (alert) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Guardian email disabled: EMAIL_USER and EMAIL_PASS not configured');
      return;
    }

    // guardian_contact is phone or email; for now assume email format
    const to = alert.guardian_contact;
    const userName = alert.user_name || 'Patient';

    const mailOptions = {
      from: '"MoniMed Guardian Alert" <monimedph@gmail.com>',
      to: to,
      subject: `⚠️ Medication Alert: ${userName} missed a dose`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #d9534f;">Medication Missed Alert</h2>
          <p>Hello <strong>${alert.guardian_name}</strong>,</p>
          <p>We noticed that <strong>${userName}</strong> has not taken their medication:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #d9534f; margin: 20px 0;">
            <p><strong>Medicine:</strong> ${alert.medicine_name}</p>
            <p><strong>Scheduled Time:</strong> ${alert.scheduled_time}</p>
            <p><strong>Status:</strong> Missed (1+ hour late)</p>
          </div>
          <p>Please check on them or contact them to ensure they take their medication.</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated alert from MoniMed. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Guardian email sent to ${alert.guardian_name} (${to})`);
  } catch (error) {
    console.error(`✗ Guardian email failed: ${error.message}`);
    // Don't throw; log and continue
  }
};

module.exports = { sendPushToUser, sendEmailToGuardian };