/* Ustabor — til tizimi (uz / ru / en).
   Kalit — o'zbekcha matnning o'zi. Tarjima topilmasa, o'zbekcha matn ko'rsatiladi. */
export const LANGS=[{c:'uz',n:'O‘zbekcha'},{c:'ru',n:'Русский'},{c:'en',n:'English'}]
const LS='ub_lang'
let lang='uz'
export const getLang=()=>lang
export const detectLang=()=>{
 try{const s=localStorage.getItem(LS);if(LANGS.some(l=>l.c===s))return s}catch{}
 const n=(navigator.language||'uz').slice(0,2).toLowerCase()
 return n==='ru'?'ru':n==='en'?'en':'uz'
}
export const applyLang=c=>{lang=c;try{localStorage.setItem(LS,c)}catch{}
 document.documentElement.lang=c
 document.title={uz:'Ustabor — kerakli ustani toping',ru:'Ustabor — найдите нужного мастера',en:'Ustabor — find the right pro'}[c]}
lang=detectLang();if(typeof document!=='undefined')document.documentElement.lang=lang

const plural=(arr,n)=>{
 if(!Array.isArray(arr))return arr
 if(lang==='ru'){const a=n%10,b=n%100;return arr[a===1&&b!==11?0:(a>=2&&a<=4&&(b<10||b>=20))?1:2]}
 return arr[n===1?0:1]
}
export const t=(k,v)=>{
 let r=lang==='uz'?k:(D[lang]&&D[lang][k]!==undefined?D[lang][k]:k)
 if(Array.isArray(r))r=plural(r,v&&v.n)
 if(v&&r.indexOf('{')>=0)r=r.replace(/\{(\w+)\}/g,(_,x)=>x in v?v[x]:'{'+x+'}')
 return r
}
/* manzil / hudud ro'yxati ("Chilonzor, Yunusobod") — har bir bo'lagini tarjima qiladi */
export const tl=s=>String(s).split(', ').map(x=>t(x)).join(', ')
/* "Bugun 09:00" / "Ertaga 09:00" / "Band" */
export const tw=s=>{const m=/^(Bugun|Ertaga)( .*)$/.exec(s);return m?t(m[1])+m[2]:t(s)}

/* [uz, ru, en] — ru/en massiv bo'lsa: ko'plik shakllari (ru: 1/2-4/5+, en: 1/boshqa) */
const R=[
/* --- holatlar --- */
['Yangi','Новый','New'],['Qabul qilindi','Принят','Accepted'],['Bajarildi','Выполнен','Completed'],['Rad etildi','Отклонён','Declined'],['Bekor qilindi','Отменён','Cancelled'],
['so‘m','сум','UZS'],['Bugun','Сегодня','Today'],['Ertaga','Завтра','Tomorrow'],['Band','Занят','Busy'],
/* --- kasblar --- */
['Santexnik','Сантехник','Plumber'],['Elektrik','Электрик','Electrician'],['Duradgor','Плотник','Carpenter'],['Konditsioner ustasi','Мастер по кондиционерам','AC technician'],['Maishiy texnika ustasi','Мастер по бытовой технике','Appliance repairman'],['Pardozchi','Отделочник','Painter & decorator'],['Plitkachi','Плиточник','Tiler'],['Qulf ustasi','Мастер по замкам','Locksmith'],['Payvandchi','Сварщик','Welder'],['Kompyuter ustasi','Компьютерный мастер','Computer technician'],
/* --- xizmatlar --- */
['Kran almashtirish','Замена крана','Faucet replacement'],['Quvur tozalash','Прочистка труб','Pipe cleaning'],['Unitaz o‘rnatish','Установка унитаза','Toilet installation'],['Rozetka o‘rnatish','Установка розетки','Socket installation'],['Sim tortish (1 m)','Прокладка провода (1 м)','Wiring (1 m)'],['Hisoblagich ulash','Подключение счётчика','Meter connection'],['Eshik o‘rnatish','Установка двери','Door installation'],['Mebel ta’mirlash','Ремонт мебели','Furniture repair'],['Javon yig‘ish','Сборка шкафа','Wardrobe assembly'],['Konditsioner o‘rnatish','Установка кондиционера','AC installation'],['Tozalash','Чистка','Cleaning'],['Freon to‘ldirish','Заправка фреоном','Freon refill'],['Kir yuvish mashinasi','Стиральная машина','Washing machine'],['Muzlatkich ta’miri','Ремонт холодильника','Refrigerator repair'],['Changyutgich ta’miri','Ремонт пылесоса','Vacuum cleaner repair'],['Devor bo‘yash (m²)','Покраска стен (м²)','Wall painting (m²)'],['Oboy yopishtirish','Поклейка обоев','Wallpapering'],['Shpaklyovka (m²)','Шпаклёвка (м²)','Plastering (m²)'],['Lampochka/lyustra','Лампочка / люстра','Light bulb / chandelier'],['Avtomat almashtirish','Замена автомата','Circuit breaker replacement'],['Smesitel o‘rnatish','Установка смесителя','Mixer tap installation'],['Radiator ta’miri','Ремонт радиатора','Radiator repair'],['Boyler o‘rnatish','Установка бойлера','Water heater installation'],['Kafel yotqizish (m²)','Укладка плитки (м²)','Tiling (m²)'],['Vannaxona ta’miri','Ремонт ванной','Bathroom renovation'],['Plitka almashtirish','Замена плитки','Tile replacement'],['Qulf ochish','Вскрытие замка','Lock opening'],['Qulf almashtirish','Замена замка','Lock replacement'],['Seyf ochish','Вскрытие сейфа','Safe opening'],['Darvoza payvandlash','Сварка ворот','Gate welding'],['Panjara o‘rnatish','Установка решётки','Grille installation'],['Kichik payvand','Мелкая сварка','Small welding job'],['Windows o‘rnatish','Установка Windows','Windows installation'],['Noutbuk tozalash','Чистка ноутбука','Laptop cleaning'],['Wi-Fi sozlash','Настройка Wi-Fi','Wi-Fi setup'],
/* --- hududlar --- */
['Chilonzor','Чиланзар','Chilanzar'],['Yunusobod','Юнусабад','Yunusabad'],['Mirzo Ulug‘bek','Мирзо-Улугбек','Mirzo Ulugbek'],['Shayxontohur','Шайхантахур','Shaykhantakhur'],['Sergeli','Сергели','Sergeli'],['Yakkasaroy','Яккасарай','Yakkasaray'],['Mirobod','Мирабад','Mirabad'],['Olmazor','Алмазар','Olmazor'],['Uchtepa','Учтепа','Uchtepa'],['Yashnobod','Яшнабад','Yashnabad'],
['Chilonzor, 7-kvartal','Чиланзар, 7-й квартал','Chilanzar, block 7'],['Yunusobod, 12-mavze','Юнусабад, 12-й массив','Yunusabad, district 12'],['Mirobod, Shevchenko ko‘chasi','Мирабад, ул. Шевченко','Mirabad, Shevchenko St.'],['Sergeli, 5-uy','Сергели, дом 5','Sergeli, building 5'],
/* --- ismlar --- */
['Aziz Karimov','Азиз Каримов','Aziz Karimov'],['Bobur Rahimov','Бобур Рахимов','Bobur Rahimov'],['Dilshod Aliyev','Дилшод Алиев','Dilshod Aliyev'],['Sardor Qodirov','Сардор Кодиров','Sardor Qodirov'],['Jasur Toshmatov','Жасур Тошматов','Jasur Toshmatov'],['Rustam Ergashev','Рустам Эргашев','Rustam Ergashev'],['Ulug‘bek Nazarov','Улугбек Назаров','Ulugbek Nazarov'],['Otabek Yusupov','Отабек Юсупов','Otabek Yusupov'],['Sherzod Mamatov','Шерзод Маматов','Sherzod Mamatov'],['Behzod Sattorov','Бехзод Сатторов','Behzod Sattorov'],['Komil Haydarov','Комил Хайдаров','Komil Haydarov'],['Nodir Abdullayev','Нодир Абдуллаев','Nodir Abdullayev'],
['Demo Mijoz','Демо-клиент','Demo client'],['Abduvohidov Ibrohim','Абдувохидов Иброхим','Abduvohidov Ibrohim'],
['Hamkor','Партнёр','Partner'],['Loyiha rahbari','Руководитель проекта','Project lead'],['Dasturchi','Разработчик','Developer'],['Dizayner','Дизайнер','Designer'],
/* --- FAQ --- */
['Buyurtmani qanday beraman?','Как сделать заказ?','How do I place an order?'],
['Ustani tanlang, xizmat, manzil va bo‘sh vaqtni belgilang. Usta buyurtmani qabul qilgach, holatini kabinetda kuzatasiz.','Выберите мастера, укажите услугу, адрес и свободное время. Когда мастер примет заказ, вы сможете следить за его статусом в кабинете.','Pick a pro, then choose the service, address and a free time slot. Once the pro accepts, you can track the order status in your account.'],
['Usta band bo‘lsa-chi?','Что, если мастер занят?','What if the pro is busy?'],
['Band vaqtlar ro‘yxatda o‘chirilgan holda ko‘rinadi, shuning uchun bir vaqtga ikki kishi buyurtma bera olmaydi.','Занятое время в списке недоступно, поэтому два человека не смогут заказать мастера на одно и то же время.','Busy slots are shown as disabled, so two people can’t book the same time.'],
['Narx qanday aniqlanadi?','Как определяется цена?','How is the price set?'],
['Narx — ustaning e’lon qilgan xizmat narxi. Yakuniy tafsilotlarni usta bilan chatda kelishib olasiz.','Цена — это стоимость услуги, которую указал мастер. Окончательные детали вы согласуете с мастером в чате.','The price is what the pro lists for the service. You agree on the final details with the pro in chat.'],
['Usta bilan qanday gaplashaman?','Как связаться с мастером?','How do I talk to the pro?'],
['Usta kartasidagi “Xabar yozish” yoki buyurtmadagi “Chat” tugmasi orqali.','Через кнопку «Написать» на карточке мастера или «Чат» в заказе.','Use the “Message” button on the pro’s card or “Chat” on your order.'],
['Usta sifatida qanday qo‘shilaman?','Как присоединиться как мастер?','How do I join as a pro?'],
['“Ro‘yxatdan o‘tish” bo‘limida “Men ustaman” ni tanlab, kasbingiz va narxlaringizni kiriting.','В разделе «Регистрация» выберите «Я мастер» и укажите свою профессию и цены.','Go to “Sign up”, choose “I’m a pro” and enter your trade and prices.'],
/* --- umumiy tugmalar --- */
['Yopish','Закрыть','Close'],['Orqaga','Назад','Back'],['Ortga','Назад','Back'],['Saqlash','Сохранить','Save'],['Yuborish','Отправить','Send'],['Qo‘llash','Применить','Apply'],['Tozalash','Очистить','Clear'],['Kirish','Войти','Log in'],['Chiqish','Выйти','Log out'],['Ro‘yxatdan o‘tish','Регистрация','Sign up'],['Qidirish','Найти','Search'],['O‘chirish','Удалить','Delete'],['Qo‘shish','Добавить','Add'],['Profil','Профиль','Profile'],['Buyurtma','Заказ','Order'],['Buyurtma berish','Заказать','Place order'],['Xabar yozish','Написать','Message'],['Kabinetga','В кабинет','To account'],['Chat','Чат','Chat'],['Javob','Ответить','Reply'],
['Tanlang…','Выберите…','Select…'],['dan','от','from'],['Yangi','Новый','New'],
['✓ Tasdiqlangan','✓ Проверен','✓ Verified'],['Tasdiqlangan','Проверен','Verified'],
/* --- navigatsiya --- */
['Bosh sahifa','Главная','Home'],['Ustalar','Мастера','Pros'],['Biz haqimizda','О нас','About us'],['Kabinet','Кабинет','Account'],['Xabarlar','Сообщения','Messages'],
['Ustabor — ishonchli ustalar, aniq narxlar','Ustabor — проверенные мастера, понятные цены','Ustabor — trusted pros, clear prices'],
['Kerakli ustani toping va uyingizga chaqiring.','Найдите нужного мастера и вызовите его на дом.','Find the right pro and call them to your home.'],
['Mijozlarga','Клиентам','For customers'],['Ustalarga','Мастерам','For pros'],['Usta bo‘lish','Стать мастером','Become a pro'],['Loyiha','Проект','Project'],['Demo Day 2026','Demo Day 2026','Demo Day 2026'],
['Menyu','Меню','Menu'],['Til','Язык','Language'],['Tungi rejimni almashtirish','Переключить тёмную тему','Toggle dark mode'],['Tungi / kunduzgi rejim','Тёмная / светлая тема','Dark / light mode'],
/* --- bosh sahifa --- */
['Uyingizdagi har bir muammoga usta bor.','Для каждой домашней проблемы есть мастер.','There’s a pro for every problem at home.'],
['Tekshirilgan ustalar, aniq narxlar va buyurtma holatini kuzatish — hammasi bir joyda.','Проверенные мастера, понятные цены и отслеживание заказа — всё в одном месте.','Verified pros, clear prices and order tracking — all in one place.'],
['Masalan: santexnik','Например: сантехник','e.g. plumber'],
['Tezkor chaqiruv','Срочный вызов','Quick call'],['Usta topish','Найти мастера','Find a pro'],['Usta bo‘lib qo‘shilish','Стать мастером','Join as a pro'],
['Aziz K. · Santexnik','Азиз К. · Сантехник','Aziz K. · Plumber'],['Bugun bo‘sh','Свободен сегодня','Free today'],
['usta','мастеров','pros'],['kasb turi','видов профессий','trades'],['mijoz','клиентов','customers'],['bajarilgan ish','выполнено работ','jobs done'],
['Kasblar','Профессии','Trades'],['Kerakli yo‘nalishni tanlang.','Выберите нужное направление.','Choose the trade you need.'],
['{n} usta',['{n} мастер','{n} мастера','{n} мастеров'],['{n} pro','{n} pros']],
['Eng yuqori baholilar','Лучшие по рейтингу','Top rated'],['Reyting bo‘yicha birinchi ustalar.','Мастера с самым высоким рейтингом.','Pros with the highest ratings.'],
['Qanday ishlaydi?','Как это работает?','How does it work?'],['Uch qadamda usta chaqiring.','Вызовите мастера за три шага.','Call a pro in three steps.'],
['Ro‘yxatdan o‘ting','Зарегистрируйтесь','Sign up'],['Mijoz sifatida hisob oching.','Создайте аккаунт клиента.','Create a customer account.'],
['Ustani tanlab buyurtma bering','Выберите мастера и сделайте заказ','Pick a pro and place an order'],['Xizmat, manzil va vaqtni yozing.','Укажите услугу, адрес и время.','Enter the service, address and time.'],
['Holatni kuzating','Следите за статусом','Track the status'],['Usta qabul qiladi, ish bajariladi, siz baho berasiz.','Мастер принимает заказ, выполняет работу, а вы ставите оценку.','The pro accepts, does the job, and you leave a rating.'],
['Ko‘p so‘raladigan savollar','Частые вопросы','FAQ'],['Qisqa javoblar.','Краткие ответы.','Short answers.'],
['Ustamisiz? Mijozlar sizni kutmoqda','Вы мастер? Клиенты ждут вас','Are you a pro? Customers are waiting'],
['Profil oching, xizmat narxlarini qo‘ying va buyurtmalarni qabul qiling.','Создайте профиль, укажите цены на услуги и принимайте заказы.','Create a profile, set your service prices and accept orders.'],
['Usta sifatida ro‘yxatdan o‘tish','Зарегистрироваться как мастер','Sign up as a pro'],
['Kerakli usta — bir bosishda','Нужный мастер — в один клик','The right pro — one click away'],['Darvoza ochilmoqda…','Открываем ворота…','Opening the gate…'],
/* --- usta kartasi / modal --- */
['Sevimlilarga qo‘shish','Добавить в избранное','Add to favorites'],
['({n} sharh)',['({n} отзыв)','({n} отзыва)','({n} отзывов)'],['({n} review)','({n} reviews)']],
['{n} sharh',['{n} отзыв','{n} отзыва','{n} отзывов'],['{n} review','{n} reviews']],
['{n} yil',['{n} год','{n} года','{n} лет'],['{n} year','{n} years']],
['tajriba','опыта','experience'],
['● Eng yaqin bo‘sh vaqt: {l}','● Ближайшее свободное время: {l}','● Next free slot: {l}'],
['Buyurtma yuborildi','Заказ отправлен','Order sent'],
['{name} buyurtmangizni ko‘rib chiqadi. Holatini kabinetda kuzating.','{name} рассмотрит ваш заказ. Следите за статусом в кабинете.','{name} will review your order. Track its status in your account.'],
['Tajriba','Опыт','Experience'],['Boshlang‘ich narx','Цена от','Starting price'],['Hudud','Район','Area'],['Hududlari:','Районы:','Areas:'],['Xizmatlar','Услуги','Services'],['Mijozlar sharhi','Отзывы клиентов','Customer reviews'],['Hozircha sharh yo‘q.','Отзывов пока нет.','No reviews yet.'],
['Xizmat turi','Тип услуги','Service type'],['Muammo tavsifi','Описание проблемы','Problem description'],['Masalan: oshxonadagi kran oqyapti','Например: течёт кран на кухне','e.g. the kitchen faucet is leaking'],
['Muammo rasmi (ixtiyoriy)','Фото проблемы (необязательно)','Photo of the problem (optional)'],['Muammo rasmi','Фото проблемы','Problem photo'],
['Manzil','Адрес','Address'],['Tuman, ko‘cha, uy','Район, улица, дом','District, street, house'],['Promo-kod','Промокод','Promo code'],['Masalan: USTA10','Например: USTA10','e.g. USTA10'],
['Taxminiy narx','Примерная цена','Estimated price'],['Xizmatni tanlang','Выберите услугу','Select a service'],
['Xizmat turini tanlang','Выберите тип услуги','Select a service type'],['Muammoni qisqacha yozing','Кратко опишите проблему','Describe the problem briefly'],['Manzilni kiriting','Введите адрес','Enter the address'],['Sanani tanlang','Выберите дату','Select a date'],['Bo‘sh vaqtni tanlang','Выберите свободное время','Select a free time'],
['Faqat mijozlar buyurtma beradi','Заказывать могут только клиенты','Only customers can place orders'],['Avval tizimga kiring','Сначала войдите в систему','Please log in first'],
['Siz usta sifatida kirgansiz. Buyurtma berish uchun mijoz hisobi kerak.','Вы вошли как мастер. Для заказа нужен аккаунт клиента.','You’re logged in as a pro. A customer account is needed to place orders.'],
['Buyurtma berish uchun mijoz sifatida kiring yoki ro‘yxatdan o‘ting.','Чтобы сделать заказ, войдите как клиент или зарегистрируйтесь.','Log in as a customer or sign up to place an order.'],
['Promo-kod qo‘llandi: −{p}%','Промокод применён: −{p}%','Promo code applied: −{p}%'],['Bunday promo-kod yo‘q','Такого промокода нет','No such promo code'],
['Sana','Дата','Date'],['Bo‘sh vaqtlar','Свободное время','Available times'],['Band yoki o‘tib ketgan vaqtlar o‘chirilgan','Занятое и прошедшее время недоступно','Busy or past times are disabled'],
/* --- ustalar sahifasi --- */
['Hammasi','Все','All'],['Usta ismini yozing…','Введите имя мастера…','Type a pro’s name…'],
['{n} ta usta ro‘yxatda. Kasbni tanlang yoki ism bo‘yicha qidiring.','{n} мастеров в списке. Выберите профессию или ищите по имени.','{n} pros listed. Pick a trade or search by name.'],
['Saralash','Сортировка','Sort'],['Saralash: odatiy','Сортировка: по умолчанию','Sort: default'],['Reyting bo‘yicha','По рейтингу','By rating'],['Arzonroq avval','Сначала дешёвые','Cheapest first'],['Tajriba bo‘yicha','По опыту','By experience'],
['● Bugun bo‘sh','● Свободен сегодня','● Free today'],['Reyting','Рейтинг','Rating'],['Reyting: hammasi','Рейтинг: любой','Rating: any'],['4.5 va yuqori','4,5 и выше','4.5 and up'],['4.8 va yuqori','4,8 и выше','4.8 and up'],
['Narx','Цена','Price'],['Narx: hammasi','Цена: любая','Price: any'],['70 000 gacha','до 70 000','up to 70,000'],['100 000 gacha','до 100 000','up to 100,000'],['150 000 gacha','до 150 000','up to 150,000'],
['Hech narsa topilmadi','Ничего не найдено','Nothing found'],['Boshqa ism yozing yoki filtrni tozalang.','Введите другое имя или сбросьте фильтры.','Try another name or clear the filters.'],['Filtrni tozalash','Сбросить фильтры','Clear filters'],
/* --- kirish / ro'yxatdan o'tish --- */
['Usta yoki mijoz — hammasi bir joyda','Мастер или клиент — всё в одном месте','Pro or customer — all in one place'],['Qaytganingizdan xursandmiz!','Рады видеть вас снова!','Welcome back!'],
['Hisob oching va buyurtmalarni bir joydan boshqaring.','Создайте аккаунт и управляйте заказами в одном месте.','Create an account and manage your orders in one place.'],['Buyurtmalar, xabarlar va profilingiz sizni kutmoqda.','Заказы, сообщения и профиль ждут вас.','Your orders, messages and profile are waiting.'],
['Tizimga kirish','Вход в систему','Log in'],['Hisob turini tanlang.','Выберите тип аккаунта.','Choose an account type.'],['Telefon raqam va parolingizni kiriting.','Введите номер телефона и пароль.','Enter your phone number and password.'],
['Men mijozman','Я клиент','I’m a customer'],['Men ustaman','Я мастер','I’m a pro'],
['Ism familiya','Имя и фамилия','Full name'],['Telefon','Телефон','Phone'],['Parol','Пароль','Password'],['Kasbingiz','Ваша профессия','Your trade'],['Masalan: Santexnik','Например: Сантехник','e.g. Plumber'],
['Tajriba (yil)','Опыт (лет)','Experience (years)'],['Boshlang‘ich narx (so‘m)','Цена от (сум)','Starting price (UZS)'],['Ishlaydigan hududlar','Районы работы','Service areas'],
['Hisob ochish','Создать аккаунт','Create account'],['Hisobingiz bormi?','Уже есть аккаунт?','Already have an account?'],['Hisobingiz yo‘qmi?','Нет аккаунта?','Don’t have an account?'],
['Ismingizni kiriting','Введите ваше имя','Enter your name'],['Telefon raqamini to‘liq kiriting','Введите номер телефона полностью','Enter the full phone number'],['Parol kamida 4 ta belgi bo‘lsin','Пароль — не менее 4 символов','Password must be at least 4 characters'],
['Kasbingizni yozing','Укажите профессию','Enter your trade'],['Tajribani yillarda kiriting','Укажите опыт в годах','Enter experience in years'],['Hududni kiriting','Укажите район','Enter your area'],['Narx kamida 10 000 so‘m','Цена — не менее 10 000 сум','Price must be at least 10,000 UZS'],
['Demo uchun tez kirish','Быстрый вход для демо','Quick demo login'],['parol: 1234','пароль: 1234','password: 1234'],['Demo mijoz','Демо-клиент','Demo customer'],['Buyurtma beradi','Делает заказы','Places orders'],['Demo usta','Демо-мастер','Demo pro'],
['Demo ma‘lumot yaratish','Создать демо-данные','Create demo data'],
['Boshqa usta sifatida kirish','Войти как другой мастер','Log in as another pro'],['{n} ta demo usta',['{n} демо-мастер','{n} демо-мастера','{n} демо-мастеров'],['{n} demo pro','{n} demo pros']],['Demo ustalar','Демо-мастера','Demo pros'],
/* --- buyurtma kartasi / holatlar --- */
['Tel: +998 {p} · ','Тел: +998 {p} · ','Tel: +998 {p} · '],['Manzil: {a}','Адрес: {a}','Address: {a}'],['Vaqt: {tm} · {pr}','Время: {tm} · {pr}','Time: {tm} · {pr}'],
['Promo-kod: {v}','Промокод: {v}','Promo code: {v}'],['Bekor sababi: {v}','Причина отмены: {v}','Cancellation reason: {v}'],['To‘langan: {v}','Оплачено: {v}','Paid: {v}'],['Sharh: {v}','Отзыв: {v}','Review: {v}'],['Usta javobi: {v}','Ответ мастера: {v}','Pro’s reply: {v}'],['Usta javobi:','Ответ мастера:','Pro’s reply:'],
['Sharhga javob yozing','Напишите ответ на отзыв','Write a reply to the review'],['Sharh yozing','Напишите отзыв','Write a review'],
['Vaqtni o‘zgartirish','Изменить время','Reschedule'],['Bekor qilish','Отменить','Cancel'],['To‘lash','Оплатить','Pay'],['Qabul qilish','Принять','Accept'],['Rad etish','Отклонить','Decline'],
['Yana ko‘rsatish ({n})','Показать ещё ({n})','Show more ({n})'],
['Bekor qilish sababi','Причина отмены','Cancellation reason'],['Bekor qilishni tasdiqlash','Подтвердить отмену','Confirm cancellation'],
['Vaqtim o‘zgardi','Изменились планы','My plans changed'],['Muammo hal bo‘ldi','Проблема решена','The problem is solved'],['Boshqa usta topdim','Нашёл другого мастера','Found another pro'],['Boshqa sabab','Другая причина','Other reason'],
['To‘lov usuli','Способ оплаты','Payment method'],['To‘lov summasi','Сумма оплаты','Amount'],['Demo to‘lov: haqiqiy pul yechilmaydi.','Демо-оплата: реальные деньги не списываются.','Demo payment: no real money is charged.'],['Jarayonda…','В процессе…','Processing…'],
['Karta','Карта','Card'],['Naqd','Наличные','Cash'],['Sana va vaqtni tanlang','Выберите дату и время','Select a date and time'],['Bu vaqt band','Это время занято','This time is taken'],
/* --- tezkor chaqiruv --- */
['Usta topildi','Мастер найден','Pro found'],['({job}) · {l} · {s} — {p}. Buyurtmangiz yuborildi.','({job}) · {l} · {s} — {p}. Ваш заказ отправлен.','({job}) · {l} · {s} — {p}. Your order has been sent.'],
['Eng yaqin bo‘sh ustani biz o‘zimiz tanlaymiz.','Мы сами выберем ближайшего свободного мастера.','We’ll pick the nearest available pro for you.'],['Kim kerak?','Кто нужен?','Who do you need?'],['Kasbni tanlang…','Выберите профессию…','Select a trade…'],['Muammo','Проблема','Problem'],['Masalan: kran oqyapti','Например: течёт кран','e.g. a leaking faucet'],['Eng yaqin ustani chaqirish','Вызвать ближайшего мастера','Call the nearest pro'],
['Kasbni tanlang','Выберите профессию','Select a trade'],['Hozircha bo‘sh usta topilmadi','Свободных мастеров пока нет','No available pros right now'],['⚡ Tezkor chaqiruv','⚡ Срочный вызов','⚡ Quick call'],
['Kasb','Профессия','Trade'],['Usta','Мастер','Pro'],
/* --- chat --- */
['Usta va mijoz o‘rtasidagi suhbat.','Переписка между мастером и клиентом.','Conversation between pro and customer.'],['Suhbat yo‘q. Usta kartasidan “Xabar yozish” ni bosing.','Диалогов нет. Нажмите «Написать» на карточке мастера.','No conversations yet. Press “Message” on a pro’s card.'],
['Yangi suhbat','Новый диалог','New conversation'],['Birinchi xabarni yozing','Напишите первое сообщение','Write the first message'],['Suhbatni tanlang','Выберите диалог','Select a conversation'],['Xabar yozing…','Напишите сообщение…','Type a message…'],['Xabar','Сообщение','Message'],['avto-javob · ','автоответ · ','auto-reply · '],
['Assalomu alaykum! Xabaringiz uchun rahmat, tez orada batafsil javob beraman.','Здравствуйте! Спасибо за сообщение, скоро отвечу подробнее.','Hello! Thanks for your message, I’ll reply in detail soon.'],
/* --- bildirishnomalar --- */
['Bildirishnomalar','Уведомления','Notifications'],['Hozircha yangilik yo‘q.','Новостей пока нет.','Nothing new yet.'],
['Yangi buyurtma: {n} · {s}','Новый заказ: {n} · {s}','New order: {n} · {s}'],['Yangi sharh: {v}','Новый отзыв: {v}','New review: {v}'],['To‘lov olindi: {v}','Получена оплата: {v}','Payment received: {v}'],
['{n} buyurtmangizni qabul qildi','{n} принял(а) ваш заказ','{n} accepted your order'],['{n} ishni bajardi — to‘lov va baho qoldiring','{n} выполнил(а) работу — оплатите и оставьте оценку','{n} finished the job — pay and leave a rating'],['{n} buyurtmani rad etdi','{n} отклонил(а) заказ','{n} declined the order'],
['{n} ta yangi xabar',['{n} новое сообщение','{n} новых сообщения','{n} новых сообщений'],['{n} new message','{n} new messages']],
/* --- sozlamalar --- */
['Shaxsiy ma’lumotlar','Личные данные','Personal details'],['Parolni o‘zgartirish','Смена пароля','Change password'],['Parolni yangilash','Обновить пароль','Update password'],['Joriy parol','Текущий пароль','Current password'],['Yangi parol','Новый пароль','New password'],['Yangi parolni takrorlang','Повторите новый пароль','Repeat new password'],
['Yangi parol kamida 4 ta belgi bo‘lsin','Новый пароль — не менее 4 символов','New password must be at least 4 characters'],['Parollar mos kelmadi','Пароли не совпадают','Passwords don’t match'],
['Sevimli ustalar yo‘q','Избранных мастеров нет','No favorite pros'],['Usta kartasidagi ♥ belgisini bosing.','Нажмите на ♥ на карточке мастера.','Press the ♥ on a pro’s card.'],
['Bu raqam boshqa hisobda bor','Этот номер уже используется в другом аккаунте','This number is used by another account'],['Joriy parol noto‘g‘ri','Текущий пароль неверный','Current password is incorrect'],['Parol yangilandi','Пароль обновлён','Password updated'],['Ma‘lumotlar saqlandi','Данные сохранены','Details saved'],
['Sevimlilarga qo‘shish uchun mijoz sifatida kiring','Чтобы добавить в избранное, войдите как клиент','Log in as a customer to add favorites'],['Bu raqam bilan hisob allaqachon bor','Аккаунт с этим номером уже существует','An account with this number already exists'],['Telefon yoki parol noto‘g‘ri','Неверный телефон или пароль','Wrong phone or password'],
/* --- biz haqimizda --- */
['Ustabor — uy ta’miri va maishiy xizmatlar uchun mijoz va ustalarni bir joyda uchrashtiradigan platforma. Maqsadimiz: ishonchli ustani topishni oddiy, narxlarni aniq, jarayonni esa shaffof qilish.','Ustabor — платформа, которая объединяет клиентов и мастеров по ремонту и бытовым услугам. Наша цель: сделать поиск надёжного мастера простым, цены — понятными, а процесс — прозрачным.','Ustabor is a platform that brings customers and pros together for home repair and household services. Our goal: make finding a trusted pro simple, prices clear and the process transparent.'],
['Biz nimaga ishonamiz','Во что мы верим','What we believe in'],['Platformaning uch tamoyili.','Три принципа платформы.','The platform’s three principles.'],
['Shaffoflik','Прозрачность','Transparency'],['Xizmat narxlari va sharhlar hammaga ochiq.','Цены на услуги и отзывы открыты для всех.','Service prices and reviews are open to everyone.'],
['Qulaylik','Удобство','Convenience'],['Bo‘sh vaqtni tanlang, usta bilan chatda kelishing, holatni kuzating.','Выберите свободное время, договоритесь с мастером в чате и следите за статусом.','Pick a free time, agree with the pro in chat and track the status.'],
['Ishonch','Доверие','Trust'],['Har bir bajarilgan ishdan keyin mijoz baho va sharh qoldiradi.','После каждой выполненной работы клиент оставляет оценку и отзыв.','After every finished job the customer leaves a rating and review.'],
['Jamoa','Команда','Team'],['Ustabor ortida turgan odamlar.','Люди, которые стоят за Ustabor.','The people behind Ustabor.'],
/* --- profil sahifasi --- */
['← Ustalarga qaytish','← Назад к мастерам','← Back to pros'],['♥ Sevimli','♥ В избранном','♥ Favorite'],['♡ Sevimlilarga','♡ В избранное','♡ Add to favorites'],
['Usta haqida','О мастере','About the pro'],['Ish namunalari','Примеры работ','Work samples'],['Hali ish rasmlari qo‘shilmagan.','Фото работ пока не добавлены.','No work photos added yet.'],
['{x} yillik tajribaga ega {job}. {a} hududlarida xizmat ko‘rsatadi.','{job} с опытом работы — {years}. Работает в районах: {a}.','{job} with {years} of experience. Serves: {a}.'],
['Mijozlar sharhi ({n})','Отзывы клиентов ({n})','Customer reviews ({n})'],
['{n} ta bajarilgan ish',['{n} выполненная работа','{n} выполненные работы','{n} выполненных работ'],['{n} completed job','{n} completed jobs']],
['Narx (dan)','Цена (от)','Price (from)'],['Eng yaqin bo‘sh vaqt','Ближайшее свободное время','Next free slot'],
['Ish namunasi {n}','Пример работы {n}','Work sample {n}'],['Ish namunasi','Пример работы','Work sample'],
/* --- sahifa topilmadi --- */
['Sahifa topilmadi','Страница не найдена','Page not found'],['Bu manzil mavjud emas yoki o‘chirilgan.','Такого адреса нет или страница удалена.','This address doesn’t exist or was removed.'],['Bosh sahifaga','На главную','Back to home'],
/* --- kabinetlar --- */
['Salom, {name}','Здравствуйте, {name}','Hello, {name}'],['Mijoz kabineti','Кабинет клиента','Customer account'],['jami buyurtma','всего заказов','total orders'],['faol','активных','active'],['bajarilgan','выполнено','completed'],
['Buyurtmalarim','Мои заказы','My orders'],['Sozlamalar','Настройки','Settings'],['Sevimlilar','Избранное','Favorites'],
['Hozircha buyurtma yo‘q','Заказов пока нет','No orders yet'],['Ustani tanlab, birinchi buyurtmangizni bering.','Выберите мастера и сделайте первый заказ.','Pick a pro and place your first order.'],
['Usta kabineti','Кабинет мастера','Pro account'],['yangi buyurtma','новых заказов','new orders'],['jarayonda','в работе','in progress'],['daromad (so‘m)','доход (сум)','income (UZS)'],['reyting ({n} sharh)',['рейтинг ({n} отзыв)','рейтинг ({n} отзыва)','рейтинг ({n} отзывов)'],['rating ({n} review)','rating ({n} reviews)']],
['Oxirgi 7 kun daromadi','Доход за последние 7 дней','Income, last 7 days'],
['Buyurtmalar','Заказы','Orders'],['Profil va xizmatlar','Профиль и услуги','Profile & services'],['Hisob sozlamalari','Настройки аккаунта','Account settings'],['Jarayonda','В работе','In progress'],['Bajarilgan','Выполненные','Completed'],
['Buyurtma yo‘q','Заказов нет','No orders'],['Mijoz buyurtma berganda shu yerda paydo bo‘ladi.','Здесь появятся заказы, когда клиенты их сделают.','Orders will appear here when customers place them.'],
['Hududlar','Районы','Areas'],['Yangi xizmat','Новая услуга','New service'],['Narxi','Цена','Price'],['Xizmat nomi va narxini kiriting','Введите название и цену услуги','Enter the service name and price'],['Maydonlarni to‘g‘ri to‘ldiring','Заполните поля правильно','Fill in the fields correctly'],
['Ish rasmlari ({n}/6)','Фото работ ({n}/6)','Work photos ({n}/6)'],['Mijozlar profilingizda ko‘radi.','Клиенты увидят их в вашем профиле.','Customers will see them on your profile.'],['Rasm qo‘shish','Добавить фото','Add photo'],['Yana {n} ta rasm qo‘shish mumkin','Можно добавить ещё {n} фото','You can add {n} more photos'],
['Rasm yuklash','Загрузить фото','Upload photo'],['Rasmni almashtirish','Заменить фото','Change photo'],
/* --- rasm tahrirlash --- */
['Rasmni sozlang','Настройте фото','Adjust your photo'],['Suring va kattalashtiring — doira ichidagi qism profilingizda ko‘rinadi.','Перетащите и увеличьте — часть внутри круга будет видна в профиле.','Drag and zoom — the part inside the circle will show on your profile.'],['Yuklanmoqda…','Загрузка…','Loading…'],['Boshqa rasm','Другое фото','Another photo'],
['Rasmni surish uchun sudrang yoki strelka tugmalarini bosing','Перетащите фото или используйте клавиши со стрелками','Drag the photo or use the arrow keys'],['Kattalashtirish','Масштаб','Zoom'],
['Profil rasmi','Фото профиля','Profile photo'],['Qirqish','Обрезать','Crop'],['O‘chirilsinmi?','Удалить?','Delete?'],['Ha, o‘chir','Да, удалить','Yes, delete'],['Yo‘q','Нет','No'],
['Rasmingiz mijozlarga kartangizda va profilingizda ko‘rinadi.','Ваше фото увидят клиенты на карточке и в профиле.','Customers will see your photo on your card and profile.'],['Rasm qo‘ymasangiz, ism-familiyangizning bosh harflari ko‘rinadi.','Если фото нет, показываются инициалы вашего имени.','Without a photo, your initials are shown.'],
['Rasmni bu yerga tashlab ham yuklashingiz mumkin.','Фото можно также перетащить сюда.','You can also drop a photo here.'],
['Faqat rasm fayli tanlang','Выберите файл с изображением','Please choose an image file'],['Rasm juda katta (25 MB gacha)','Файл слишком большой (до 25 МБ)','Image is too large (up to 25 MB)'],['Profil rasmi yangilandi','Фото профиля обновлено','Profile photo updated'],['Rasm o‘chirildi — bosh harflar ko‘rsatiladi','Фото удалено — будут показаны инициалы','Photo removed — initials will be shown'],
['Bir nechta rasm tanlash mumkin','Можно выбрать несколько фото','You can select several photos'],['Rasm tanlanmagan','Фото не выбрано','No photo selected'],
['Uy va usta asboblari','Дом и инструменты мастера','A house and pro’s tools'],['Muammo rasmi alt','Фото проблемы','Problem photo'],
/* --- toastlar --- */
['Javob yuborildi','Ответ отправлен','Reply sent'],['Buyurtma bekor qilindi','Заказ отменён','Order cancelled'],['Vaqt o‘zgartirildi','Время изменено','Time changed'],['To‘lov qabul qilindi','Оплата принята','Payment accepted'],
['Demo ma‘lumotlar o‘chirildi','Демо-данные удалены','Demo data cleared'],['Demo uchun hisob topilmadi','Для демо не найден аккаунт','No account found for the demo'],['Demo ma‘lumotlar yaratildi','Демо-данные созданы','Demo data created'],
['Bu vaqt hozirgina band qilindi. Boshqa vaqtni tanlang','Это время только что заняли. Выберите другое','This time was just booked. Choose another'],['Buyurtma yuborildi','Заказ отправлен','Order sent'],['Holat: {v}','Статус: {v}','Status: {v}'],['Sharh qoldirildi','Отзыв оставлен','Review submitted'],['Saqlandi','Сохранено','Saved'],['Profil saqlandi','Профиль сохранён','Profile saved'],
/* --- demo tarkibi --- */
['Demo buyurtma','Демо-заказ','Demo order'],['Demo: tezroq kelsangiz yaxshi bo‘lardi','Демо: хорошо бы приехать пораньше','Demo: it would be better if you came sooner'],['Demo: qabul qilingan buyurtma','Демо: принятый заказ','Demo: accepted order'],
['Juda tez va sifatli ishladi, rahmat!','Работал быстро и качественно, спасибо!','Fast and high-quality work, thank you!'],['Narxi aytilgandek, ish toza.','Цена как и обещали, работа аккуратная.','Price as promised, clean work.'],['Vaqtida keldi, tavsiya qilaman.','Пришёл вовремя, рекомендую.','Arrived on time, I recommend.'],['Muammo bir zumda hal bo‘ldi.','Проблему решили в одно мгновение.','The problem was solved in no time.'],['Yaxshi usta, albatta yana murojaat qilaman.','Хороший мастер, обязательно обращусь снова.','Great pro, I’ll definitely come back.'],
['Assalomu alaykum, ertaga soat 11:00 ga kela olasizmi?','Здравствуйте, сможете приехать завтра в 11:00?','Hello, can you come tomorrow at 11:00?'],['Va alaykum assalom! Ha, albatta, vaqtida boraman.','Здравствуйте! Да, конечно, приеду вовремя.','Hello! Yes, of course, I’ll be there on time.'],['Kerakli ehtiyot qismlar bilan kelaman.','Приеду с нужными запчастями.','I’ll bring the necessary parts.'],['Salom, hisoblagichni ham ulab bera olasizmi?','Здравствуйте, сможете заодно подключить счётчик?','Hi, can you also connect the meter?'],['Ha, bu xizmat narxi profilda yozilgan.','Да, цена этой услуги указана в профиле.','Yes, the price for this service is listed on my profile.'],
]
export const D={ru:{},en:{}}
R.forEach(([k,r,e])=>{D.ru[k]=r;D.en[k]=e})
