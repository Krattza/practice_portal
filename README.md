
```
FactorySync
├─ backend
│  ├─ .env
│  ├─ factorysync.db
│  ├─ factorysync.db-shm
│  ├─ factorysync.db-wal
│  ├─ factorysync2.db
│  ├─ factorysync2.db-shm
│  ├─ factorysync2.db-wal
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ server.js
│  └─ src
│     ├─ .env.example
│     ├─ app.js
│     ├─ config
│     │  ├─ db.js
│     │  ├─ db2.js
│     │  ├─ mail.js
│     │  ├─ migrations.js
│     │  └─ scehma.sql
│     ├─ controllers
│     │  ├─ factoryFormController.js
│     │  └─ userController.js
│     ├─ db
│     │  ├─ migrations
│     │  │  ├─ 001_create_users_table.sql
│     │  │  ├─ 002_create_email_verifications_table.sql
│     │  │  ├─ 003_create_session_table.sql
│     │  │  └─ 004_create_session-table.sql
│     │  └─ migration_updated
│     │     ├─ 001_create_departments_table.sql
│     │     ├─ 002_create_users_table.sql
│     │     ├─ 003_create_admins_table.sql
│     │     ├─ 004_create_sessions_table.sql
│     │     ├─ 005_create_email_verifications_table.sql
│     │     ├─ 006_create_login_attempts_table.sql
│     │     ├─ 007_create_password_reset_tokens_table.sql
│     │     └─ 008_create_audit_logs_table.sql
│     ├─ middlewares
│     ├─ repositories
│     ├─ routes
│     │  ├─ factoryForms.js
│     │  └─ users.js
│     ├─ services
│     │  └─ userService.js
│     ├─ utils
│     │  ├─ jwt.js
│     │  ├─ logger.js
│     │  └─ session.js
│     └─ validators
│        └─ userValidators.js
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ citizen
│  │  │  │  ├─ ApplicationStatus.jsx
│  │  │  │  ├─ CitizenNavbar.jsx
│  │  │  │  ├─ CitizenSidebar.jsx
│  │  │  │  ├─ DashboardSummary.jsx
│  │  │  │  ├─ ProgressTracker.jsx
│  │  │  │  └─ registration
│  │  │  │     ├─ registrationForm
│  │  │  │     │  ├─ DeclarationForm.jsx
│  │  │  │     │  ├─ DocumentsForm.jsx
│  │  │  │     │  ├─ FactoryInfoForm.jsx
│  │  │  │     │  ├─ OperationsForm.jsx
│  │  │  │     │  ├─ OwnerDetailsForm.jsx
│  │  │  │     │  └─ WorkersForm.jsx
│  │  │  │     ├─ RegistrationForm.jsx
│  │  │  │     └─ RegistrationHeader.jsx
│  │  │  └─ home
│  │  │     ├─ DialogueBoxModal.jsx
│  │  │     ├─ Hero.jsx
│  │  │     ├─ Login.jsx
│  │  │     ├─ Navbar.jsx
│  │  │     └─ Register.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  └─ pages
│  │     ├─ admin
│  │     │  └─ Admin.jsx
│  │     ├─ citizen
│  │     │  ├─ Citizen.jsx
│  │     │  ├─ Dashboard.jsx
│  │     │  └─ Registration.jsx
│  │     ├─ Home.jsx
│  │     └─ VerifyOtp.jsx
│  └─ vite.config.js
├─ mailtrapinfor.me
├─ readme
│  └─ README.md
├─ resend_ai
└─ structure.me

```