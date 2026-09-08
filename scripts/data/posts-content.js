// Content data for Suare social media posts, carousels, stories, and YouTube covers.
// Bilingual support: Kazakh (KZ) & Russian (RU).

const icons = require("../icons");

// Curated luxury wedding & celebration Unsplash photos for background textures
const PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80", // Wedding couple
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80", // Rings / details
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=80", // Table decor
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=80", // Bride / flowers
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1400&q=80", // Banquet hall
];

let photoIdx = 0;
function nextPhoto() {
  const p = PHOTOS[photoIdx % PHOTOS.length];
  photoIdx++;
  return p;
}

/* ==========================================================================
   01. ANNOUNCEMENT POST (Launch Suare)
   ========================================================================== */
const announcementPost = {
  kicker: "SUARE · ПРЕМИУМ ОНЛАЙН-ШАҚЫРУ",
  headlineLines: [
    { text: "ЭРА БУМАГИ", mode: "solid" },
    { text: "ЗАВЕРШИЛАСЬ.", mode: "stroke" },
    { text: "SUARE УЖЕ ЗДЕСЬ.", mode: "accent" },
  ],
  headlineSize: 84,
  body: "Создавайте эстетичные онлайн-пригласительные на той, свадьбу или юбилей за 5 минут. Удобный RSVP для гостей, карта 2GIS, Kaspi-подарки и отправка в WhatsApp.",
  chips: [
    { text: "👰 ҮЙЛЕНУ ТОЙ", gold: true },
    { text: "✨ ҚЫЗ ҰЗАТУ", gold: true },
    { text: "🎉 МЕРЕЙТОЙ", gold: false },
    { text: "⚡ RSVP В 1 КЛИК", gold: true },
  ],
  footerRight: ["<b>@suare.app</b> · suare.app", "Запуск платформы"],
  photo: nextPhoto(),
};

/* ==========================================================================
   02. FEATURES CAROUSEL (8 Slides)
   ========================================================================== */
const featuresCarousel = [
  {
    kicker: "ЧТО УМЕЕТ SUARE",
    headlineLines: [
      { text: "6 ФИШЕК", mode: "solid" },
      { text: "ЭЛЕКТРОННОГО ТОЯ.", mode: "stroke" },
      { text: "ВЫБИРАЙТЕ SUARE.", mode: "accent" },
    ],
    headlineSize: 80,
    body: "Листайте карусель — показываем, почему современные молодожёны и организаторы Казахстана навсегда отказываются от бумаги.",
    chips: [
      { text: "100% ТОЧНЫЙ СПИСОК", gold: true },
      { text: "ЭКОНОМИЯ 80% ДЕНЕГ", gold: true },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Слайд 01 / 08"],
    photo: nextPhoto(),
  },
  {
    kicker: "01 / ОНЛАЙН-RSVP",
    headlineLines: [
      { text: "ТОЧНЫЙ СПИСОК", mode: "solid" },
      { text: "БЕЗ ОБЗВОНА.", mode: "stroke" },
    ],
    headlineSize: 82,
    body: "Гости подтверждают حضور в один клик: указывают, придут ли одни или с парой/детьми. Вы видите точное количество персон для банкетного зала.",
    icon: icons.checkCircle,
    chips: [
      { text: "ДЕТИ И ВЗРОСЛЫЕ", gold: true },
      { text: "БЕЗ ЛИШНИХ ТРАТ ЗА СТОЛ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Слайд 02 / 08"],
  },
  {
    kicker: "02 / WHATSAPP РАССЫЛКА",
    headlineLines: [
      { text: "ПЕРСОНАЛЬНО", mode: "solid" },
      { text: "КАЖДОМУ ГОСТЮ.", mode: "stroke" },
    ],
    headlineSize: 82,
    body: "Отправляйте именное приглашение: «Құрметті Асқар аға мен Айгүл тәте!». Гостю приятно, ссылка открывается сразу в браузере без скачивания приложений.",
    icon: icons.whatsapp,
    chips: [
      { text: "ИМЕННЫЕ ССЫЛКИ", gold: true },
      { text: "ОТКРЫВАЕТСЯ МГНОВЕННО", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Слайд 03 / 08"],
  },
  {
    kicker: "03 / НАВИГАЦИЯ & 2GIS",
    headlineLines: [
      { text: "ГОСТИ НЕ", mode: "solid" },
      { text: "ЗАБЛУДЯТСЯ.", mode: "stroke" },
    ],
    headlineSize: 82,
    body: "Точная геолокация ресторана с прямым переходом в 2GIS и Яндекс.Карты. Гостям не нужно вбивать адрес вручную и опаздывать на церемонию.",
    icon: icons.mapPin,
    chips: [
      { text: "ИНТЕГРАЦИЯ 2GIS", gold: true },
      { text: "ЯНДЕКС.КАРТЫ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Слайд 04 / 08"],
  },
  {
    kicker: "04 / АТМОСФЕРА & МУЗЫКА",
    headlineLines: [
      { text: "МУЗЫКА И ФОТО", mode: "solid" },
      { text: "ДО НАЧАЛА ТОЯ.", mode: "stroke" },
    ],
    headlineSize: 82,
    body: "Включите красивую свадебную мелодию при открытии пригласительного, добавьте фотосессию Love Story и таймлайн программы вечера.",
    icon: icons.music,
    chips: [
      { text: "ФОНОВАЯ МЕЛОДИЯ", gold: true },
      { text: "LOVE STORY ГАЛЕРЕЯ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Слайд 05 / 08"],
  },
  {
    kicker: "05 / ТОЙБАСТАР & KASPI",
    headlineLines: [
      { text: "ПОДАРКИ", mode: "solid" },
      { text: "ПО KASPI QR.", mode: "stroke" },
    ],
    headlineSize: 82,
    body: "Гости, которые не могут приехать из другого города, отправят поздравление и подарок в один клик через Kaspi или карту.",
    icon: icons.qrCode,
    chips: [
      { text: "БЫСТРЫЙ ПЕРЕВОД", gold: true },
      { text: "БЕЗ ЛИШНИХ КОНВЕРТОВ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Слайд 06 / 08"],
  },
  {
    kicker: "06 / ОРГАНИЗАЦИЯ",
    headlineLines: [
      { text: "ЭКСПОРТ В EXCEL", mode: "solid" },
      { text: "ДЛЯ РЕСТОРАНА.", mode: "stroke" },
    ],
    headlineSize: 82,
    body: "Выгружайте готовый список подтверждённых гостей для администратора ресторана и декораторов рассадки за считанные секунды.",
    icon: icons.barChart3,
    chips: [
      { text: "ЭКСПОРТ В 1 КЛИК", gold: true },
      { text: "РАССАДКА СТОЛОВ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Слайд 07 / 08"],
  },
  {
    kicker: "07 / ГОТОВЫ НАЧАТЬ?",
    headlineLines: [
      { text: "СОЗДАЙТЕ ШАҚЫРУ", mode: "solid" },
      { text: "ЗА 5 МИНУТ.", mode: "accent" },
    ],
    headlineSize: 78,
    body: "Переходите на сайт suare.app прямо сейчас. Выберите премиальный шаблон и отправьте первые ссылки гостям уже сегодня.",
    icon: icons.sparkles,
    chips: [
      { text: "САЙТ: SUARE.APP", gold: true },
      { text: "ССЫЛКА В ШАПКЕ ПРОФИЛЯ", gold: true },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Слайд 08 / 08"],
    photo: nextPhoto(),
  },
];

/* ==========================================================================
   03. PRICING & COMPARISON POST (Paper vs Suare)
   ========================================================================== */
const comparisonPost = {
  kicker: "СРАВНЕНИЕ · БУМАГА ПРОТИВ SUARE",
  headlineLines: [
    { text: "ПОЧЕМУ БУМАГА", mode: "solid" },
    { text: "УСТАРЕЛА?", mode: "stroke" },
  ],
  headlineSize: 80,
  body: "Посчитайте реальные расходы на печать, доставку и главное — потери на пустых столах из-за гостей, которые не пришли.",
  compare: {
    badTitle: "❌ БУМАЖНЫЕ ШАҚЫРУ",
    badItems: [
      "Печать: 80 000 – 180 000 ₸",
      "Развозка по пробкам: 1–2 недели",
      "Нельзя исправить опечатку или время",
      "Число гостей наугад (+20% переплата)",
      "Открытки теряются и забываются",
    ],
    goodTitle: "✨ ПРИГЛАСИТЕЛЬНЫЕ SUARE",
    goodItems: [
      "Стоимость: от 4 990 ₸ за всё",
      "Отправка по WhatsApp за 5 минут",
      "Изменения вносятся в любой момент",
      "Точный онлайн-список гостей (RSVP)",
      "Карта 2GIS, фотогалерея и таймлайн",
    ],
  },
  footerRight: ["<b>@suare.app</b> · suare.app", "Экономия бюджета"],
};

/* ==========================================================================
   04. HOW IT WORKS (5 Slides)
   ========================================================================== */
const howItWorksCarousel = [
  {
    kicker: "ПОШАГОВЫЙ ГАЙД",
    headlineLines: [
      { text: "КАК СОЗДАТЬ", mode: "solid" },
      { text: "ПРИГЛАСИТЕЛЬНОЕ", mode: "stroke" },
      { text: "ЗА 5 МИНУТ.", mode: "accent" },
    ],
    headlineSize: 80,
    body: "Никаких дизайнеров и ожидания типографии. Создайте идеальное цифровое приглашение с телефона прямо сейчас.",
    chips: [
      { text: "ПРОСТОЙ КОНСТРУКТОР", gold: true },
      { text: "БЕЗ ОПЫТА В ДИЗАЙНЕ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Шаг 00 / 04"],
    photo: nextPhoto(),
  },
  {
    kicker: "ШАГ 01",
    headlineLines: [
      { text: "ВЫБЕРИТЕ", mode: "solid" },
      { text: "ДИЗАЙН-ШАБЛОН.", mode: "stroke" },
    ],
    headlineSize: 82,
    body: "Эстетичные готовые темы: Classic Gold, Minimalist Monochrome, Kazakh Modern, Silk & Pearls. Каждый шаблон адаптирован под смартфоны.",
    icon: icons.sparkles,
    chips: [
      { text: "АВТОРСКИЕ ШАБЛОНЫ", gold: true },
      { text: "СВЕТЛАЯ И ТЁМНАЯ ТЕМЫ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Шаг 01 / 04"],
  },
  {
    kicker: "ШАГ 02",
    headlineLines: [
      { text: "ЗАПОЛНИТЕ", mode: "solid" },
      { text: "ДЕТАЛИ МЕРОПРИЯТИЯ.", mode: "stroke" },
    ],
    headlineSize: 80,
    body: "Укажите имена виновников торжества, дату, таймлайн программы, адрес зала (ссылка на 2GIS подтянется сама) и добавьте любимую музыку.",
    icon: icons.calendar,
    chips: [
      { text: "ДАТА И ВРЕМЯ", gold: true },
      { text: "АДРЕС В 2GIS", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Шаг 02 / 04"],
  },
  {
    kicker: "ШАГ 03",
    headlineLines: [
      { text: "ОТПРАВЬТЕ ССЫЛКУ", mode: "solid" },
      { text: "В WHATSAPP.", mode: "stroke" },
    ],
    headlineSize: 82,
    body: "Отправляйте гостям готовую красивую ссылку с превью или генерируйте персональные обращения на каждого приглашённого родственника.",
    icon: icons.whatsapp,
    chips: [
      { text: "ПРЕКРАСНОЕ ПРЕВЬЮ", gold: true },
      { text: "1 КЛИК ДЛЯ ГОСТЯ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Шаг 03 / 04"],
  },
  {
    kicker: "ШАГ 04",
    headlineLines: [
      { text: "СЛЕДИТЕ ЗА", mode: "solid" },
      { text: "ОТВЕТАМИ ОНЛАЙН.", mode: "accent" },
    ],
    headlineSize: 82,
    body: "Ответы гостей мгновенно отображаются в вашей панели: кто придёт, сколько персон и какие пожелания оставили. Наслаждайтесь спокойной подготовкой!",
    icon: icons.checkCircle,
    chips: [
      { text: "РЕАЛЬНОЕ ВРЕМЯ", gold: true },
      { text: "СПИСОК В КАРМАНЕ", gold: false },
    ],
    footerRight: ["<b>@suare.app</b> · suare.app", "Шаг 04 / 04"],
  },
];

/* ==========================================================================
   20 YOUTUBE TUTORIAL LESSONS & THUMBNAILS
   ========================================================================== */
const youtubeLessons = [
  {
    num: 1,
    title: "Что такое Suare: обзор платформы онлайн-пригласительных",
    headline: [
      { text: "ЧТО ТАКОЕ SUARE?", mode: "solid" },
      { text: "ОНЛАЙН-ШАҚЫРУ", mode: "stroke" },
      { text: "НОВОГО ПОКОЛЕНИЯ.", mode: "accent" },
    ],
    sub: "Как устроена платформа и почему более 1000 тоев уже проводятся без бумажных открыток.",
    icon: icons.sparkles,
    chips: ["ОБЗОР", "ВВЕДЕНИЕ", "SUARE.APP"],
  },
  {
    num: 2,
    title: "Как создать первое пригласительное за 5 минут",
    headline: [
      { text: "ПЕРВОЕ ШАҚЫРУ", mode: "solid" },
      { text: "ЗА 5 МИНУТ.", mode: "stroke" },
      { text: "ПОШАГОВЫЙ ГАЙД.", mode: "solid" },
    ],
    sub: "Пошаговая регистрация, выбор шаблона и ввод основных данных вашего тоя.",
    icon: icons.calendar,
    chips: ["БЫСТРЫЙ СТАРТ", "РЕГИСТРАЦИЯ"],
  },
  {
    num: 3,
    title: "Выбор стиля и каталога шаблонов",
    headline: [
      { text: "КАТАЛОГ ШАБЛОНОВ.", mode: "solid" },
      { text: "СТИЛИ И ДИЗАЙНЫ", mode: "stroke" },
      { text: "ПОД ЛЮБОЙ ТОЙ.", mode: "accent" },
    ],
    sub: "Свадьба, қыз ұзату, сүндет той, юбилей — обзор цветовых палитр и шрифтов.",
    icon: icons.sparkles,
    chips: ["ШАБЛОНЫ", "ДИЗАЙН"],
  },
  {
    num: 4,
    title: "Настройка RSVP: сбор ответов и учет гостей",
    headline: [
      { text: "НАСТРОЙКА RSVP.", mode: "solid" },
      { text: "ТОЧНЫЙ СЧЁТ", mode: "stroke" },
      { text: "КАЖДОГО ГОСТЯ.", mode: "solid" },
    ],
    sub: "Как включить подтверждение участия, вопрос о паре и подсчет детей.",
    icon: icons.checkCircle,
    chips: ["RSVP", "ГОСТИ"],
  },
  {
    num: 5,
    title: "Интеграция с картами 2GIS и Яндекс",
    headline: [
      { text: "ТОЧНЫЙ АДРЕС.", mode: "solid" },
      { text: "ИНТЕГРАЦИЯ 2GIS", mode: "stroke" },
      { text: "В ОДИН КЛИК.", mode: "accent" },
    ],
    sub: "Как правильно указать локацию банкетного зала, чтобы гости приехали вовремя.",
    icon: icons.mapPin,
    chips: ["2GIS", "КАРТЫ"],
  },
  {
    num: 6,
    title: "Добавление музыки и создание праздничной атмосферы",
    headline: [
      { text: "ФОНОВАЯ МУЗЫКА.", mode: "solid" },
      { text: "АТМОСФЕРА ТОЯ", mode: "stroke" },
      { text: "С ПЕРВОГО КЛИКА.", mode: "solid" },
    ],
    sub: "Как загрузить любимый трек или выбрать фоновую композицию для автовоспроизведения.",
    icon: icons.music,
    chips: ["АУДИО", "АТМОСФЕРА"],
  },
  {
    num: 7,
    title: "Фотогалерея и Love Story в пригласительном",
    headline: [
      { text: "ФОТОГАЛЕРЕЯ.", mode: "solid" },
      { text: "LOVE STORY", mode: "stroke" },
      { text: "ДЛЯ ВАШИХ ГОСТЕЙ.", mode: "accent" },
    ],
    sub: "Загрузка качественных фото молодожёнов и оформление слайдера в мобильной версии.",
    icon: icons.heart,
    chips: ["ФОТО", "LOVE STORY"],
  },
  {
    num: 8,
    title: "Таймлайн и программа свадебного дня",
    headline: [
      { text: "ПРОГРАММА ДНЯ.", mode: "solid" },
      { text: "РАСПИСАНИЕ ТОЯ", mode: "stroke" },
      { text: "ДЛЯ ВСЕХ ГОСТЕЙ.", mode: "solid" },
    ],
    sub: "Сбор гостей, регистрация, беташар, тосты, торт — как составить понятный таймлайн.",
    icon: icons.calendar,
    chips: ["ТАЙМЛАЙН", "ПРОГРАММА"],
  },
  {
    num: 9,
    title: "Как отправлять именные ссылки в WhatsApp",
    headline: [
      { text: "ИМЕННЫЕ ШАҚЫРУ.", mode: "solid" },
      { text: "РАССЫЛКА WHATSAPP", mode: "stroke" },
      { text: "БЕЗ СПАМА.", mode: "accent" },
    ],
    sub: "Персональное обращение к каждому гостю: настройка и мгновенная отправка.",
    icon: icons.whatsapp,
    chips: ["WHATSAPP", "РАССЫЛКА"],
  },
  {
    num: 10,
    title: "Kaspi Тойбастар: прием поздравлений и подарков",
    headline: [
      { text: "KASPI ТОЙБАСТАР.", mode: "solid" },
      { text: "ПОДАРКИ И QR", mode: "stroke" },
      { text: "ПРЯМО В ШАҚЫРУ.", mode: "accent" },
    ],
    sub: "Как подключить номер или Kaspi QR для удобных поздравлений от гостей издалека.",
    icon: icons.qrCode,
    chips: ["KASPI", "ПОДАРКИ"],
  },
  {
    num: 11,
    title: "Дресс-код и пожелания по подаркам",
    headline: [
      { text: "ДРЕСС-КОД ТОЯ.", mode: "solid" },
      { text: "ПАЛИТРА ЦВЕТОВ", mode: "stroke" },
      { text: "И ПОЖЕЛАНИЯ.", mode: "solid" },
    ],
    sub: "Как стильно показать гостям палитру нарядов и деликатно указать формат подарков.",
    icon: icons.gift,
    chips: ["ДРЕСС-КОД", "СТИЛЬ"],
  },
  {
    num: 12,
    title: "Экспорт списка гостей в Excel для ресторана",
    headline: [
      { text: "ВЫГРУЗКА В EXCEL.", mode: "solid" },
      { text: "СПИСОК ГОСТЕЙ", mode: "stroke" },
      { text: "ДЛЯ РАССАДКИ.", mode: "accent" },
    ],
    sub: "Формирование финального отчета для администратора зала и декораторов за 1 клик.",
    icon: icons.barChart3,
    chips: ["EXCEL", "РЕСТОРАН"],
  },
  {
    num: 13,
    title: "Как редактировать пригласительное после отправки",
    headline: [
      { text: "ИЗМЕНЕНИЯ НА ЛЕТУ.", mode: "solid" },
      { text: "ПЕРЕНОС ВРЕМЕНИ", mode: "stroke" },
      { text: "БЕЗ ПЕРЕПЕЧАТКИ.", mode: "solid" },
    ],
    sub: "Что делать, если изменилось время или зал: правка данных без смены ссылки.",
    icon: icons.sparkles,
    chips: ["РЕДАКТИРОВАНИЕ", "ЛАЙФХАК"],
  },
  {
    num: 14,
    title: "Пригласительные на двух языках (қаз / рус)",
    headline: [
      { text: "ЕКІ ТІЛДЕ ШАҚЫРУ.", mode: "solid" },
      { text: "ҚАЗАҚША & РУССКИЙ", mode: "stroke" },
      { text: "АУЫСТЫРУ ТҮЙМЕСІ.", mode: "accent" },
    ],
    sub: "Как настроить переключение языков, чтобы каждому гостю было комфортно читать.",
    icon: icons.rings,
    chips: ["ҚАЗАҚША", "РУССКИЙ"],
  },
  {
    num: 15,
    title: "Особенности пригласительных на Қыз Ұзату",
    headline: [
      { text: "ҚЫЗ ҰЗАТУ.", mode: "solid" },
      { text: "НЕЖНЫЙ ДИЗАЙН", mode: "stroke" },
      { text: "И ТРАДИЦИИ.", mode: "accent" },
    ],
    sub: "Специфика текста, проводов невесты и оформления нежных оттенков шаблона.",
    icon: icons.heart,
    chips: ["ҚЫЗ ҰЗАТУ", "СВАДЬБА"],
  },
  {
    num: 16,
    title: "Пригласительные на Сүндет Той и Тұсау Кесер",
    headline: [
      { text: "СҮНДЕТ ТОЙ.", mode: "solid" },
      { text: "ТҰСАУ КЕСЕР", mode: "stroke" },
      { text: "ДЕТСКИЕ ПРАЗДНИКИ.", mode: "solid" },
    ],
    sub: "Яркие и стильные шаблоны для главных детских праздников в семье.",
    icon: icons.sparkles,
    chips: ["СҮНДЕТ ТОЙ", "ТҰСАУ КЕСЕР"],
  },
  {
    num: 17,
    title: "Пригласительные на Юбилей и Мерейтой",
    headline: [
      { text: "МЕРЕЙТОЙ 50/60 ЛЕТ.", mode: "solid" },
      { text: "СОЛИДНЫЙ СТИЛЬ", mode: "stroke" },
      { text: "ДЛЯ УВАЖАЕМЫХ.", mode: "accent" },
    ],
    sub: "Благородные золотые и изумрудные акценты, биография юбиляра и теплые пожелания.",
    icon: icons.champagne,
    chips: ["МЕРЕЙТОЙ", "ЮБИЛЕЙ"],
  },
  {
    num: 18,
    title: "Тарифы Suare: бесплатный старт и Pro-функции",
    headline: [
      { text: "ТАРИФЫ И ЦЕНЫ.", mode: "solid" },
      { text: "ВЫГОДА В 10 РАЗ", mode: "stroke" },
      { text: "ВМЕСТО БУМАГИ.", mode: "solid" },
    ],
    sub: "Сравнение возможностей Базового тарифа и безлимитного пакета с WhatsApp рассылкой.",
    icon: icons.barChart3,
    chips: ["ТАРИФЫ", "ЦЕНЫ"],
  },
  {
    num: 19,
    title: "Безопасность данных гостей и приватность ссылки",
    headline: [
      { text: "ПРИВАТНОСТЬ И БАЗА.", mode: "solid" },
      { text: "ДАННЫЕ ГОСТЕЙ", mode: "stroke" },
      { text: "ПОД ЗАЩИТОЙ.", mode: "accent" },
    ],
    sub: "Как Suare защищает номера телефонов и приватные семейные фотографии.",
    icon: icons.shieldCheck,
    chips: ["ЗАЩИТА", "ПРИВАТНОСТЬ"],
  },
  {
    num: 20,
    title: "Чек-лист идеальной подготовки к свадьбе и тою",
    headline: [
      { text: "ЧЕК-ЛИСТ ТОЯ.", mode: "solid" },
      { text: "ПОДГОТОВКА БЕЗ СТРЕССА", mode: "stroke" },
      { text: "ВМЕСТЕ С SUARE.", mode: "accent" },
    ],
    sub: "Сроки отправки шақыру, контрольные звонки, финальное подтверждение меню и рассадки.",
    icon: icons.checkCircle,
    chips: ["ЧЕК-ЛИСТ", "ФИНАЛ"],
  },
];

module.exports = {
  announcementPost,
  featuresCarousel,
  comparisonPost,
  howItWorksCarousel,
  youtubeLessons,
  nextPhoto,
};
