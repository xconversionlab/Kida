# Kida Captain Android app

This wrapper produces a separate Android installation for the Captain workspace.

- Android application ID: `com.xconversionlab.kida.captain`
- Display name: `Kida Captain`
- Native runtime: Capacitor 8
- Launch route: `/captain`
- Backend: same Kida database and authenticated booking APIs used by the customer application

## Runtime

The app loads the deployed Captain route from the Kida web application, so an internet connection is required. Captain accounts use the same Better Auth sign-in system as customers, but the server separately verifies the Captain role and administrator-approved Captain profile.

Location permission is needed while online. The first build tracks location while the app is open; guaranteed background tracking after the app is closed is not included.

## Build

GitHub Actions workflow `.github/workflows/build-kida-captain-apk.yml` builds a debug-signed APK and uploads it as `kida-captain-debug-apk`.

The debug APK is for internal/client testing and sideloading. Play Store release requires a separately managed signing key and production operational integrations.

## Download the latest test APK

1. Open the repository's **Actions** tab.
2. Select **Build Kida Captain APK**.
3. Open the newest successful run for `feature/captain-app`.
4. Download the `kida-captain-debug-apk` artifact and extract `app-debug.apk`.
5. Transfer the APK to an Android device and install it. Android may ask you to allow installation from that source.

The workflow builds a debug-signed internal testing APK. It is not a Play Store release build.
