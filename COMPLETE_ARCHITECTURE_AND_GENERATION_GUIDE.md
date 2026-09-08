# ПОЛНЫЙ АНАЛИЗ ПРОЕКТА KEZZO-SOCIALS И РУКОВОДСТВО ПО ВНЕДРЕНИЮ СИСТЕМЫ ГЕНЕРАЦИИ ФОТО И ВИДЕО

> **Назначение документа:**  
> 1. Детальный разбор архитектуры, скриптов, дизайна и пайплайнов проекта `kezzo-socials`.  
> 2. Пошаговое инженерное руководство по переносу этой схемы в собственную платформу для автоматической генерации фото- и видеоконтента студийного качества (с использованием современных AI-моделей, headless-рендеринга, Remotion и FFmpeg).

---

## СОДЕРЖАНИЕ

1. [Введение и фундаментальная концепция](#1-введение-и-фундаментальная-концепция)
2. [Архитектурный анализ проекта kezzo-socials](#2-архитектурный-анализ-проекта-kezzo-socials)
   - [2.1. Структура директорий и роли компонентов](#21-структура-директорий-и-роли-компонентов)
   - [2.2. Единая дизайн-система в коде (styles.css)](#22-единая-дизайн-система-в-коде-stylesscss)
   - [2.3. Алгоритм автоподбора верстки и сборка HTML (layout.js, generate.js, generate-youtube.js)](#23-алгоритм-автоподбора-верстки-и-сборка-html)
   - [2.4. Автономный движок рендеринга без зависимостей (capture.js)](#24-автономный-движок-рендеринга-без-зависимостей-capturejs)
   - [2.5. Движок интерактивных анимаций для Reels/TikTok (animacii-dlya-reels.html)](#25-движок-интерактивных-анимаций-для-reelstiktok)
   - [2.6. Стейджинг, захват экрана и регламент съемки](#26-стейджинг-захват-экрана-и-регламент-съемки)
   - [2.7. Синтез речи (TTS) и правила подготовки текста](#27-синтез-речи-tts-и-правила-подготовки-текста)
   - [2.8. Монтаж, звук и публикация контента](#28-монтаж-звук-и-публикация-контента)
3. [Сравнение: Что сделано в Kezzo vs Что нужно для автономной AI-платформы](#3-сравнение-что-сделано-в-kezzo-vs-что-нужно-для-автономной-ai-платформы)
4. [Целевая архитектура платформы генерации фото и видео](#4-целевая-архитектура-платформы-генерации-фото-и-видео)
   - [Уровень 1: Программная графика и шаблонизатор (Headless Chrome / Satori)](#уровень-1-программная-графика-и-шаблонизатор)
   - [Уровень 2: Генерация фотореалистичных изображений (Flux.1 / SDXL / ComfyUI)](#уровень-2-генерация-фотореалистичных-изображений)
   - [Уровень 3: Генерация динамического видео (Kling AI / Runway / Luma / Haiper)](#уровень-3-генерация-динамического-видео)
   - [Уровень 4: Синтез голоса, музыка и автосубтитры (ElevenLabs + Whisper)](#уровень-4-синтез-голоса-музыка-и-автосубтитры)
   - [Уровень 5: Композитинг и программный монтаж (Remotion + FFmpeg)](#уровень-5-композитинг-и-программный-монтаж)
5. [Инфраструктура и стек серверной части (Backend Architecture)](#5-инфраструктура-и-стек-серверной-части)
6. [Готовые примеры кода для внедрения](#6-готовые-примеры-кода-для-внедрения)
   - [6.1. Сервис рендеринга шаблонов в PNG (Node.js + Playwright)](#61-сервис-рендеринга-шаблонов-в-png)
   - [6.2. Сервис генерации AI-фото (Flux.1 via Fal.ai API)](#62-сервис-генерации-ai-фото)
   - [6.3. Сервис генерации AI-видео (Image-to-Video via Kling / Luma)](#63-сервис-генерации-ai-видео)
   - [6.4. Сервис синтеза речи и генерации таймкодов (ElevenLabs + Whisper)](#64-сервис-синтеза-речи-и-генерации-таймкодов)
   - [6.5. Сборка финального ролика через FFmpeg (Озвучка + Музыка + Видео + Оверлей)](#65-сборка-финального-ролика-через-ffmpeg)
   - [6.6. Программный видеомонтаж на Remotion (React-композиция)](#66-программный-видеомонтаж-на-remotion)
7. [Пошаговый план внедрения в свою платформу (Roadmap)](#7-пошаговый-план-внедрения-в-свою-платформу-roadmap)
8. [Экономика, тайминги и оптимизация затрат (Cost & Latency Breakdown)](#8-экономика-тайминги-и-оптимизация-затрат)

---

## 1. ВВЕДЕНИЕ И ФУНДАМЕНТАЛЬНАЯ КОНЦЕПЦИЯ

Проект `kezzo-socials` демонстрирует инженерный подход к маркетингу и контенту: **отказ от ручного рутинного дизайна в графических редакторах (Photoshop, Canva, Figma) в пользу программной генерации графики и медиа (Code-Driven Creative Pipeline)**.

### Главные принципы этого подхода:
1. **Единый источник правды (Single Source of Truth):**
   Все цвета, типографика, отступы, логотипы и графические эффекты завязаны на те же токены (CSS-переменные HSL), что и основной веб-продукт (`kezzo-frontend`). Пост в Instagram, обложка в YouTube и страница на сайте выглядят 1:1 в одной визуальной ДНК.
2. **Данные отделены от представления:**
   Тексты, иконки, счетчики, списки уроков и шаги хранятся в обычных JS-массивах объектов. Изменение одного слова в массиве мгновенно обновляет верстку десятков баннеров.
3. **Zero-Cost & Zero-Dependency Execution:**
   Рендеринг сотен изображений высокого разрешения выполняется через встроенный системный Google Chrome в безголовом (`--headless`) режиме без необходимости поднимать тяжелые node-модули типа Puppeteer.
4. **Универсальность медиа-ассетов (Double-Duty Assets):**
   Один и тот же сгенерированный кадр 1920×1080 служит одновременно:
   - Обложкой ролика на YouTube (Thumbnail);
   - 3-секундной заставкой (intro) и финальным титром (outro) на таймлайне видеомонтажа.

---

## 2. АРХИТЕКТУРНЫЙ АНАЛИЗ ПРОЕКТА KEZZO-SOCIALS

### 2.1. Структура директорий и роли компонентов

```
kezzo-socials/
├── src/                          # Исходная HTML-разметка слайдов и обложек
│   ├── shared/                   # Общие стили и статика
│   │   ├── styles.css            # Дизайн-система (токены, шум, сканы, типографика)
│   │   ├── logo-light.png        # Векторный/растровый светлый логотип
│   │   └── logo-dark.png         # Тёмный логотип
│   ├── instagram/                # Материалы для Instagram
│   │   ├── post/                 # Посты и карусели 1080×1350 (соотношение 4:5)
│   │   │   ├── 01-announcement.html
│   │   │   ├── 02-features/      # 8 слайдов карусели функций
│   │   │   ├── 03-pricing.html   # Сравнение тарифов Базовый vs Про
│   │   │   └── 04-how-it-works/  # 5 слайдов подключения к сервису
│   │   └── story/                # Сториз 1080×1920 (соотношение 9:16)
│   ├── tiktok/cover/             # Вертикальные обложки TikTok 1080×1920
│   │   └── 01-launch-cover.html
│   └── youtube/cover/            # Обложки YouTube 1920×1080 (соотношение 16:9)
│       ├── 00-playlist.html      # Обложка обучающего плейлиста
│       └── 01-...20-....html     # 20 уроков (номера соответствуют сценариям)
├── exports/                      # Скомпилированные PNG-изображения (зеркалит src/)
│   ├── instagram/
│   ├── tiktok/
│   └── youtube/
├── scripts/                      # Генераторы и утилиты автоматизации
│   ├── layout.js                 # Генератор компонентов: плашки, шрифты, SVG, автоскейлинг
│   ├── icons.js                  # Библиотека векторных путей SVG (Feather/Lucide style)
│   ├── generate.js               # Сборщик каруселей 02-features и 04-how-it-works
│   ├── generate-youtube.js       # Сборщик 20 обложек для YouTube
│   └── capture.js                # Безголовый рендер HTML -> PNG через Chrome CLI
├── props/                        # Реквизит для съемок
│   ├── chek-demo.html            # Демо-чек оплаты 1080×1560 для съемки экрана
│   └── photos/                   # Фотографии мастеров и салона
├── docs/                         # Производственная документация и сценарии
│   ├── index.html                # Интерактивное оглавление документации
│   ├── kak-zapisyvat-roliki.html # Инженерный регламент записи, OBS, монтаж, съемочные листы
│   ├── animacii-dlya-reels.html  # 6 интерактивных CSS-анимаций (9:16) для записи экрана
│   ├── scenarii-obuchayushchih-rolikov.html # 20 сценариев с таймкодами и текстом под озвучку
│   ├── scenarii-reels-i-posty.html          # 12 сценариев Reels и 10 идей постов
│   ├── youtube-nazvaniya-i-opisaniya.html   # Метаданные (Title, Description, Tags) для заливки
│   ├── kontent-plan.html         # Календарь на 8 недель и воронка тем
│   └── rekvizit-dlya-semki.html  # Полный список данных для ввода в кадре
└── HOW_TO_POST.md                # Готовые тексты постов, хэштеги, alt-теги и чек-лист
```

---

### 2.2. Единая дизайн-система в коде (`styles.css`)

Дизайн-система задает премиальную эстетику: глубокий темный фон, контрастный неоновый акцент (теплый оранжевый), технологичные засечки и процедурные текстуры.

#### 1. Цветовая модель в HSL-токенах
```css
:root {
  --background: 24 12% 7%;        /* Глубокий премиальный темно-коричневый графит */
  --foreground: 36 24% 94%;       /* Мягкий молочно-белый */
  --card: 24 10% 10%;             /* Карточки чуть светлее фона */
  --card-foreground: 36 24% 94%;
  --primary: 19 100% 55%;         /* Энергичный оранжевый (#FF5511) */
  --primary-foreground: 0 0% 100%;
  --muted-foreground: 30 8% 60%;  /* Приглушенный серо-бежевый для описаний */
  --border: 24 8% 16%;            /* Тонкие темные границы */
}
```

#### 2. Процедурный шум без загрузки файлов (SVG Data URI)
Вместо тяжелых растровых картинок шума используется процедурный фильтр SVG:
```css
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.07;
  mix-blend-mode: overlay;
  z-index: 2;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

#### 3. Эффект сканирующих линий (CRT Scanline)
```css
.scan-line {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background: repeating-linear-gradient(
    0deg, transparent 0px, transparent 3px,
    hsl(0 0% 0% / 0.12) 3px, hsl(0 0% 0% / 0.12) 4px
  );
}
```

#### 4. Решение бага контуров в кириллических шрифтах
Шрифт `Unbounded` в кириллице имеет перекрывающиеся контуры в глифах, из-за чего свойство `-webkit-text-stroke` прорисовывает паразитные линии внутри букв. Решение проекта:
```css
/* Для обводок текста используется Rubik 900 с монолитными контурами */
.text-stroke {
  font-family: "Rubik", "Unbounded", sans-serif;
  font-weight: 900;
  -webkit-text-stroke: 2px hsl(var(--foreground) / 0.4);
  color: transparent;
}
```

#### 5. Технологичные уголки (Cyberpunk Notches)
Вместо обычных скруглений используются угловые скобки видоискателя:
```css
.notch { position: relative; }
.notch::before, .notch::after {
  content: "";
  position: absolute;
  width: 22px;
  height: 22px;
  border: 2px solid hsl(var(--primary));
  pointer-events: none;
}
.notch::before { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.notch::after { bottom: -2px; right: -2px; border-left: none; border-top: none; }
```

#### 6. Обработка фоновых фото
Фотографии из Unsplash обесцвечиваются и затемняются, поверх накладывается градиент:
```css
.bg-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.4) brightness(0.4);
}
```

---

### 2.3. Алгоритм автоподбора верстки и сборка HTML

Файл `scripts/layout.js` реализует математический расчет размера заголовка во избежание выпадения текста за пределы фиксированного полотна:

```javascript
// Автоматический расчет font-size:
// Чтобы строка заголовка не переносилась хаотично, ширина строки не должна превышать 900px (1030px для 16:9).
// Жирный шрифт Rubik/Unbounded занимает ~0.85 * fontSize на символ:
const maxChars = Math.max(1, ...headlineLines.map((l) => l.text.length));
const fitSize = Math.floor(900 / (maxChars * 0.85));
const effectiveHeadlineSize = Math.min(headlineSize, fitSize);
```

#### Структура генерации:
1. `buildSlide(opts)` — для вертикальных постов Instagram (1080×1350) с нумерацией `01 / 08`, маркером раздела, иконкой, заголовком, текстом, плашками и футером.
2. `buildCover(opts)` — для горизонтальных обложек YouTube (1920×1080) с гигантским полупрозрачным фоновым номером урока (`yt-ghost-num`, font-size: 600px), большой плашкой иконки справа и длительностью ролика.

---

### 2.4. Автономный движок рендеринга без зависимостей (`capture.js`)

Ключевая инженерная особенность: скрипт рендерит **все** HTML в PNG без `npm install puppeteer`. Он вызывает установленный в системе Google Chrome:

```javascript
// Конвенция размеров по директориям:
function sizeFor(relDir) {
  if (relDir.startsWith(path.join("instagram", "post"))) return [1080, 1350];
  if (relDir.startsWith(path.join("instagram", "story"))) return [1080, 1920];
  if (relDir.startsWith(path.join("tiktok", "cover"))) return [1080, 1920];
  if (relDir.startsWith(path.join("youtube", "cover"))) return [1920, 1080];
  return [1080, 1350];
}

// Запуск Chrome через CLI с флагами:
execFileSync(
  CHROME_PATH,
  [
    "--headless",
    "--disable-gpu",
    `--screenshot=${outPath}`,
    `--window-size=${w},${h}`,
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=8000",   // Ожидание 8 секунд для полной загрузки шрифтов Google Fonts
    fileUrl,
  ],
  { stdio: "pipe" }
);
```

---

### 2.5. Движок интерактивных анимаций для Reels/TikTok (`animacii-dlya-reels.html`)

В файле `docs/animacii-dlya-reels.html` созданы 6 готовых анимированных интерфейсов формата 9:16 на чистом CSS:
1. **Онлайн-запись:** Клиент кликает на выбор услуги, затем мастера, затем слот времени.
2. **Депозит через Kaspi QR:** Имитация сканирования QR-кода и появления зеленой галочки успеха.
3. **Хаос в WhatsApp:** Экран переполняется всплывающими сообщениями «вы где?», «запишите меня», сменяющимися кнопкой «Запись в 1 клик».
4. **Push-уведомление:** Сверху выпадает нативное уведомление «Напоминание о визите завтра в 14:00».
5. **Заполнение расписания:** Календарная сетка на глазах окрашивается оранжевыми записями.
6. **Тарифная сетка:** Анимация изменения цены в зависимости от количества кресел.

Все анимации используют CSS Container Queries (`cqw`), что позволяет масштабировать их под любой размер экрана без искажений.

---

### 2.6. Стейджинг, захват экрана и регламент съемки

В файле `docs/kak-zapisyvat-roliki.html` описан производственный стандарт:
- **Демо-база вместо живой:** Запуск сидера `node --import tsx scripts/seed-demo-barbershop.ts` наполняет систему реалистичными услугами, мастерами и расписанием, исключая утечку персональных данных реальных клиентов.
- **Масштаб браузера 125%:** При стандартных 100% интерфейс на мобильных устройствах не читается.
- **Параметры OBS:**
  - Разрешение: 1920×1080, 60 fps;
  - Битрейт: 12 000 Kbps (x264 или NVENC);
  - Режим: захват экрана целиком (Display Capture), а не отдельного окна;
  - Запись ведется без звука непрерывным длинным дублем (Split на монтаже).
- **Съемка мобильного экрана в 16:9:**
  Вертикальная запись с телефона вставляется по центру, а по краям накладывается та же запись, растянутая на 100% и размытая (Gaussian blur), чтобы избежать черных полос.

---

### 2.7. Синтез речи (TTS) и правила подготовки текста

В `docs/scenarii-obuchayushchih-rolikov.html` и методичке сформулированы правила написания текстов под ИИ-озвучку:
1. **Длина предложений:** До 8–10 слов. У синтезаторов нет дыхания, длинные фразы звучат монотонно и неестественно.
2. **Фонетическая адаптация:** Специфические названия пишутся так, как произносятся: *«Кэззо»*, *«Кэспи»*, *«Вотсап»*.
3. **Дробление на файлы:** Генерация ведется по абзацам (файлы `01-01.wav`, `01-02.wav`). На монтаже звуковые дорожки легко двигаются под события на экране.
4. **Скорость синтеза:** 0.95–1.0x (замедленная речь звучит убедительнее и понятнее).

---

### 2.8. Монтаж, звук и публикация контента

- **Баланс громкости (Audio Ducking):**
  - Голос диктора: **−6 dB** (компрессированный, четкий);
  - Фоновая музыка: **−26 dB** (едва слышная подложка, маскирующая артефакты машинной речи).
- **Субтитры:** Обязательны для всех вертикальных роликов (80% пользователей смотрят без звука).
- **Обрезка задержек:** Любая пауза без действия дольше 1 секунды удаляется на монтаже.

---

## 3. СРАВНЕНИЕ: ЧТО СДЕЛАНО В KEZZO VS ЧТО НУЖНО ДЛЯ АВТОНОМНОЙ AI-ПЛАТФОРМЫ

| Компонент | Как в `kezzo-socials` (Ручной / Скриптовый) | Как должно быть в платформе (AI / Автономный SaaS) |
|---|---|---|
| **Генерация баннеров** | Локальный запуск Node.js скрипта + Chrome CLI | REST API микросервис на Playwright / Chromium в Docker / AWS Lambda |
| **Фоновые изображения** | Статический массив из 5 ссылок на Unsplash | AI-генерация фотореалистичных картинок по промпту (FLUX.1 / SDXL / Midjourney) |
| **Видео-контент** | Ручная запись экрана в OBS + ручной монтаж в CapCut | Автоматическая генерация AI-видео (Kling, Runway, Luma) + программный монтаж в Remotion |
| **Озвучка** | Ручной ввод текста в сторонний веб-синтезатор речи | Интеграция по API (ElevenLabs / Cartesia / OpenAI TTS) |
| **Сборка ролика** | Монтажер в CapCut режет дорожки руками | Рендер-ферма FFmpeg / Remotion собирает MP4 из ассетов по JSON-схеме |
| **Масштабируемость** | 1 оператор на 1 проект | Тысячи пользователей генерируют контент параллельно через очередь задач (BullMQ) |

---

## 4. ЦЕЛЕВАЯ АРХИТЕКТУРА ПЛАТФОРМЫ ГЕНЕРАЦИИ ФОТО И ВИДЕО

Для внедрения подобного функционала в свой продукт создается модульная 5-уровневая архитектура:

```
                      ┌────────────────────────────────────────┐
                      │          WEB UI / CLIENT APP           │
                      │  (Создать пост / ролик / презентацию)  │
                      └──────────────────┬─────────────────────┘
                                         │ REST API / GraphQL
                                         ▼
                      ┌────────────────────────────────────────┐
                      │             API GATEWAY                │
                      │       (Auth, Validation, Billing)      │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │       TASK QUEUE (Redis + BullMQ)      │
                      └────┬─────────────┬─────────────┬───────┘
                           │             │             │
              ┌────────────┘             │             └────────────┐
              ▼                          ▼                          ▼
   ┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
   │  IMAGE GENERATOR   │     │  VOICE & SUBTITLE  │     │  VIDEO GENERATOR   │
   │  (Flux.1 / SDXL /  │     │   (ElevenLabs +    │     │   (Kling / Luma /  │
   │  Headless Canvas)  │     │   Whisper STT)     │     │   Runway Gen-3)    │
   └──────────┬─────────┘     └──────────┬─────────┘     └──────────┬─────────┘
              │                          │                          │
              └──────────────────┬───────┴──────────────────────────┘
                                 ▼
                      ┌────────────────────────────────────────┐
                      │     COMPOSITOR & RENDER ENGINE         │
                      │     (Remotion / FFmpeg Serverless)     │
                      │ - Наложение текста, титров, шума       │
                      │ - Склейка интро, аутро, музыки         │
                      │ - Рендеринг финального MP4             │
                      └──────────────────┬─────────────────────┘
                                         │
                                         ▼
                      ┌────────────────────────────────────────┐
                      │    STORAGE & CDN (Cloudflare R2 / S3)  │
                      └──────────────────┬─────────────────────┘
                                         │ Webhook / Socket
                                         ▼
                      ┌────────────────────────────────────────┐
                      │      ГОТОВЫЙ РЕЗУЛЬТАТ ДЛЯ КЛИЕНТА     │
                      └────────────────────────────────────────┘
```

---

### Уровень 1: Программная графика и шаблонизатор
- **Задача:** Генерация брендированных плашек, обложек, слайдов карусели, инфографики.
- **Инструменты:**
  - **Playwright / Puppeteer:** Запуск Chromium внутри Docker-контейнера.
  - **Satori (@vercel/satori):** Сверхбыстрая генерация SVG из JSX/HTML без запуска браузера (идеально для баннеров с текстом за 50 миллисекунд).
  - **HTML/CSS дизайн-система:** Взять за основу подход `kezzo-socials` (CSS-переменные, темная тема, SVG-фильтры шума).

### Уровень 2: Генерация фотореалистичных изображений
- **Задача:** Создание фонов, предметных фотографий, реалистичных персонажей и сцен.
- **Выбор моделей на 2026 год:**
  1. **FLUX.1 (Schnell / Dev):** Лучшая в мире модель по анатомии рук, фотореализму и точности рендеринга текста внутри картинки. Доступна через API (Fal.ai, Replicate, Together AI) или self-hosted на GPU (от 16 GB VRAM).
  2. **Ideogram 2.0:** Безупречный рендеринг типографики и постеров прямо внутри изображения.
  3. **Midjourney v6.1:** Топовая эстетика, доступна через неофициальные API (GoAPI / TheNextLeg) или корпоративные интеграции.
- **Сохранение фирменного стиля (Brand/Face Consistency):**
  - Обучение персональной **LoRA** (Low-Rank Adaptation) на фото вашего продукта/мастера/логотипа;
  - Использование **IP-Adapter** и **ControlNet** для жесткой фиксации позы и контуров.

### Уровень 3: Генерация динамического видео
- **Задача:** Превращение статичных кадров в живые кинематографичные видеоролики для Reels, TikTok, YouTube Shorts.
- **Выбор моделей:**
  1. **Kling AI (v1.5 / v2):** Невероятный реализм физики, движений человека и динамики ткани/волос. 5–10 секундные клипы в 1080p.
  2. **Runway Gen-3 Alpha:** Кинематографичные пролеты камеры, кинематографический свет, отличный Camera Control.
  3. **Luma Dream Machine:** Высокая скорость генерации, качественный Image-to-Video.
  4. **MiniMax (Hailuo AI):** Отличная физика лиц и высокая детализация.
- **Золотой пайплайн (Image-to-Video):**
  Не генерируйте видео сразу из текста (Text-to-Video дает случайный результат). Сначала сгенерируйте точный идеальный кадр в Flux.1 (Image), согласуйте композицию, а затем отправьте его как входной кадр в Kling/Runway (Image-to-Video) с промптом движения камеры.

### Уровень 4: Синтез голоса, музыка и автосубтитры
- **Voiceover (Озвучка):**
  - **ElevenLabs API:** Лидер рынка. Модели `multilingual_v2` говорят на чистом русском/казахском без машинного акцента, с естественным дыханием и интонациями. Доступно мгновенное клонирование голоса (Voice Cloning) за 1 минуту записи.
  - Альтернатива: **OpenAI Audio TTS** (модель `tts-1-hd`) или сверхбыстрый **Cartesia Sonic**.
- **Караоке-субтитры с точностью до слова:**
  - **Whisper (faster-whisper):** Транскрибирует сгенерированный аудиофайл и выдает таймкод каждого отдельного слова (`word_timestamps=True`).
  - Данные слова накладываются на видео с динамической подсветкой текущего слова (стиль MrBeast / Alex Hormozi).
- **Фоновая музыка:**
  - Набор предзагруженных лицензионных треков с разбивкой по настроению (Lo-Fi, Phonk, Business, Tech);
  - Автоматическое приглушение музыки под голос (Audio Ducking) через FFmpeg.

### Уровень 5: Композитинг и программный монтаж
- **Remotion (remotion.dev):**
  Фреймворк номер один в мире для программного создания видео на **React**.
  Вы описываете видео как React-компоненты:
  `<Sequence from={0} durationInFrames={90}><IntroCard /></Sequence>`
  Remotion запускает рендеринг через headless браузер и выдает идеальный MP4 с частотой 60 fps, анимациями CSS, оверлеями и титрами.
- **FFmpeg (CLI / fluent-ffmpeg):**
  Для тяжелых серверных склеек, сжатия, конвертации форматов и наложения звуковых дорожек.

---

## 5. ИНФРАСТРУКТУРА И СТЕК СЕРВЕРНОЙ ЧАСТИ

Для стабильной работы платформы под нагрузкой требуется следующий стек:

### 1. Серверная часть (Backend API)
- **Node.js (TypeScript) + Fastify / NestJS** или **Python (FastAPI)**.
- **Очередь задач (Queue Worker):** **BullMQ + Redis**.  
  *Критически важно:* генерация видео нейросетью занимает от 60 до 240 секунд. Запрос пользователя не может висеть открытым. Клиент создает задачу, получает `jobId`, а сервер через WebSocket / Server-Sent Events (SSE) отправляет статус прогресса (10% -> 40% -> 100%).

### 2. Хранилище файлов (Object Storage)
- **Cloudflare R2** или **AWS S3 / MinIO**.
- Cloudflare R2 рекомендуется, так как у него **0$ за исходящий трафик (No Egress Fees)**, что критично для тяжелого видеоконтента.

### 3. База данных
- **PostgreSQL + Prisma ORM**:
  Таблицы: `Users`, `Projects`, `Templates`, `GenerationJobs`, `Assets` (фото, аудио, видео).

---

## 6. ГОТОВЫЕ ПРИМЕРЫ КОДА ДЛЯ ВНЕДРЕНИЯ

### 6.1. Сервис рендеринга шаблонов в PNG
*(Аналог `capture.js` на современном стеке Playwright для серверного использования)*

```typescript
// services/renderer.service.ts
import { chromium, Browser } from 'playwright';

let browser: Browser | null = null;

export async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });
  }
  return browser;
}

interface RenderOptions {
  html: string;
  width: number;
  height: number;
}

export async function renderHtmlToPng(options: RenderOptions): Promise<Buffer> {
  const b = await getBrowser();
  const context = await b.newContext({
    viewport: { width: options.width, height: options.height },
    deviceScaleFactor: 1
  });
  
  const page = await context.newPage();
  
  // Устанавливаем контент и ждем подгрузки всех веб-шрифтов
  await page.setContent(options.html, { waitUntil: 'networkidle' });
  await page.evaluateHandle('document.fonts.ready');

  const buffer = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: options.width, height: options.height }
  });

  await context.close();
  return buffer;
}
```

---

### 6.2. Сервис генерации AI-фото
*(Генерация фотореалистичного фона через Fal.ai FLUX.1)*

```typescript
// services/ai-image.service.ts
import { fal } from "@fal-ai/client";

// Установите FAL_KEY в переменных окружения
export async function generatePhoto(prompt: string, aspectRatio: "4:5" | "9:16" | "16:9" = "9:16"): Promise<string> {
  const result: any = await fal.subscribe("fal-ai/flux/dev", {
    input: {
      prompt: `Editorial dark aesthetic, high-end photography, ${prompt}, 8k resolution, photorealistic, cinematic lighting, shot on 35mm lens`,
      image_size: aspectRatio === "9:16" ? "portrait_16_9" : aspectRatio === "16:9" ? "landscape_16_9" : "square_hd",
      num_inference_steps: 28,
      guidance_scale: 3.5,
      enable_safety_checker: false
    },
    logs: true,
    onQueueUpdate: (update) => {
      console.log("Queue status:", update.status);
    },
  });

  // Возвращает прямую ссылку на сгенерированный PNG
  return result.data.images[0].url;
}
```

---

### 6.3. Сервис генерации AI-видео
*(Оживление сгенерированного фото через Image-to-Video)*

```typescript
// services/ai-video.service.ts
import { fal } from "@fal-ai/client";

export async function generateVideoFromImage(imageUrl: string, motionPrompt: string): Promise<string> {
  // Пример использования модели Luma Dream Machine через Fal.ai
  const result: any = await fal.subscribe("fal-ai/luma-dream-machine/image-to-video", {
    input: {
      prompt: `Smooth cinematic slow camera zoom, dynamic motion, ${motionPrompt}`,
      image_url: imageUrl,
      aspect_ratio: "9:16",
      loop: false
    },
    logs: true
  });

  // Возвращает ссылку на сгенерированный MP4 (5 секунд, 1080p)
  return result.data.video.url;
}
```

---

### 6.4. Сервис синтеза речи и генерации таймкодов
*(Синтез в ElevenLabs с последующей разметкой слов)*

```typescript
// services/voice.service.ts
import axios from 'axios';
import fs from 'fs';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // ID выбранного диктора (или клонированного голоса)

export async function synthesizeSpeech(text: string, outputPath: string): Promise<void> {
  const response = await axios({
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    data: {
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.1,
        use_speaker_boost: true
      }
    },
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
```

---

### 6.5. Сборка финального ролика через FFmpeg
*(Склейка: Интро-кадр + AI-видео + Голос + Фоновая музыка с дакингом + Выходной MP4)*

```bash
# Bash-команда для сборки готового видео:
ffmpeg -y \
  -loop 1 -t 2 -i intro.png \
  -i ai_video.mp4 \
  -i voiceover.mp3 \
  -i background_music.mp3 \
  -filter_complex "
    [0:v]scale=1080:1920,setsar=1[v0];
    [1:v]scale=1080:1920,setsar=1[v1];
    [v0][v1]concat=n=2:v=1:a=0[v_concat];
    [3:a]volume=0.05[bg_music];
    [2:a]volume=1.0[voice];
    [voice][bg_music]amix=inputs=2:duration=first[a_out]
  " \
  -map "[v_concat]" \
  -map "[a_out]" \
  -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -shortest output_final.mp4
```

---

### 6.6. Программный видеомонтаж на Remotion
*(Декларативное описание видео-композиции на React)*

```tsx
// remotion/Composition.tsx
import { AbsoluteFill, Sequence, Video, Audio, Img, interpolate, useCurrentFrame } from 'remotion';

export const MarketingShortVideo = ({
  videoUrl,
  voiceUrl,
  musicUrl,
  title,
  kicker,
}: {
  videoUrl: string;
  voiceUrl: string;
  musicUrl: string;
  title: string;
  kicker: string;
}) => {
  const frame = useCurrentFrame();

  // Анимация плавного приближения камеры (Ken Burns effect)
  const scale = interpolate(frame, [0, 150], [1, 1.08]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0D11' }}>
      {/* 1. Сгенерированное AI-видео на фоне */}
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <Video src={videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>

      {/* 2. Наложение брендового шума и затемнения */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(11,13,17,0.7) 0%, rgba(11,13,17,0.3) 50%, rgba(11,13,17,0.9) 100%)',
        }}
      />

      {/* 3. Анимированная брендовая плашка (стиль Kezzo) */}
      <AbsoluteFill style={{ padding: 64, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: '#FF5511' }} />
          <span style={{ fontFamily: 'JetBrains Mono', color: '#FF5511', fontSize: 24, letterSpacing: '0.2em' }}>
            {kicker}
          </span>
        </div>

        <div style={{ marginBottom: 120 }}>
          <h1 style={{ fontFamily: 'Unbounded', fontSize: 64, color: '#FFFFFF', lineHeight: 1.15 }}>
            {title}
          </h1>
        </div>
      </AbsoluteFill>

      {/* 4. Аудио-дорожки */}
      <Audio src={voiceUrl} volume={1.0} />
      <Audio src={musicUrl} volume={0.08} />
    </AbsoluteFill>
  );
};
```

---

## 7. ПОШАГОВЫЙ ПЛАН ВНЕДРЕНИЯ В СВОЮ ПЛАТФОРМУ (ROADMAP)

### Фаза 1: Инфраструктура статической графики (1–2 недели)
- [ ] Перенести дизайн-систему (`styles.css`, шрифты, SVG-фильтры) в шаблонизатор платформы;
- [ ] Развернуть микросервис скриншотов на Playwright в Docker;
- [ ] Реализовать API эндпоинт `POST /api/v1/generate/banner`, принимающий JSON `{ title, kicker, badge, format }` и отдающий готовый PNG;
- [ ] Внедрить алгоритм автоскейлинга текста из `layout.js`, чтобы длинные строки не ломали верстку.

### Фаза 2: Интеграция генерации AI-фотографий (1–2 недели)
- [ ] Подключить аккаунт Fal.ai или Replicate для доступа к **FLUX.1**;
- [ ] Собрать библиотеку проверенных системных промптов (System Prompts) под специфику вашего бизнеса (салоны красоты, автосервисы, недвижимость, рестораны);
- [ ] Настроить автоматическое наложение брендовых оверлеев поверх сгенерированных фото (градиент, шум, логотип).

### Фаза 3: Аудио-конвейер и субтитры (1 неделя)
- [ ] Интегрировать **ElevenLabs API** для генерации дикторского голоса;
- [ ] Добавить в бэкенд микросервис транскрибации на базе **Whisper**, генерирующий JSON с таймкодами каждого слова для динамических караоке-субтитров;
- [ ] Собрать библиотеку треков без роялти для фоновой музыки.

### Фаза 4: Генерация AI-видео и монтаж (2–3 недели)
- [ ] Интегрировать API моделей **Kling / Runway / Luma** по схеме Image-to-Video;
- [ ] Развернуть **Remotion** (через `@remotion/lambda` на AWS или локальный контейнер) для программного рендеринга видео;
- [ ] Создать 3–5 базовых шаблонов динамических роликов (Reels/Shorts 9:16 и YouTube 16:9).

### Фаза 5: Очереди, биллинг и UI пользователя (2 недели)
- [ ] Настроить очередь задач на **BullMQ + Redis** с поддержкой вебхуков завершения;
- [ ] Разработать удобный фронтенд: предпросмотр кадров, выбор диктора, выбор соотношения сторон (1:1, 4:5, 9:16, 16:9);
- [ ] Настроить сохранение готовых файлов в хранилище **Cloudflare R2** с раздачей через быстрый CDN.

---

## 8. ЭКОНОМИКА, ТАЙМИНГИ И ОПТИМИЗАЦИЯ ЗАТРАТ

### Средняя себестоимость генерации 1 единицы контента (через Cloud API):

| Тип контента | Модели / Инструменты | Время генерации | Примерная себестоимость |
|---|---|---|---|
| **Графический баннер (PNG)** | Playwright / Headless Chrome | 0.3 – 1.0 сек | **$0.0001** (только стоимость CPU) |
| **AI-фотография (HD)** | FLUX.1 Schnell / Dev via Fal.ai | 1.5 – 4.0 сек | **$0.003 – $0.025** |
| **Озвучка (30 сек)** | ElevenLabs Multilingual | 1.0 – 2.5 сек | **$0.015 – $0.030** |
| **AI-видео (5 сек, 1080p)** | Kling AI / Luma Dream Machine | 60 – 180 сек | **$0.15 – $0.35** |
| **Финальный монтаж ролика** | Remotion Lambda / FFmpeg | 15 – 30 сек | **$0.005 – $0.015** |
| **ИТОГО: Полный видеоролик Reels** | Фото + Видео + Озвучка + Монтаж | **~2 – 3 мин** | **~$0.20 – $0.45** |

### Рекомендации по масштабированию и экономии:
1. **Кэширование фонов:** Не генерируйте новое AI-изображение, если промпт совпадает с недавним — сохраняйте базу проверенных генераций в S3 и переиспользуйте их для разных клиентов.
2. **Гибридный рендеринг:** Используйте бесплатный Playwright для статичных слайдов и текстовых карточек, а AI-видео подключайте только для премиальных динамических сценариев.
3. **Пакетная генерация (Batch Processing):** Ночью или в фоновом режиме генерируйте контент-планы на неделю вперед, чтобы пользователь не ждал генерации онлайн.
