package com.aigestion.frontend;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

/**
 * 🌌 NEXUS Main Activity — God Level
 *
 * Edge-to-edge immersive experience with deep link routing,
 * notification channel creation, and Tasker integration.
 */
public class MainActivity extends BridgeActivity {

    private static final String TAG = "NexusMain";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 🐛 Debug WebView (disabled in production via BuildConfig)
        WebView.setWebContentsDebuggingEnabled(true);

        // 🌌 Edge-to-edge immersive mode
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // 🔔 Create notification channels
        createNotificationChannels();

        // 🔗 Handle deep link if launched from one
        handleDeepLink(getIntent());

        Log.i(TAG, "🌌 NEXUS God Mode initialized");
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleDeepLink(intent);
    }

    /**
     * Routes deep links to the WebView via Capacitor bridge.
     * Supports: nexus://dashboard, nexus://daniela, nexus://economy, etc.
     */
    private void handleDeepLink(Intent intent) {
        if (intent == null) return;

        Uri data = intent.getData();
        if (data == null) return;

        String scheme = data.getScheme();
        if (scheme == null) return;

        String route = "/";

        if ("nexus".equals(scheme)) {
            // nexus://dashboard → /dashboard
            String host = data.getHost();
            if (host != null) {
                route = "/" + host;
                String path = data.getPath();
                if (path != null && !path.isEmpty()) {
                    route += path;
                }
            }
        } else if ("https".equals(scheme)) {
            // https://aigestion.net/dashboard → /dashboard
            String path = data.getPath();
            if (path != null && !path.isEmpty()) {
                route = path;
            }
        }

        Log.i(TAG, "🔗 Deep link → " + route);

        // Forward to WebView via Capacitor bridge
        final String jsRoute = route;
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().post(() -> {
                String js = "window.location.hash = '" + jsRoute.replace("'", "\\'") + "'; " +
                           "window.dispatchEvent(new CustomEvent('nexus:deeplink', { detail: { route: '" +
                           jsRoute.replace("'", "\\'") + "' }}));";
                getBridge().eval(js, null);
            });
        }
    }

    /**
     * Creates sovereign notification channels for Android O+
     */
    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationManager mgr = getSystemService(NotificationManager.class);
        if (mgr == null) return;

        // Skip if already created
        if (mgr.getNotificationChannel(NexusFirebaseMessagingService.CH_DANIELA) != null) return;

        NotificationChannel daniela = new NotificationChannel(
                NexusFirebaseMessagingService.CH_DANIELA, "💜 Daniela",
                NotificationManager.IMPORTANCE_HIGH);
        daniela.setDescription("Mensajes de Daniela AI");
        daniela.enableVibration(true);
        daniela.setVibrationPattern(new long[]{0, 200, 100, 200});

        NotificationChannel economy = new NotificationChannel(
                NexusFirebaseMessagingService.CH_ECONOMY, "📈 Economy",
                NotificationManager.IMPORTANCE_DEFAULT);
        economy.setDescription("Market & economy alerts");

        NotificationChannel system = new NotificationChannel(
                NexusFirebaseMessagingService.CH_SYSTEM, "⚠️ System",
                NotificationManager.IMPORTANCE_HIGH);
        system.setDescription("System events & alerts");
        system.enableVibration(true);

        NotificationChannel calls = new NotificationChannel(
                NexusFirebaseMessagingService.CH_CALLS, "📞 Calls",
                NotificationManager.IMPORTANCE_MAX);
        calls.setDescription("Voice call notifications");
        calls.enableVibration(true);
        calls.setVibrationPattern(new long[]{0, 500, 250, 500, 250, 500});

        NotificationChannel defaultCh = new NotificationChannel(
                NexusFirebaseMessagingService.CH_DEFAULT, "🌌 General",
                NotificationManager.IMPORTANCE_DEFAULT);
        defaultCh.setDescription("General NEXUS notifications");

        mgr.createNotificationChannel(daniela);
        mgr.createNotificationChannel(economy);
        mgr.createNotificationChannel(system);
        mgr.createNotificationChannel(calls);
        mgr.createNotificationChannel(defaultCh);

        Log.i(TAG, "🔔 5 notification channels created");
    }
}
