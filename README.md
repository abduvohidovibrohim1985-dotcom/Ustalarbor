# Ustabor (React + Vite)
Ishga tushirish: `npm install` → `npm run dev` (http://localhost:5173)
Netlify uchun: `npm run build` → `dist` papkasini Netlify Drop'ga tashlang.

Demo hisoblar (parol hammasida 1234):
- Mijoz: 90 000 00 00
- Usta: 90 100 00 01 (Aziz Karimov), 90 100 00 02 ... 90 100 00 12

Ma'lumotlar brauzer localStorage'ida saqlanadi (backend yo'q), shuning uchun mijoz va usta hisoblarini bitta brauzerda (alohida oynalarda) sinab ko'ring.

Ikki tomonlama demo: bitta brauzerda ikkita oyna (tab) oching. Birinchisida mijoz, ikkinchisida usta bilan kiring. Har bir oyna o'z hisobida qoladi va buyurtmalar ikkala oynada avtomatik yangilanadi.


Yangi: band vaqtni tanlab bo‘lmaydi (sana + soatlik slotlar), tungi rejim (tepada ☾), mijoz-usta chat (Xabarlar). Demo ustalar (Aziz va b.) birinchi xabarga avto-javob beradi.

v13 yangiliklari: SVG rasmlar (hero, kasb ikonkalari), scroll animatsiyalari + progress chiziq, aylana bo'lib ochiladigan tungi rejim (View Transitions), maxsus kursor (faqat sichqoncha qurilmalarida), usta profil rasmi (yuklash / qirqish / almashtirish / o'chirish; rasm bo'lmasa ism-familiya bosh harflari), saytga mos demo usta tanlagich. Yangi fayl: src/extras.jsx.

v14: 3 til (O‘zbekcha / Русский / English). Tanlagich — sarlavhadagi bayroqli dropdown, tanlov brauzerda eslab qolinadi. Tarjimalar: src/i18n.js (kalit — o‘zbekcha matn; yangi matn qo‘shish uchun t('matn') ishlating va ro‘yxatga [uz, ru, en] qator qo‘shing).
