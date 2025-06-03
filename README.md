## 🏦 Bank Lite
This project is a RESTful API for managing bank customers, featuring a lightweight SQLite database and a simplified Angular web interface ~(Since the focus is on the backend and I don't have experience with Angular, I took this opportunity to experiment with it.)~. The goal was to refactor legacy code, apply best development and security practices, and deliver a full-stack solution with a clean, modular architecture.

### Technologies Used
- NestJS – Backend framework

- SQLite – Lightweight embedded database

- Prisma ORM – Type-safe database access

- Docker – Containerized deployment

- Angular – Web interface (simplified version)

- Jest – Automated testing framework

- Swagger – Auto-generated API documentation (With the project running access http://localhost:3000/docs)

### Key Improvements and Security Measures
- Authentication – A full user system `was avoided for simplicity`, but SSO or external auth providers are `required` for production.

- Input validation – Using class-validator, with whitelist and forbidNonWhitelisted to prevent injection and unsafe data.

- Monetary values – Encapsulated using a custom BankMoney structure (based on BigNumber.js) to prevent floating-point errors.

- Decimal storage – Monetary values stored as Decimal using Prisma (acknowledging SQLite limitations).

- Atomic transactions – All balance-changing operations are wrapped in `prisma.$transaction` blocks to ensure consistency.

- Custom exception handling – Implemented with NestJS exception filters for clear and consistent error responses.

- Error logging – Centralized and structured logging.

- Rate limiting – Basic protection via @nestjs/throttler.

- HTTPS ready – Production deployment must include TLS certificates.

- Decoupled and testable code – Architecture based on interfaces and dependency injection (Ports & Adapters).

- Code quality – Enforced with ESLint and Prettier.


### Things Worth Doing Over Time
- Asynchronous Settlement Service with RabbitMQ

- Enforced HTTPS

- Request Tracing with Correlation IDs

- Transaction Limits

- Monitoring and Observability

- Soft Deletes

- (CI/CD)

- Auth/(SSO) with roles 


### Usage
Inside both the `backend` and `frontend` folders, you'll find a guide on how to run the projects.