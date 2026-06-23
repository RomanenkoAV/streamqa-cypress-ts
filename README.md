# StreamQA Cypress TypeScript

Автоматизации тестирования B2B streaming-платформы. Репозиторий полностью автономный. Web-продукт на JavaScript, REST API и набор Cypress-тестов на TypeScript.

## Что реализовано

- UI-тесты авторизации и каталога
- API-тесты через `cy.request`
- Перехват и подмена трафика через `cy.intercept`
- Позитивные и негативные сценарии
- Проверка кодов ответа и структуры JSON
- Page Object
- Пользовательские Cypress-команды
- Fixtures
- Smoke и regression наборы
- Проверка mobile viewport
- Скриншоты и видео при запусках
- GitHub Actions
- GitLab CI
- Тест-план, тест-кейсы и пример баг-репорта

## Стек

- JavaScript
- TypeScript
- Cypress
- Node.js
- Express
- REST API
- HTML и CSS
- GitHub Actions
- GitLab CI

## Структура

```text
streamqa-cypress-ts
├── app
│   ├── public
│   │   ├── app.js
│   │   ├── index.html
│   │   └── styles.css
│   └── server.js
├── cypress
│   ├── e2e
│   │   ├── api.cy.ts
│   │   ├── auth.cy.ts
│   │   ├── catalog.cy.ts
│   │   ├── network.cy.ts
│   │   └── smoke.cy.ts
│   ├── fixtures
│   ├── pages
│   └── support
├── docs
│   ├── bug-report-example.md
│   ├── test-cases.md
│   └── test-plan.md
├── .github/workflows/cypress.yml
├── .gitlab-ci.yml
├── cypress.config.ts
├── package.json
└── tsconfig.json
```

## Требования

- Node.js 20 или новее
- npm

## Установка

```bash
npm install
```

## Полный запуск

Команда поднимает локальное приложение, дожидается его готовности и запускает все тесты.

```bash
npm test
```

## Интерактивный режим

Сначала запустить приложение.

```bash
npm start
```

В другом терминале открыть Cypress.

```bash
npm run cy:open
```

## Отдельные наборы

```bash
npm run test:smoke
npm run test:api
npm run typecheck
```

## Тестовый пользователь

```text
Email    qa@stream.local
Password Qwerty123!
```

## Ключевые решения

Тесты не зависят от внешних сайтов и API. Продуктовый стенд находится внутри проекта, поэтому репозиторий запускается локально и одинаково работает на компьютере разработчика и в CI.

Селекторы построены на `data-testid`. UI-логика вынесена в Page Object. Повторяющиеся действия оформлены как custom commands. Сетевые ошибки и нестабильные ответы воспроизводятся через `cy.intercept`.

API-проверки покрывают успешные ответы, валидацию, 401, 404 и создание сущностей. UI-проверки покрывают вход, каталог, поиск, фильтрацию, избранное, пустое состояние, 500 и мобильный viewport.
