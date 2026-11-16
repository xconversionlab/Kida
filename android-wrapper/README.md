# Kida Android customer app

This folder contains the Capacitor Android wrapper used to produce an installable APK for the existing Kida customer booking experience.

- Android application ID: `com.xconversionlab.kida`
- Display name: `Kida`
- Native runtime: Capacitor 8
- Build output: `android/app/build/outputs/apk/debug/app-debug.apk`

## Important runtime detail

The current Kida customer experience is a web-backed prototype. The APK opens the deployed Kida customer application inside the Android WebView, so the phone needs an internet connection. The APK is installable, but the current booking OTP, driver assignment, live ride movement, call/SMS handling and payment screens retain the prototype limitations documented in `../KIDA_PROJECT_GOAL.md`. This wrapper does not turn demo services into production integrations.

## Build

The GitHub Actions workflow `.github/workflows/build-kida-apk.yml` installs the Capacitor toolchain, generates the Android project, builds a debug-signed APK and uploads it as the `kida-customer-debug-apk` workflow artifact.

The debug APK is suitable for client testing and sideloading. A production Play Store release requires a separately managed signing key and completed production service integrations.
