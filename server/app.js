const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ quiet: true });

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1']);

const supabase = require('./database/supabase');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.get('/ping', async (req,res) => {
  return res.status(200).send('OK');
});
app.use('/server/example', require('./routes/example'));
app.use('/server/user', require('./routes/userRoutes'));
app.use('/server/auth', require('./routes/auth'));
app.use('/server/prescription', require('./routes/prescription'));
app.use('/server/medicine', require('./routes/medicine'));
app.use('/server/schedule', require('./routes/schedule'));
app.use('/server/vitals', require('./routes/vitals'));
app.use('/server/log', require('./routes/log'));
app.use('/server/ocr', require('./routes/ocrRoutes'));
app.use('/server/notifications', require('./routes/notificationRoutes'));

let cron;
try {
  cron = require('node-cron');
} catch (e) {
  console.warn('node-cron not installed. Notification scheduling disabled.');
}

const { sendPushToUser, sendEmailToGuardian } = require('./services/notifService');

// In-memory tracking of sent notifications (cleared daily)
const notificationState = {
  pushSent: new Set(), // schedule_id -> sent today
  emailSent: new Set(), // schedule_id -> sent today
  lastClear: new Date(),
};

// Reset tracking at midnight UTC
function resetNotificationTracking() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setUTCHours(24, 0, 0, 0);
  const msUntilMidnight = nextMidnight - now;
  
  setTimeout(() => {
    notificationState.pushSent.clear();
    notificationState.emailSent.clear();
    notificationState.lastClear = new Date();
    console.log('✓ Daily notification tracking reset');
    resetNotificationTracking(); // reschedule for next midnight
  }, msUntilMidnight);
}

// Start the daily reset
resetNotificationTracking();

// Heartbeat runs every minute
if (cron) {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('--- MoniMed Watchdog Cycle Started ---');

      // TASK 1: Device Push Notifications (Tray)
      // Uses the 'upcoming_notifications' view
      const { data: pushTasks, error: pushError } = await supabase
        .from('upcoming_notifications')
        .select('*');

      if (pushError) {
        console.error('Error fetching upcoming notifications:', pushError);
      } else {
        pushTasks?.forEach(task => {
          // Send only if not already sent today
          if (task.push_subscription && !notificationState.pushSent.has(task.schedule_id)) {
            sendPushToUser(task.push_subscription, task.medicine_name, task.notification_type);
            notificationState.pushSent.add(task.schedule_id);
            console.log(`✓ Push queued for schedule ${task.schedule_id}`);
          }
        });
      }

      // TASK 2: Guardian Escalation (Email)
      // Uses the 'guardian_alerts_pending' view (1+ hour late)
      const { data: emailAlerts, error: emailError } = await supabase
        .from('guardian_alerts_pending')
        .select('*');

      if (emailError) {
        console.error('Error fetching guardian alerts:', emailError);
      } else {
        emailAlerts?.forEach(alert => {
          // Send only if not already sent today
          if (!notificationState.emailSent.has(alert.schedule_id)) {
            sendEmailToGuardian(alert);
            notificationState.emailSent.add(alert.schedule_id);
            console.log(`✓ Email queued for schedule ${alert.schedule_id}: ${alert.medicine_name}`);
          }
        });
      }
    } catch (error) {
      console.error('Watchdog cycle error:', error.message);
    }
  });
} else {
  console.info('Cron scheduling disabled: node-cron not available');
}

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/dist')));
	app.get('/*redir', function(req, res) {
		res.sendFile(path.join(__dirname, '../client/dist/index.html'));
	});
} else {
	console.log(process.env.NODE_ENV);
}
app.listen(process.env.PORT, function() {
	console.log(process.env.PORT);
});
