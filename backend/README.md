# Banking-System
A simple Spring Boot backend built to sit behind the securebank-app frontend. It covers registration/login (JWT), accounts, transactions, money transfers (with an OTP confirmation step, like the frontend's OTP modal), and cards.

> **Heads up about the frontend:** every page in `securebank-app` currently runs on hardcoded
mock data and `setTimeout()` (see `assets/js/login.js`, `transfer.js`, etc.) — there isn’t a
single `fetch()` call in the repo yet. This backend gives you real endpoints to call; you’ll
need to add the `fetch()` calls into those JS files yourself (an example is at the bottom of
this file for `login.js` to get you started).
> 

## Tech stack

- Java 17, Spring Boot 3.3
- Spring Web, Spring Security (JWT, stateless), Spring Data JPA
- PostgreSQL (persistent database)

## Running it

Requires JDK 17+, Maven, and a running PostgreSQL instance.

1. Create the database (once):
    
    ```bash
    createdb securebank
    # or via psql:
    # CREATE DATABASE securebank;
    ```
    
2. Configure connection (defaults work for local Postgres with user/password `postgres`):
    - `SPRING_DATASOURCE_URL` — default `jdbc:postgresql://localhost:5432/securebank`
    - `SPRING_DATASOURCE_USERNAME` — default `postgres`
    - `SPRING_DATASOURCE_PASSWORD` — default `postgres`
    
    Or edit `src/main/resources/application.properties` directly.
    
3. Start the API:
    
    ```bash
    cd securebank-backend
    mvn spring-boot:run
    ```
    
    (No wrapper is bundled, so use your own `mvn`, or import the folder as a Maven project into
    IntelliJ/Eclipse/VS Code and run `SecurebankApiApplication`.)
    

The API starts on `http://localhost:8080`. A demo user is seeded automatically on first run
(if the DB is empty):

- **username:** `admin`
- **password:** `123456`

(This matches the hardcoded demo credentials in the original `login.js` mock.)

Tables are created/updated automatically via Hibernate (`ddl-auto=update`).

### CORS

Edit `app.cors.allowed-origins` in `application.properties` to match wherever you’re serving the
static frontend from (e.g. VS Code Live Server, `python -m http.server`, etc.).

## Auth

All endpoints except `/api/auth/**` require a `Authorization: Bearer <token>` header.

| Method | Endpoint | Body | Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | `{fullName, username, password, email, phone}` | Creates the user + one checking account (opening balance 5,000 EGP), returns a JWT |
| POST | `/api/auth/login` | `{username, password}` | Returns a JWT |

## Accounts

| Method | Endpoint |
| --- | --- |
| GET | `/api/accounts` — all accounts for the logged-in user |
| GET | `/api/accounts/{id}` |

## Transactions

Mirrors the filters/search on `transactions.html`.

| Method | Endpoint |
| --- | --- |
| GET | `/api/transactions?direction=all\|in\|out&category=all\|salary\|bills\|card\|ipn\|transfer&search=...&page=0&size=20` |
| GET | `/api/transactions/{id}/receipt` |

## Transfers (two-step, with OTP — like `transfer.html`)

1. **POST `/api/transfers`**
    
    ```json
    { "sourceAccountId": 1, "channel": "internal", "recipient": "401234567890", "amount": 500 }
    ```
    
    `channel` is `internal` (another SecureBank account number, free), `ipn` (phone/IPA), or `iban`
    (external IBAN) — the latter two apply a flat 5.00 EGP fee, same idea as the frontend’s channel
    selector. Returns a `pendingTransferId` and, since there’s no SMS provider wired up, a `demoOtp`
    field so you can complete the flow locally.
    
2. **POST `/api/transfers/{pendingTransferId}/confirm`**
    
    ```json
    { "otp": "123456" }
    ```
    
    Debits the source account (and credits the destination account too, if `channel` was `internal`),
    and returns a receipt (`reference`, `amount`, `remainingBalance`, …).
    

## Cards

| Method | Endpoint |
| --- | --- |
| GET | `/api/cards` |
| POST | `/api/cards/{id}/reveal` — returns the full card number + CVV (like the 👁️ button on `cards.html`) |
| PATCH | `/api/cards/{id}/freeze` — body `{"frozen": true}` |
| PUT | `/api/cards/{id}/limit` — body `{"dailyLimit": 15000}` |

## Wiring it into the frontend

Example replacement for `assets/js/login.js`’s `setTimeout` mock block:

```jsx
const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
});

if (res.ok) {
    const data = await res.json();
    sessionStorage.setItem("bankAuthToken", data.token);
    sessionStorage.setItem("currentUser", data.username);
    window.location.href = "dashboard.html";
} else {
    errorAlert.textContent = "بيانات الدخول غير صحيحة، يرجى التأكد من اسم المستخدم وكلمة المرور.";
    errorAlert.classList.remove("hidden");
}
```

Then on the other pages, send `Authorization: Bearer ${sessionStorage.getItem("bankAuthToken")}`
with every request, and replace the hardcoded dashboard/transactions/transfer/cards data with
calls to the endpoints above.
