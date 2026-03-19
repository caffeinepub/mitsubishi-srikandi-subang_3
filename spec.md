# Mitsubishi Srikandi Subang

## Current State
Media Manager backend sudah ada di `main.mo` tapi tidak berfungsi: file yang diupload tidak tersimpan, `getAllMediaAssets` selalu mengembalikan array kosong, dan preupgrade/postupgrade stable storage tidak bekerja dengan benar. Terlalu banyak patch yang bertumpuk sehingga menyebabkan konflik.

## Requested Changes (Diff)

### Add
- Fungsi `uploadMediaAsset` yang mengembalikan `Nat` (asset ID) bukan `()`
- Validasi MIME type untuk gambar (jpg, jpeg, png, webp), video (mp4, webm, mov), dan PDF
- Fungsi `getPublicMediaAssetById` tanpa auth untuk public rendering

### Modify
- Semua fungsi Media Manager ditulis ulang dari bersih
- Permission check: izinkan `callerIsAnyAdmin` ATAU `#user` permission — tidak lagi hanya `#user`
- `getAllMediaAssets` menggunakan `mediaAssets.values().toArray()` yang benar
- `preupgrade`: simpan `mediaAssets.values().toArray()` ke `stableMediaAssets`
- `postupgrade`: restore dari `stableMediaAssets` ke `mediaAssets` dengan loop
- Frontend MediaManager: tiga card section (Gambar, Video, PDF Brosur)
- Frontend MediaManager upload: tangkap ID yang dikembalikan dan refresh list
- File Picker di seluruh modul: gunakan `getAllMediaAssets` sebagai satu-satunya sumber data

### Remove
- Fungsi duplikat `getMediaAssets` (jika ada)
- Permission logic yang hanya mengizinkan `#user` saja

## Implementation Plan
1. Rewrite fungsi Media Manager di main.mo: uploadMediaAsset (return Nat), getAllMediaAssets, getMediaAssetById, deleteMediaAsset, updateMediaAsset, getPublicMediaAssetById
2. Fix preupgrade/postupgrade untuk stable storage Media Assets
3. Rewrite MediaManager.tsx frontend: upload, list, tiga card section
4. Fix BannerImagePicker/MediaPicker untuk gunakan getAllMediaAssets
5. Validate build dan deploy
