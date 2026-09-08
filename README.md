# SUARE Social (`suare-social`)

> Автономная медиа-студия и пайплайн генерации контента для социальных сетей платформы **SUARE** ([suare.app](https://suare.app)). Автоматически генерирует дизайнерские промо-посты, карусели, Reels, TikTok и YouTube Shorts по данным мероприятий и шаблонов.

---

## 🚀 Архитектура и возможности

- **Code-Driven Layout:** Генерация графических ассетов высокого разрешения с помощью HTML/Canvas и Playwright (`scripts/layout.js`, `scripts/capture.js`).
- **Многоформатный рендер:**
  - Instagram Post / Carousel (4:5, 1080×1350)
  - Stories, Reels, TikTok (9:16, 1080×1920)
  - YouTube Shorts (9:16) и баннеры YouTube (16:9, 1280×720)
- **Мультиплатформенная публикация:**
  - Instagram Graph API (Reels, посты, карусели)
  - Threads API
  - TikTok Content Posting API
  - YouTube Data API v3
  - Интеграция с локальным `n8n` (`n8n/suare-socials-workflow.json`) для визуального управления графиком публикаций

---

## 🛠️ Запуск генерации

```bash
# Установка зависимостей
npm install

# Генерация всех форматов сразу
npm run generate

# Генерация по отдельным платформам
npm run generate:ig    # Instagram (пост + сторис)
npm run generate:yt    # YouTube (обложка + Shorts)
npm run generate:tt    # TikTok
```

Готовые графические файлы сохраняются в директорию `exports/`.

---

## 📖 Документация и руководства

- [COMPLETE_ARCHITECTURE_AND_GENERATION_GUIDE.md](file:///c:/Users/Akim.O/Documents/Личные/проект/suare%20new/suare-social/COMPLETE_ARCHITECTURE_AND_GENERATION_GUIDE.md) — Полное техническое описание движка генерации и архитектуры рендеринга.
- [HOW_TO_POST.md](file:///c:/Users/Akim.O/Documents/Личные/проект/suare%20new/suare-social/HOW_TO_POST.md) — Пошаговое руководство по настройке API ключей и публикации в каждую соцсеть.
- `n8n/suare-socials-workflow.json` — Готовый воркфлоу для автоматического постинга через n8n.
