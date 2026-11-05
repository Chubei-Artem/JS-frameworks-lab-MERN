# Fullstack Web Store — Лабораторна робота №5 (Node.js & MongoDB Atlas)

Повноцінний Fullstack-вебзастосунок інтернет-магазину електроніки з клієнтською частиною на **React**, модульним REST API на **Node.js + Express**, хмарною базою даних **MongoDB Atlas** через **Mongoose ODM**, валідацією вхідних даних та розгортанням сервісів у хмарі на платформі **Render.com**.

---

## 🚀 Демонстрація та розгортання
- **Frontend Live Demo:** -
- **Backend REST API:** -
- **GitHub Repository:** Монорепозиторій із роздільними сервісами клієнта та сервера.

---

## 🛠 Технологічний стек

### Client (Frontend)
- **Фреймворк:** React 18, Vite
- **Стилізація:** Модульний чистий CSS3 (CSS Variables, Flexbox, CSS Grid, Radial Neon Glow Effect)
- **HTTP-клієнт:** Axios
- **Контейнеризація:** Docker (Multi-stage build: Node.js Alpine + Nginx Alpine)

### Server (Backend)
- **Платформа:** Node.js (ES Modules)
- **Вебфреймворк:** Express.js
- **База даних:** MongoDB Atlas (хмарний NoSQL кластер M0)
- **ODM:** Mongoose (валідація схем, типізація, віртуальні поля)
- **Безпека та CORS:** `cors` із білим списком дозволених джерел (`CLIENT_ORIGINS`), `dotenv` для конфігурації секретів
- **Валідація:** Проміжний обробник (middleware) для попередньої перевірки цілісності даних

---

## 📂 Архітектура та структура монорепозиторію

Проєкт побудовано за принципом монорепозиторію з чітким розділенням фронтенду та бекенду:

```text
├── react-store/                  # Frontend-додаток (React + Vite + Docker)
│   ├── src/
│   │   ├── components/           # UI-компоненти (ProductCard, AddProductForm, Cart тощо)
│   │   ├── App.jsx               # Головний компонент, стан та взаємодія з бекендом
│   │   └── App.css               # Теми та стилі
│   ├── Dockerfile                # Multi-stage конфігурація для продакшн-образу
│   └── package.json
│
├── react-store-backend/          # Backend-сервіс (Node.js + Express + Mongoose)
│   ├── controllers/
│   │   └── productController.js  # Бізнес-логіка виконання CRUD-операцій
│   ├── middleware/
│   │   └── validate.js           # Перевірка тіла запитів (HTTP 400 Bad Request)
│   ├── models/
│   │   └── Product.js            # Mongoose-схема товару з атрибутами трекінгу
│   ├── routes/
│   │   └── productRoutes.js      # Ендпоінти REST API
│   ├── services/
│   │   └── db.js                 # Підключення до MongoDB Atlas через Mongoose
│   ├── seed.js                   # Скрипт автоматичного перенесення даних з db.json у хмару
│   ├── server.js                 # Точка входу Express-сервера та налаштування CORS
│   └── package.json
│
├── .gitignore                    # Захист чутливих файлів (.env, node_modules)
└── README.md
```

---

## 📡 REST API Специфікація

Всі маршрути доступні за базовим префіксом `/products`.

| Метод | Маршрут | Опис | Тіло запиту (Body) / Параметри | Статус відповіді |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/products` | Отримання всього списку товарів з бази | Відсутнє | `200 OK` |
| **POST** | `/products` | Додавання нового товару (з валідацією) | JSON із полями `title`, `price`, `category`, `stock`, `description` | `201 Created` / `400 Bad Request` |
| **PUT** | `/products/:id` | Редагування наявного товару за його ID | Оновлені поля товару | `200 OK` / `404 Not Found` |
| **DELETE** | `/products/:id` | Видалення товару за його ID | Відсутнє | `200 OK` / `404 Not Found` |

### Модель товару (Mongoose Schema з трекінгом):
```json
{
  "id": "6aec61ff5448011602ef585c",
  "title": "Механічна клавіатура Keychron K2",
  "price": 3800,
  "category": "Peripherals",
  "stock": 7,
  "imageUrl": "https://images.unsplash.com/...",
  "description": "Бездротова клавіатура з перемикачами Gateron Brown.",
  "status": "in_stock",
  "createdAt": "2026-10-12",
  "views": 45
}
```

---

## ⚙️ Локальний запуск та тестування

### 1. Клонування репозиторію
```powershell
git clone <URL_ВАШОГО_РЕПОЗИТОРІЮ>
cd <ПАПКА_РЕПОЗИТОРІЮ>
```

### 2. Запуск бекенду (`react-store-backend`)
1. Перейдіть до папки бекенду та встановіть залежності:
   ```powershell
   cd react-store-backend
   npm install
   ```
2. Створіть файл `.env` у корені папки `react-store-backend`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shop?retryWrites=true&w=majority
   CLIENT_ORIGINS=http://localhost:5173,https://your-frontend.onrender.com
   ```
3. За потреби завантажте початкові товари з `db.json` у базу:
   ```powershell
   node seed.js
   ```
4. Запустіть сервер:
   ```powershell
   npm run dev
   ```
   Сервер запуститься на порті `5000` з повідомленням `MongoDB connected successfully`.

### 3. Запуск фронтенду (`react-store`)
1. У новому вікні термінала перейдіть до клієнтської частини:
   ```powershell
   cd ../react-store
   npm install
   ```
2. Запустіть клієнт:
   ```powershell
   npm run dev
   ```
   Відкрийте в браузері `http://localhost:5173`. Клієнт автоматично відправлятиме CRUD-запити на локальний Node.js бекенд.

---

## ☁️ Розгортання на Render.com

1. **Backend Web Service:**
   - **Root Directory:** `react-store-backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `MONGO_URI` = рядок підключення до MongoDB Atlas
     - `CLIENT_ORIGINS` = дозволені URL-адреси фронтенду

2. **Frontend Web Service (Docker):**
   - **Root Directory:** `react-store`
   - **Environment:** Docker (збірка на основі вкладеного `Dockerfile`)