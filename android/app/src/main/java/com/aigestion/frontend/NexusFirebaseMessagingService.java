package com.aigestion.frontend;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.media.AudioAttributes;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * 🌌 NEXUS Firebase Messaging Service — God Level Push Handler
 *
 * Handles incoming FCM messages with sovereign notification channels,
 * Tasker intent forwarding, and deep link support.
 */
public class NexusFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "NexusFCM";

    // Notification Channels
    public static final String CH_DANIELA = "nexus_daniela";
    public static final String CH_ECONOMY = "nexus_economy";
    public static final String CH_SYSTEM  = "nexus_system";
    public static final String CH_CALLS   = "nexus_calls";
    public static final String CH_DEFAULT = "nexus_default";

    // Backend registration endpoint
    private static final String REGISTER_URL = "https://aigestion.net/api/v1/push/register";

    // Tasker broadcast action
    private static final String TASKER_ACTION = "com.aigestion.NEXUS_PUSH";

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        Log.i(TAG, "🔑 New FCM token received");

        // Register with backend
        new Thread(() -> registerTokenWithBackend(token)).start();

        // Forward to Tasker
        Intent taskerIntent = new Intent(TASKER_ACTION);
        taskerIntent.putExtra("event", "token_refresh");
        taskerIntent.putExtra("fcm_token", token);
        sendBroadcast(taskerIntent);
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);
        Log.i(TAG, "🌌 Push received from: " + message.getFrom());

        Map<String, String> data = message.getData();
        String channel = data.getOrDefault("channel", CH_DEFAULT);
        String title = data.getOrDefault("title", "NEXUS");
        String body = data.getOrDefault("body", "");
        String deepLink = data.getOrDefault("deepLink", "nexus://dashboard");

        // Forward ALL push data to Tasker
        forwardToTasker(data);

        // Build and show notification
        showNotification(channel, title, body, deepLink, data);
    }

    private void showNotification(String channel, String title, String body,
                                   String deepLink, Map<String, String> data) {
        ensureChannels();

        // Deep link intent
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(android.net.Uri.parse(deepLink));
        intent.setPackage(getPackageName());
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, (int) System.currentTimeMillis(), intent,
                PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE
        );

        // Sovereign notification style
        int icon = getSmallIcon(channel);
        int color = getSovereignColor(channel);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channel)
                .setSmallIcon(icon)
                .setColor(color)
                .setContentTitle(title)
                .setContentText(body)
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .setPriority(getPriority(channel))
                .setCategory(NotificationCompat.CATEGORY_MESSAGE);

        // Expanded style for long messages
        if (body.length() > 50) {
            builder.setStyle(new NotificationCompat.BigTextStyle().bigText(body));
        }

        // Call channel: full-screen intent for heads-up
        if (CH_CALLS.equals(channel)) {
            builder.setFullScreenIntent(pendingIntent, true);
            builder.setCategory(NotificationCompat.CATEGORY_CALL);
        }

        // Daniela: add reply action
        if (CH_DANIELA.equals(channel)) {
            builder.setCategory(NotificationCompat.CATEGORY_MESSAGE);
        }

        NotificationManager mgr = getSystemService(NotificationManager.class);
        if (mgr != null) {
            mgr.notify((int) System.currentTimeMillis(), builder.build());
        }
    }

    private void forwardToTasker(Map<String, String> data) {
        Intent taskerIntent = new Intent(TASKER_ACTION);
        for (Map.Entry<String, String> entry : data.entrySet()) {
            taskerIntent.putExtra(entry.getKey(), entry.getValue());
        }
        sendBroadcast(taskerIntent);
    }

    private void ensureChannels() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationManager mgr = getSystemService(NotificationManager.class);
        if (mgr == null) return;

        // Skip if already created
        if (mgr.getNotificationChannel(CH_DANIELA) != null) return;

        AudioAttributes soundAttrs = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();

        NotificationChannel daniela = new NotificationChannel(CH_DANIELA, "Daniela", NotificationManager.IMPORTANCE_HIGH);
        daniela.setDescription("💜 Mensajes de Daniela");
        daniela.enableVibration(true);
        daniela.setVibrationPattern(new long[]{0, 200, 100, 200});
        daniela.setSound(android.provider.Settings.System.DEFAULT_NOTIFICATION_URI, soundAttrs);

        NotificationChannel economy = new NotificationChannel(CH_ECONOMY, "Economy Alerts", NotificationManager.IMPORTANCE_DEFAULT);
        economy.setDescription("📈 Market & economy notifications");
        economy.enableVibration(true);

        NotificationChannel system = new NotificationChannel(CH_SYSTEM, "System", NotificationManager.IMPORTANCE_HIGH);
        system.setDescription("⚠️ System events & alerts");
        system.enableVibration(true);
        system.setVibrationPattern(new long[]{0, 300, 200, 300});

        NotificationChannel calls = new NotificationChannel(CH_CALLS, "Calls", NotificationManager.IMPORTANCE_MAX);
        calls.setDescription("📞 Voice call notifications");
        calls.enableVibration(true);
        calls.setVibrationPattern(new long[]{0, 500, 250, 500, 250, 500});

        NotificationChannel defaultCh = new NotificationChannel(CH_DEFAULT, "General", NotificationManager.IMPORTANCE_DEFAULT);
        defaultCh.setDescription("🌌 General NEXUS notifications");

        mgr.createNotificationChannel(daniela);
        mgr.createNotificationChannel(economy);
        mgr.createNotificationChannel(system);
        mgr.createNotificationChannel(calls);
        mgr.createNotificationChannel(defaultCh);

        Log.i(TAG, "🔔 Notification channels created");
    }

    private int getSmallIcon(String channel) {
        // Use default app icon; can be replaced with per-channel icons later
        return android.R.drawable.ic_dialog_info;
    }

    private int getSovereignColor(String channel) {
        switch (channel) {
            case CH_DANIELA: return 0xFF9333EA; // Purple
            case CH_ECONOMY: return 0xFFF59E0B; // Gold
            case CH_SYSTEM:  return 0xFFEF4444; // Red
            case CH_CALLS:   return 0xFF3B82F6; // Blue
            default:         return 0xFF8B5CF6; // Accent purple
        }
    }

    private int getPriority(String channel) {
        switch (channel) {
            case CH_CALLS:   return NotificationCompat.PRIORITY_MAX;
            case CH_DANIELA:
            case CH_SYSTEM:  return NotificationCompat.PRIORITY_HIGH;
            default:         return NotificationCompat.PRIORITY_DEFAULT;
        }
    }

    private void registerTokenWithBackend(String token) {
        try {
            URL url = new URL(REGISTER_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String json = "{\"fcmToken\":\"" + token + "\"}";
            try (OutputStream os = conn.getOutputStream()) {
                os.write(json.getBytes(StandardCharsets.UTF_8));
            }

            int code = conn.getResponseCode();
            Log.i(TAG, "🔑 Token registration: HTTP " + code);
            conn.disconnect();
        } catch (Exception e) {
            Log.e(TAG, "🔑 Token registration failed", e);
        }
    }
}
