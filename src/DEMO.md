# Ustabor — Demo Day qo'llanmasi

## Ishga tushirish
```
npm install
npm run dev        # lokal
npm run build      # dist/ papkasini Netlify (drag & drop) yoki Vercel'ga yuklang
```

## Demo hisoblar (parol hammasida: 1234)
- Mijoz: `90 000 00 00` (yoki "Demo mijoz" tugmasi)
- Usta (Aziz): `90 100 00 01` (yoki "Demo usta (Aziz)")
- Boshqa ustalar: "Kirish" sahifasidagi "Boshqa usta sifatida kirish…" ro'yxati
- Promo-kodlar: `USTA10` (−10%), `DEMO20` (−20%)

## Demodan oldin
1. "Kirish" sahifasida **Demo ma'lumot yaratish** ni bosing.
2. Bitta brauzerda ikkita tab oching: biri mijoz, biri usta (inkognito emas).
3. Boshidan boshlash uchun konsolda: `localStorage.clear(); sessionStorage.clear(); location.hash='home'; location.reload();`

## Qisqa ssenariy (5 daqiqa)
Darvoza → qidiruv → "Bugun bo'sh" filtri → usta profili → band vaqt (o'chirilgan) → buyurtma + promo → usta tabida qabul qilish → chat → daromad grafigi → dark mode → telefon ko'rinishi.

## Eslatma
Ma'lumotlar brauzerda saqlanadi (demo). To'lov — maket. "Tasdiqlangan" — demo qoida (tajriba ≥ 8 yil).
