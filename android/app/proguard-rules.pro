# 🌌 NEXUS ProGuard Rules — God Level

# ========================================
# Capacitor / WebView JS Interface
# ========================================
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface

# Keep Capacitor bridge classes
-keep class com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**

# ========================================
# Firebase
# ========================================
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Firebase Messaging Service
-keep class com.aigestion.frontend.NexusFirebaseMessagingService { *; }

# ========================================
# AndroidX
# ========================================
-keep class androidx.** { *; }
-dontwarn androidx.**

# Biometric
-keep class androidx.biometric.** { *; }

# ========================================
# Debugging (keep for stack traces)
# ========================================
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ========================================
# General
# ========================================
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

# Prevent stripping of Parcelable
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Prevent stripping of Serializable
-keepnames class * implements java.io.Serializable
