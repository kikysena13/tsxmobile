Kalau project kamu **Expo + React Native**, command normalnya dari:

```cmd
cd /d B:\ServerHub
```

### 🌐 Jalankan di Web

```cmd
npm run web
```

atau:

```cmd
npx expo start --web
```

Nanti terbuka di browser.

### 📱 Jalankan di Android Emulator

Pastikan `Medium_Phone` sudah menyala, lalu:

```cmd
npm run android
```

atau:

```cmd
npx expo start --android
```

### 📱 Jalankan di HP fisik

```cmd
npx expo start
```

Lalu scan QR code menggunakan **Expo Go**.

### 🍎 iOS

Kalau menggunakan macOS + iPhone simulator:

```cmd
npm run ios
```

---

Jadi untuk development sehari-hari kamu bisa pakai:

```text
npm run web       → Browser
npm run android   → Android Emulator
npx expo start    → Menu Expo + QR
```

**Untuk ServerHub sekarang, coba:**

```cmd
cd /d B:\ServerHub
npm run web
```

Kalau UI yang AI buat sudah terlihat benar di browser, lanjut cek:

```cmd
npm run android
```

Karena **React Native + Expo** memang bisa kamu preview di **web maupun Android**, tetapi target utama project kita tetap mobile.
