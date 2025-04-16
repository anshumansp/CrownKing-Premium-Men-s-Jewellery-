# CURRENT GOAL: Project Setup & TypeScript Configuration

# CrownKing E-commerce Backend Plan and Architecture in TypeScript

## Introduction

This comprehensive plan outlines the development of the CrownKing e-commerce backend in TypeScript, designed to integrate seamlessly with a Next.js frontend and a Python FastAPI server. The backend will be built within 6-8 hours, leveraging the provided `api-contracts.md` and `README.md`, and incorporating best practices for scalability, security, and maintainability as of April 16, 2025. The architecture emphasizes modularity, type safety, and interoperability with the Next.js frontend (via REST APIs) and FastAPI backend (via HTTP or message queues like RabbitMQ). This artifact focuses on achieving **Goal 1: Project Setup and Core Architecture** and provides a detailed roadmap for the entire project, including an optimized folder structure for an Express TypeScript backend.

## Project Overview

The CrownKing backend powers a men's jewelry e-commerce platform, supporting features like user authentication, product management, cart, checkout, payments (Stripe), reviews, and more. The system integrates with:
- **Next.js Frontend**: Consumes REST APIs for real-time updates, authentication, and order processing.
- **FastAPI Backend**: Handles auxiliary services (e.g., analytics, inventory sync, or recommendation engine) via HTTP endpoints or async messaging.
- **PostgreSQL**: Stores core data (users, products, orders).
- **Redis**: Manages caching and session storage.

The backend uses TypeScript for type safety, Express for routing, Sequelize for ORM, and Docker for deployment. The plan leverages Cursor for rapid development, ensuring alignment with `api-contracts.md` and production readiness.

## System Architecture

### High-Level Architecture
- **Frontend (Next.js)**: Communicates with Express backend via REST APIs (e.g., `/api/auth`, `/api/products`).
- **Express Backend (TypeScript)**: Core API server handling authentication, products, cart, orders, and payments.
- **FastAPI Backend (Python)**: Handles specialized tasks (e.g., product recommendations, order analytics) and syncs with Express via HTTP or RabbitMQ.
- **Database (PostgreSQL)**: Stores relational data with Sequelize models.
- **Cache (Redis)**: Caches product listings and sessions.
- **Message Queue (RabbitMQ, optional)**: Facilitates async communication between Express and FastAPI for tasks like order processing.
- **Deployment**: Dockerized services on Render.com with GitHub Actions for CI/CD.

### Layered Architecture (Express Backend)
- **Routes Layer**: Defines API endpoints (e.g., `/api/auth/login`, `/api/products`).
- **Controllers Layer**: Handles request/response logic, delegating to services.
- **Services Layer**: Contains business logic (e.g., user auth, payment processing).
- **Models Layer**: Sequelize models for data access (e.g., `User`, `Product`).
- **Middleware Layer**: Manages security (Helmet, rate limiting), logging, and error handling.
- **Utils Layer**: Reusable helpers (e.g., validators, formatters).
- **Config Layer**: Stores configurations (database, environment variables).
- **Docs Layer**: Hosts Swagger API documentation.

### Integration Points
- **Next.js ↔ Express**: REST APIs with JSON payloads, JWT for auth, CORS configured for frontend domain.
- **Express ↔ FastAPI**: HTTP POST/GET for synchronous tasks (e.g., inventory checks) or RabbitMQ for async tasks (e.g., analytics).
- **Express ↔ PostgreSQL**: Sequelize ORM for type-safe queries.
- **Express ↔ Redis**: Caching product data and sessions with `ioredis`.

## Optimized Folder Structure

The folder structure is designed for scalability, modularity, and integration with Next.js and FastAPI, following TypeScript and Express best practices.

```
crownking-backend/
├── src/
│   ├── api/                    # API routes and controllers
│   │   ├── auth/               # Authentication module
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   ├── products/           # Product module
│   │   │   ├── products.routes.ts
│   │   │   ├── products.controller.ts
│   │   │   └── products.service.ts
│   │   ├── cart/               # Cart module
│   │   ├── orders/             # Orders module
│   │   ├── payments/           # Payments module
│   │   ├── users/              # User profile module
│   │   └── index.ts            # Route aggregator
│   ├── config/                 # Configuration files
│   │   ├── db.ts               # Database connection
│   │   ├── passport.ts         # OAuth configuration
│   │   └── env.ts              # Environment variable validation
│   ├── middleware/             # Custom middleware
│   │   ├── errorHandler.ts     # Centralized error handling
│   │   ├── auth.ts             # JWT authentication
│   │   ├── validate.ts         # Input validation
│   │   ├── cache.ts            # Redis caching
│   │   └── logger.ts           # Request logging
│   ├── models/                 # Sequelize models
│   │   ├── user.model.ts
│   │   ├── product.model.ts
│   │   ├── order.model.ts
│   │   └── index.ts            # Model associations
│   ├── services/               # Business logic
│   │   ├── email.service.ts    # Email sending
│   │   ├── payment.service.ts  # Stripe integration
│   │   └── fastapi.service.ts  # FastAPI communication
│   ├── utils/                  # Reusable utilities
│   │   ├── validators.ts       # Express-validator schemas
│   │   ├── constants.ts        # App constants
│   │   └── helpers.ts          # General helpers
│   ├── docs/                   # API documentation
│   │   ├── swagger.ts          # Swagger setup
│   │   └── swagger.yaml        # Optional YAML spec
│   ├── tests/                  # Unit and integration tests
│   │   ├── auth.test.ts
│   │   ├── products.test.ts
│   │   └── setup.ts            # Test configuration
│   ├── types/                  # TypeScript type definitions
│   │   ├── express.d.ts        # Custom Express types
│   │   ├── user.ts             # User interface
│   │   └── product.ts          # Product interface
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── migrations/                 # Sequelize migrations
├── seeders/                    # Sequelize seeders
├── logs/                       # Log files
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── README.md                   # Project documentation
```

### Folder Structure Rationale
- **Modularity**: Feature-based organization (`auth/`, `products/`) keeps related files together, easing maintenance.
- **Scalability**: Separate `controllers`, `services`, and `routes` allow independent scaling of logic.
- **Type Safety**: `types/` centralizes interfaces for reuse across layers.
- **Integration**: `services/fastapi.service.ts` encapsulates FastAPI communication, isolating external dependencies.
- **Testing**: `tests/` mirrors `src/` for easy test mapping.
- **Documentation**: `docs/` isolates Swagger setup for clean API specs.
- **DevOps**: Root-level `Dockerfile`, `docker-compose.yml`, and CI/CD configs streamline deployment.

## Goals and Subtasks (Full Roadmap)

### Goal 1: Project Setup and Core Architecture
- **Subtasks**:
  - Initialize TypeScript project with Express.
  - Set up Git repository and `.gitignore`.
  - Configure environment variables and folder structure.
- **Microgoals**:
  - Install dependencies (Express, TypeScript, Sequelize, etc.).
  - Create `tsconfig.json` for strict type checking.
  - Set up `src/` with modular directories (`config/`, `routes/`, etc.).
- **Tools/Libraries**: `typescript`, `express`, `ts-node-dev`, `dotenv`, `@types/express`, `@types/node`, `eslint`, `prettier`.
- **Best Practices**:
  - Use strict mode in TypeScript (`strict: true`).
  - Organize by feature for maintainability.
  - Commit early and often with clear messages.
  - Enforce code style with ESLint and Prettier.
- **Implementation Plan** (30-45 min):
  - **Step 1: Initialize Project** (10 min):
    - Run `npm init -y` to create `package.json`.
    - Install core dependencies:
      ```bash
      npm i express typescript ts-node-dev @types/express @types/node dotenv
      npm i -D eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
      ```
    - Initialize Git:
      ```bash
      git init
      echo "node_modules/\n.env\ndist/\nlogs/" > .gitignore
      git add .
      git commit -m "Initial project setup"
      ```
  - **Step 2: Configure TypeScript** (10 min):
    - Create `tsconfig.json`:
      ```json
      {
        "compilerOptions": {
          "target": "ES2020",
          "module": "CommonJS",
          "strict": true,
          "esModuleInterop": true,
          "skipLibCheck": true,
          "outDir": "./dist",
          "rootDir": "./src",
          "resolveJsonModule": true,
          "baseUrl": "src",
          "paths": {
            "*": ["*"]
          }
        },
        "include": ["src/**/*"],
        "exclude": ["node_modules", "dist"]
      }
      ```
    - Add scripts to `package.json`:
      ```json
      {
        "scripts": {
          "start": "node dist/server.js",
          "build": "tsc",
          "dev": "ts-node-dev --respawn src/server.ts",
          "lint": "eslint src --ext .ts",
          "format": "prettier --write src/**/*.{ts,js}"
        }
      }
      ```
  - **Step 3: Set Up Environment Variables** (5 min):
    - Create `.env`:
      ```env
      NODE_ENV=development
      PORT=5000
      DB_NAME=crownking
      DB_USER=postgres
      DB_PASS=secret
      DB_HOST=localhost
      JWT_SECRET=your_jwt_secret
      STRIPE_KEY=your_stripe_key
      REDIS_URL=redis://localhost:6379
      CLIENT_URL=http://localhost:3000
      FASTAPI_URL=http://localhost:8000
      ```
    - Create `src/config/env.ts`:
      ```typescript
      import * as dotenv from 'dotenv';
      dotenv.config();
      
      export const env = {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: parseInt(process.env.PORT || '5000', 10),
        DB_NAME: process.env.DB_NAME!,
        DB_USER: process.env.DB_USER!,
        DB_PASS: process.env.DB_PASS!,
        DB_HOST: process.env.DB_HOST!,
        JWT_SECRET: process.env.JWT_SECRET!,
        STRIPE_KEY: process.env.STRIPE_KEY!,
        REDIS_URL: process.env.REDIS_URL!,
        CLIENT_URL: process.env.CLIENT_URL!,
        FASTAPI_URL: process.env.FASTAPI_URL!,
      };
      ```
  - **Step 4: Create Folder Structure and Basic App** (15 min):
    - Set up folders as per structure above.
    - Create `src/app.ts`:
      ```typescript
      import express from 'express';
      import cors from 'cors';
      import { env } from './config/env';
      
      const app = express();
      
      app.use(cors({ origin: env.CLIENT_URL }));
      app.use(express.json());
      
      app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
      });
      
      export default app;
      ```
    - Create `src/server.ts`:
      ```typescript
      import app from './app';
      import { env } from './config/env';
      
      app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
      });
      ```
    - Configure ESLint and Prettier:
      - `.eslintrc.json`:
        ```json
        {
          "env": { "node": true },
          "extends": [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended"
          ],
          "parser": "@typescript-eslint/parser",
          "plugins": ["@typescript-eslint"],
          "rules": {
            "no-console": "warn"
          }
        }
        ```
      - `.prettierrc`:
        ```json
        {
          "semi": true,
          "trailingComma": "es5",
          "singleQuote": true,
          "printWidth": 80
        }
        ```
- **Check After Completion**:
  - Run `npm run dev` and verify server starts at `http://localhost:5000`.
  - Test `/health` endpoint with `curl http://localhost:5000/health`.
  - Ensure `tsc` compiles without errors (`npm run build`).
  - Verify `.gitignore` excludes `node_modules`, `.env`, `dist`, and `logs`.
  - Check initial commit in Git (`git log`).
- **Output**:
  - `package.json`, `tsconfig.json`, `.env`, `.gitignore`.
  - `src/app.ts`, `src/server.ts`, `src/config/env.ts`.
  - Empty directories: `src/api/`, `src/middleware/`, `src/models/`, etc.
  - `.eslintrc.json`, `.prettierrc`.

### Goal 2: Database Integration and ORM (45 min)
- **Subtasks**:
  - Configure PostgreSQL with Sequelize.
  - Define models (`User`, `Product`, `Order`, etc.).
  - Create migrations and seeders.
- **Microgoals**:
  - Set up `src/config/db.ts`.
  - Generate models per `api-contracts.md`.
  - Add indexes for performance.
- **Tools/Libraries**: `sequelize`, `sequelize-typescript`, `pg`, `pg-hstore`, `sequelize-cli`.
- **Implementation Plan**:
  - Install dependencies:
    ```bash
    npm i sequelize sequelize-typescript pg pg-hstore
    npm i -D @types/pg sequelize-cli
    ```
  - Configure Sequelize:
    ```typescript
    // src/config/db.ts
    import { Sequelize } from 'sequelize-typescript';
    import { env } from './env';
    
    const sequelize = new Sequelize({
      database: env.DB_NAME,
      username: env.DB_USER,
      password: env.DB_PASS,
      host: env.DB_HOST,
      dialect: 'postgres',
      logging: false,
      models: [__dirname + '/../models/*.model.ts'],
    });
    
    export default sequelize;
    ```
  - Initialize Sequelize CLI:
    ```bash
    npx sequelize-cli init
    ```
  - Generate models (e.g., `User`):
    ```bash
    npx sequelize-cli model:generate --name User --attributes id:uuid,name:string,email:string,password:string,role:enum:{user,admin}
    ```
  - Update models with TypeScript:
    ```typescript
    // src/models/user.model.ts
    import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';
    
    @Table({ tableName: 'users', timestamps: true })
    export class User extends Model {
      @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
      })
      id!: string;
    
      @Index
      @Column({ type: DataType.STRING, allowNull: false })
      name!: string;
    
      @Index
      @Column({ type: DataType.STRING, unique: true, allowNull: false })
      email!: string;
    
      @Column({ type: DataType.STRING, allowNull: false })
      password!: string;
    
      @Column({ type: DataType.ENUM('user', 'admin'), defaultValue: 'user' })
      role!: 'user' | 'admin';
    }
    ```
  - Create seeders:
    ```bash
    npx sequelize-cli seed:generate --name demo-users
    ```
- **Check After Completion**:
  - Verify database connection (`sequelize.authenticate()`).
  - Run migrations (`npx sequelize-cli db:migrate`).
  - Seed data and query database.
- **Output**: `src/config/db.ts`, `src/models/*.model.ts`, `migrations/`, `seeders/`.

### Goal 3: Middleware Setup (45 min)
- **Subtasks**:
  - Implement error handling middleware.
  - Configure CORS, Helmet, rate limiting.
  - Set up logging with Winston and Morgan.
- **Microgoals**:
  - Create `errorHandler.ts`.
  - Configure CORS for Next.js (`CLIENT_URL`).
  - Log requests to `logs/`.
- **Tools/Libraries**: `helmet`, `cors`, `rate-limiter-flexible`, `express-sanitizer`, `winston`, `morgan`.
- **Implementation Plan**:
  - Install dependencies:
    ```bash
    npm i helmet cors express-validator rate-limiter-flexible express-sanitizer winston morgan
    npm i -D @types/helmet @types/cors @types/morgan
    ```
  - Create error handler:
    ```typescript
    // src/middleware/errorHandler.ts
    import { Request, Response, NextFunction } from 'express';
    
    interface CustomError extends Error {
      statusCode?: number;
      errors?: any;
    }
    
    export const errorHandler = (
      err: CustomError,
      _req: Request,
      res: Response,
      _next: NextFunction
    ) => {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        error: {
          code: statusCode,
          message: err.message,
          validation: err.errors,
          stack: env.NODE_ENV === 'development' ? err.stack : undefined,
        },
      });
    };
    ```
  - Update `app.ts`:
    ```typescript
    // src/app.ts
    import express from 'express';
    import cors from 'cors';
    import helmet from 'helmet';
    import morgan from 'morgan';
    import winston from 'winston';
    import { RateLimiterMemory } from 'rate-limiter-flexible';
    import { errorHandler } from './middleware/errorHandler';
    import { env } from './config/env';
    
    const app = express();
    
    const logger = winston.createLogger({
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
    
    const rateLimiter = new RateLimiterMemory({ points: 100, duration: 60 });
    
    app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } } }));
    app.use(cors({ origin: env.CLIENT_URL }));
    app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
    app.use(express.json());
    app.use(async (req, res, next) => {
      try {
        await rateLimiter.consume(req.ip as string);
        next();
      } catch {
        res.status(429).json({ error: 'Too Many Requests' });
      }
    });
    
    app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });
    
    app.use(errorHandler);
    
    export default app;
    ```
- **Check After Completion**:
  - Verify CORS allows Next.js domain.
  - Check logs in `logs/combined.log`.
  - Test rate limiter with rapid requests.
- **Output**: `src/middleware/errorHandler.ts`, updated `src/app.ts`, `logs/`.

### Goal 4: Authentication and User Management (60 min)
- **Subtasks**:
  - Implement JWT-based auth endpoints.
  - Build user profile and address APIs.
  - Add Google OAuth.
- **Microgoals**:
  - Create `/api/auth/*` routes.
  - Implement `auth.service.ts` for logic.
  - Integrate with FastAPI for user sync (e.g., `/users/sync`).
- **Tools/Libraries**: `jsonwebtoken`, `bcrypt`, `passport`, `passport-google-oauth20`, `express-validator`, `nodemailer`, `axios`.
- **Implementation Plan**:
  - Install dependencies:
    ```bash
    npm i jsonwebtoken bcrypt passport passport-jwt passport-google-oauth20 nodemailer express-validator axios
    npm i -D @types/jsonwebtoken @types/bcrypt @types/passport @types/passport-jwt @types/passport-google-oauth20 @types/nodemailer @types/express-validator @types/axios
    ```
  - Create auth routes:
    ```typescript
    // src/api/auth/auth.routes.ts
    import { Router } from 'express';
    import { login, register } from './auth.controller';
    import { validate } from '../../middleware/validate';
    import { body } from 'express-validator';
    
    const router = Router();
    
    router.post(
      '/login',
      validate([
        body('email').isEmail(),
        body('password').notEmpty(),
      ]),
      login
    );
    router.post(
      '/register',
      validate([
        body('name').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
      ]),
      register
    );
    
    export default router;
    ```
  - Sync users with FastAPI:
    ```typescript
    // src/services/fastapi.service.ts
    import axios from 'axios';
    import { env } from '../config/env';
    
    export const syncUserWithFastAPI = async (user: { id: string; email: string; name: string }) => {
      try {
        await axios.post(`${env.FASTAPI_URL}/users/sync`, user);
      } catch (error) {
        console.error('Failed to sync user with FastAPI:', error);
      }
    };
    ```
- **Check After Completion**:
  - Test `/api/auth/login` with Postman.
  - Verify JWT token.
  - Check FastAPI sync logs.
- **Output**: `src/api/auth/`, `src/services/fastapi.service.ts`.

### Goal 5: Product Management (60 min)
- **Subtasks**:
  - Implement product catalog endpoints.
  - Add filtering, search, and reviews.
- **Microgoals**:
  - Create `/api/products/*` routes.
  - Optimize search with PostgreSQL `tsvector`.
  - Query FastAPI for recommendations (`/recommendations`).
- **Tools/Libraries**: `sequelize`, `pg-tsquery`, `axios`.
- **Implementation Plan**:
  - Create product routes:
    ```typescript
    // src/api/products/products.routes.ts
    import { Router } from 'express';
    import { getProducts, getProductById } from './products.controller';
    
    const router = Router();
    
    router.get('/', getProducts);
    router.get('/:id', getProductById);
    
    export default router;
    ```
  - Integrate FastAPI recommendations:
    ```typescript
    // src/api/products/products.service.ts
    import axios from 'axios';
    import { env } from '../../config/env';
    
    export const getRecommendations = async (userId: string) => {
      try {
        const response = await axios.get(`${env.FASTAPI_URL}/recommendations?userId=${userId}`);
        return response.data;
      } catch (error) {
        return [];
      }
    };
    ```
- **Check After Completion**:
  - Test `/api/products` pagination.
  - Verify FastAPI recommendations.
- **Output**: `src/api/products/`.

### Goal 6: Cart and Checkout (60 min)
- **Subtasks**:
  - Build cart management APIs.
  - Implement order creation and checkout.
- **Microgoals**:
  - Create `/api/cart/*` routes.
  - Use transactions for orders.
  - Notify FastAPI of orders (`/orders/notify`).
- **Tools/Libraries**: `sequelize`, `express-validator`, `axios`.
- **Implementation Plan**:
  - Create cart routes:
    ```typescript
    // src/api/cart/cart.routes.ts
    import { Router } from 'express';
    import { addToCart } from './cart.controller';
    import { auth } from '../../middleware/auth';
    
    const router = Router();
    
    router.post('/', auth, addToCart);
    
    export default router;
    ```
- **Check After Completion**:
  - Test cart operations.
  - Verify order notifications to FastAPI.
- **Output**: `src/api/cart/`, `src/api/orders/`.

### Goal 7: Payment and Transactions (45 min)
- **Subtasks**:
  - Integrate Stripe.
  - Implement transaction status updates.
- **Microgoals**:
  - Create `/api/payments/*` routes.
  - Sync payments with FastAPI (`/payments/notify`).
- **Tools/Libraries**: `stripe`, `axios`.
- **Implementation Plan**:
  - Install Stripe:
    ```bash
    npm i stripe
    npm i -D @types/stripe
    ```
  - Create payment routes:
    ```typescript
    // src/api/payments/payments.routes.ts
    import { Router } from 'express';
    import { createPaymentIntent } from './payments.controller';
    import { auth } from '../../middleware/auth';
    
    const router = Router();
    
    router.post('/create-intent', auth, createPaymentIntent);
    
    export default router;
    ```
- **Check After Completion**:
  - Test Stripe payment intent.
  - Verify FastAPI payment sync.
- **Output**: `src/api/payments/`.

### Goal 8: API Documentation, Caching, and Testing (60 min)
- **Subtasks**:
  - Generate Swagger docs.
  - Implement Redis caching.
  - Write tests.
- **Microgoals**:
  - Set up `/api-docs`.
  - Cache `/api/products` (TTL: 300s).
  - Test auth and products with Jest.
- **Tools/Libraries**: `swagger-ui-express`, `swagger-jsdoc`, `redis`, `jest`, `supertest`.
- **Implementation Plan**:
  - Install dependencies:
    ```bash
    npm i swagger-ui-express swagger-jsdoc redis jest supertest
    npm i -D @types/swagger-ui-express @types/swagger-jsdoc @types/jest @types/supertest ts-jest
    ```
  - Set up Swagger:
    ```typescript
    // src/docs/swagger.ts
    import swaggerJsDoc from 'swagger-jsdoc';
    import swaggerUi from 'swagger-ui-express';
    
    const options: swaggerJsDoc.Options = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'CrownKing API', version: '1.0.0' },
      },
      apis: ['src/api/**/*.routes.ts'],
    };
    
    export const swaggerSpec = swaggerJsDoc(options);
    export const setupSwagger = (app: express.Express) => {
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    };
    ```
- **Check After Completion**:
  - Access `/api-docs`.
  - Verify caching.
  - Run `npm test`.
- **Output**: `src/docs/swagger.ts`, `src/tests/`.

### Goal 9: Deployment and Finalization (60 min)
- **Subtasks**:
  - Containerize with Docker.
  - Set up CI/CD.
  - Deploy to Render.com.
- **Microgoals**:
  - Create `Dockerfile`.
  - Configure GitHub Actions.
  - Test with Postman.
- **Tools/Libraries**: `docker`, `github-actions`, `postman`.
- **Implementation Plan**:
  - Create `Dockerfile`:
    ```dockerfile
    FROM node:18
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    EXPOSE 5000
    CMD ["npm", "start"]
    ```
  - Create `docker-compose.yml`:
    ```yaml
    version: '3.8'
    services:
      app:
        build: .
        ports:
          - "5000:5000"
        environment:
          - NODE_ENV=production
          - DB_HOST=postgres
          - REDIS_URL=redis://redis:6379
        depends_on:
          - postgres
          - redis
      postgres:
        image: postgres:14
        environment:
          - POSTGRES_USER=${DB_USER}
          - POSTGRES_PASSWORD=${DB_PASS}
          - POSTGRES_DB=${DB_NAME}
      redis:
        image: redis:7
      fastapi:
        image: python:3.11
        ports:
          - "8000:8000"
        volumes:
          - ./fastapi:/app
        command: ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```
  - Set up CI/CD:
    ```yaml
    name: CI/CD
    on:
      push:
        branches: [main]
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: actions/setup-node@v3
            with:
              node-version: '18'
          - run: npm ci
          - run: npm test
          - name: Deploy to Render
            env:
              RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
            run: curl -X POST -H "Authorization: Bearer $RENDER_API_KEY" https://api.render.com/v1/services/<service-id>/deploys
    ```
- **Check After Completion**:
  - Run `docker-compose up`.
  - Verify Render deployment.
  - Test endpoints with Postman.
- **Output**: `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`, updated `README.md`.

## Best Practices and Libraries
- **TypeScript**:
  - Use interfaces for types.
  - Enable `strictNullChecks`, `noImplicitAny`.
- **Modularity**: Feature-based structure (`api/auth/`).
- **Error Handling**:
  ```typescript
  export class ApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  ```
- **Security**:
  - OWASP Top 10 compliance.
  - Rate limit: 100 requests/min.
- **Performance**:
  - Redis caching (TTL: 300s).
  - Sequelize `raw: true` for large queries.
- **Libraries**:
  - `express`, `sequelize-typescript`, `jsonwebtoken`, `stripe`, `winston`, `swagger-ui-express`, `jest`, `helmet`, `axios`.

## Tools for Speed
- **Cursor**: Generate code, debug, test.
- **Postman**: API testing.
- **Sequelize CLI**: Model generation.
- **Docker Desktop**: Local testing.
- **Render CLI**: Deployment.

## Security and Scalability
- **Security**:
  - HTTPS via Render SSL.
  - Helmet CSP.
  - Input validation.
- **Scalability**:
  - Redis for caching.
  - Render auto-scaling.
  - Database indexes.

## Testing Strategy
- **Unit Tests**: Services with Jest.
- **Integration Tests**: Endpoints with `supertest`.
- **End-to-End**: Flows with Postman.
- **Coverage**: 80% services, 60% routes.

## Deployment Strategy
- **Platform**: Render.com.
- **CI/CD**: GitHub Actions.
- **Monitoring**: Render logs, New Relic.

## Risk Mitigation
| **Risk** | **Early Warning** | **Contingency** |
|----------|-------------------|-----------------|
| Time Overrun | Tasks exceed time | Prioritize auth, products |
| Type Errors | Compilation fails | Use Cursor; temporary `any` |
| FastAPI Issues | Failed sync | Mock FastAPI locally |
| Deployment Fails | Render errors | Test with Docker |

## Key Performance Indicators
- Completion: 6-8 hours.
- Uptime: 99.9%.
- Test Coverage: 80% services.
- Error Rate: <1%.
- Response Time: <200ms cached.

## Conclusion
This plan delivers a robust CrownKing backend, optimized for Next.js and FastAPI integration, with a modular TypeScript architecture. Goal 1 is achieved with a solid foundation, and the roadmap ensures completion within hours, leveraging Cursor for speed and Render for deployment.

## Citations
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Sequelize Documentation](https://sequelize.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/)
- [Render Documentation](https://render.com/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)



---
---


# CrownKing Backend: TypeScript Migration & Implementation Roadmap

## Overview

This roadmap outlines a systematic approach to migrate and enhance the CrownKing Men's Jewelry E-commerce backend to TypeScript, focusing on modular architecture, robust type safety, and best practices for scalability and security. The plan combines the strengths of various proposed architectures to create a comprehensive implementation strategy achievable within a few hours.

## Technology Stack

- **Language**: TypeScript (Node.js runtime)
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Google OAuth
- **Payment Processing**: Stripe
- **Caching**: Redis
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Security**: Helmet, Express Rate Limit, Input Validation
- **Logging**: Winston + Morgan

## Phase 1: Project Setup & TypeScript Configuration (45 minutes)

### Goals
- Initialize TypeScript project with proper configuration
- Set up folder structure following domain-driven design
- Configure linting and formatting tools

### Tasks
1. **Initialize Project with TypeScript**
   - Create new project directory
   - Initialize npm project
   - Install TypeScript and type definitions
   - Configure tsconfig.json

2. **Configure Development Environment**
   - Set up nodemon for hot reloading
   - Configure ESLint and Prettier for TypeScript
   - Set up VS Code debugging

3. **Create Project Structure**
   ```
   src/
   ├── config/           # App configuration
   ├── constants/        # Application constants
   ├── controllers/      # Request handlers
   ├── db/               # Database setup and migrations
   │   ├── migrations/   # TypeORM migrations
   │   └── seeds/        # Seed data
   ├── dtos/             # Data Transfer Objects
   ├── entities/         # TypeORM entities
   ├── interfaces/       # TypeScript interfaces
   ├── middleware/       # Express middleware
   ├── routes/           # Route definitions
   ├── services/         # Business logic
   ├── types/            # Type definitions
   ├── utils/            # Utility functions
   └── app.ts            # App setup
   ```

### Verification Steps
- Project compiles with `tsc` without errors
- ESLint runs without major issues
- Project structure is created

### Sample LLM Prompt
```
Create a TypeScript Express project setup with the following:
1. A tsconfig.json file configured for Node.js development
2. A package.json with all required dependencies and scripts
3. An ESLint config for TypeScript
4. A basic app.ts file that sets up an Express server with TypeScript
5. A .env.example file with all required environment variables

Include all necessary type definitions and comments explaining key configurations.
```

## Phase 2: Database & ORM Integration (60 minutes)

### Goals
- Configure TypeORM for PostgreSQL
- Define entity models with TypeScript interfaces
- Set up database migrations and seeders
- Create repository abstraction for data access

### Tasks
1. **TypeORM Configuration**
   - Install TypeORM and pg packages
   - Create database configuration
   - Set up connection in app bootstrap

2. **Entity Definition**
   - Create User entity
   - Create Product entity
   - Create Order entity
   - Create Cart entity
   - Define relationships between entities

3. **Migrations Setup**
   - Create initial migration
   - Add seed data migration

4. **Repository Layer**
   - Create base repository interface
   - Implement concrete repositories for each entity

### Verification Steps
- TypeORM connects to database successfully
- Migrations run successfully
- Seed data is loaded
- Basic CRUD operations work through repositories

### Sample LLM Prompt
```
Create TypeORM entity definitions for an e-commerce backend with TypeScript. I need:

1. A User entity with:
   - UUID primary key
   - name, email, password, role fields
   - one-to-many relationship with Orders
   - one-to-one relationship with Cart

2. A Product entity with:
   - UUID primary key
   - name, description, price, images (string array), category, specifications (JSON)
   - many-to-many relationship with Orders

3. An Order entity with:
   - UUID primary key
   - status, total fields
   - many-to-one relationship with User
   - many-to-many relationship with Products with quantity

4. A Cart entity with:
   - UUID primary key
   - one-to-one relationship with User
   - many-to-many relationship with Products with quantity

Include TypeORM decorators, proper indexing, TypeScript interfaces, and ensure all relationships are properly typed.
```

## Phase 3: Authentication & Authorization (60 minutes)

### Goals
- Implement JWT authentication with TypeScript
- Set up Google OAuth integration
- Create middleware for route protection
- Implement role-based access control

### Tasks
1. **JWT Authentication**
   - Create auth controller with login/register endpoints
   - Implement JWT token generation and validation
   - Create auth middleware with TypeScript

2. **Password Management**
   - Implement password hashing with bcrypt
   - Create password reset flow

3. **Google OAuth**
   - Configure Passport.js with TypeScript
   - Implement OAuth callback controller
   - Link OAuth accounts with existing users

4. **Authorization System**
   - Create role-based middleware
   - Implement permission checks

### Verification Steps
- User can register and login
- JWT tokens are validated properly
- Google OAuth flow works
- Role-based access control restricts routes

### Sample LLM Prompt
```
Create a TypeScript implementation for JWT authentication in an Express application with the following:

1. An AuthController class with:
   - register method (accepts name, email, password)
   - login method (accepts email, password)
   - refreshToken method
   - verifyEmail method

2. A JWT middleware that:
   - Extracts token from Authorization header
   - Verifies token validity
   - Attaches user to request object
   - Has proper TypeScript type definitions

3. A RoleGuard middleware that:
   - Takes roles array as input
   - Checks if authenticated user has required role
   - Properly typed with TypeScript

Include proper error handling, TypeScript interfaces for requests/responses, and security best practices.
```

## Phase 4: API Endpoints - Products & Categories (45 minutes)

### Goals
- Implement product CRUD operations
- Create filtering, sorting, and pagination
- Set up category management
- Implement search functionality

### Tasks
1. **Product API**
   - Create product controller
   - Implement CRUD operations
   - Add filtering and pagination

2. **Category Management**
   - Create category controller
   - Implement hierarchy for categories

3. **Search Functionality**
   - Implement full-text search
   - Create type-safe query builders

4. **DTO Implementation**
   - Create DTOs for product requests/responses
   - Implement validation with class-validator

### Verification Steps
- Product CRUD operations work
- Filtering and pagination function correctly
- Search returns relevant results
- All responses are properly typed

### Sample LLM Prompt
```
Create a TypeScript implementation for a ProductController in an Express application with:

1. A complete set of CRUD operations:
   - getProducts (with filtering, sorting, pagination)
   - getProductById
   - createProduct
   - updateProduct
   - deleteProduct

2. Query parameter interface for filtering with:
   - category filter
   - price range filter
   - rating filter
   - search term
   - sorting options
   - pagination (page, limit)

3. Response DTOs with:
   - Properly typed product responses
   - Pagination metadata

4. Request validation using class-validator

Include proper error handling, TypeScript interfaces, and implement repository pattern for data access. The solution should demonstrate TypeScript best practices like generics and type guards where appropriate.
```

## Phase 5: Cart & Order Management (45 minutes)

### Goals
- Implement shopping cart functionality
- Create order processing flow
- Set up transaction management
- Implement order status tracking

### Tasks
1. **Cart Management**
   - Create cart controller
   - Implement add/update/remove operations

2. **Order Processing**
   - Create order controller
   - Implement checkout process
   - Set up transaction management

3. **Order Status**
   - Implement status updates
   - Create order history endpoints

4. **Type Safety**
   - Create interfaces for cart operations
   - Define order status types

### Verification Steps
- Cart operations function correctly
- Orders can be created from cart
- Transactions maintain data integrity
- Order status updates work

### Sample LLM Prompt
```
Create a TypeScript implementation for shopping cart and order processing in an Express e-commerce application:

1. A CartController with:
   - getCart method (fetches user's cart)
   - addToCart method (adds product with quantity)
   - updateCartItem method (updates quantity)
   - removeFromCart method (removes item)
   - clearCart method

2. An OrderController with:
   - createOrder method (converts cart to order)
   - getOrders method (lists user's orders)
   - getOrderById method (detailed view)
   - updateOrderStatus method
   - cancelOrder method

3. Transaction handling that:
   - Ensures database consistency
   - Rolls back on failure
   - Uses TypeORM transaction manager

4. TypeScript interfaces for:
   - CartItem (product, quantity)
   - Order (items, status, payment, shipping)
   - OrderStatus (enum)

Include proper error handling, authorization checks, and TypeScript decorators for route definitions. The implementation should handle edge cases like stock validation.
```

## Phase 6: Payment Integration & Services (45 minutes)

### Goals
- Implement Stripe payment integration
- Create payment service abstractions
- Set up webhook handling
- Implement refund processing

### Tasks
1. **Stripe Integration**
   - Create payment service
   - Implement payment intent creation
   - Set up capture and confirmation

2. **Payment Controller**
   - Create payment endpoints
   - Implement payment confirmation
   - Handle payment webhooks

3. **Refund Processing**
   - Implement refund functionality
   - Create refund tracking

4. **Type Definitions**
   - Create interfaces for payment methods
   - Define payment status types

### Verification Steps
- Payment intents can be created
- Payments can be confirmed
- Webhooks process payment updates
- Refunds can be processed

### Sample LLM Prompt
```
Create a TypeScript implementation for Stripe payment processing in an Express e-commerce application:

1. A PaymentService class with:
   - createPaymentIntent method (takes amount, currency, metadata)
   - confirmPayment method (captures payment)
   - createRefund method
   - webhook handling

2. A PaymentController with:
   - createPaymentIntent endpoint
   - confirmPayment endpoint
   - refundPayment endpoint
   - webhookHandler endpoint

3. TypeScript interfaces for:
   - PaymentIntent
   - PaymentMethod
   - RefundRequest
   - WebhookEvent

4. Error handling for:
   - Card declined scenarios
   - Processing errors
   - Idempotency issues

Include proper typing for Stripe SDK, error handling, and validation. The implementation should follow best practices for TypeScript and payment processing security.
```

## Phase 7: Middleware & Security (30 minutes)

### Goals
- Implement security middleware
- Set up error handling
- Configure logging
- Implement rate limiting

### Tasks
1. **Security Middleware**
   - Configure Helmet
   - Set up CORS
   - Implement content security policy

2. **Error Handling**
   - Create centralized error handler
   - Define custom error classes
   - Implement error logging

3. **Rate Limiting**
   - Set up global rate limiting
   - Configure endpoint-specific limits

4. **Request Logging**
   - Configure Morgan for HTTP logging
   - Set up Winston for application logging

### Verification Steps
- Security headers are applied
- Errors are handled gracefully
- Rate limiting prevents abuse
- Requests are properly logged

### Sample LLM Prompt
```
Create a TypeScript implementation for middleware and security in an Express application:

1. A centralized error handling middleware that:
   - Catches all errors
   - Formats error responses consistently
   - Includes proper status codes
   - Logs errors appropriately
   - Has custom error classes

2. Security middleware setup with:
   - Helmet configuration
   - CORS policy
   - Rate limiting (global and per-endpoint)
   - Content Security Policy

3. Logging middleware with:
   - Morgan for HTTP request logging
   - Winston for application logging
   - Request ID tracking
   - Log rotation configuration

4. TypeScript interfaces for:
   - Error response format
   - Extended Request/Response objects
   - Logger configuration

Include best practices for TypeScript middleware implementation, proper typing, and security considerations.
```

## Phase 8: Caching & Performance (30 minutes)

### Goals
- Implement Redis caching
- Create cache middleware
- Set up cache invalidation
- Optimize database queries

### Tasks
1. **Redis Configuration**
   - Set up Redis client
   - Create cache service

2. **Cache Middleware**
   - Implement cache check/store logic
   - Create route-specific caching

3. **Cache Invalidation**
   - Set up invalidation on data changes
   - Implement TTL strategies

4. **Query Optimization**
   - Create optimized repository queries
   - Implement query result caching

### Verification Steps
- Cached endpoints respond faster
- Cache invalidation works correctly
- Redis connections handle errors
- Query performance is improved

### Sample LLM Prompt
```
Create a TypeScript implementation for Redis caching in an Express application:

1. A CacheService class with:
   - get method (retrieves from cache)
   - set method (stores in cache with TTL)
   - del method (removes from cache)
   - invalidatePattern method (removes by pattern)

2. A caching middleware that:
   - Checks cache before processing requests
   - Stores responses in cache
   - Handles cache bypass conditions
   - Is configurable per route

3. Cache invalidation logic that:
   - Invalidates on related data changes
   - Uses proper prefix strategies
   - Handles cache stampede protection

4. TypeScript interfaces for:
   - Cache configuration
   - Cache keys
   - Cache entry values

Include error handling for Redis connection issues, proper typing for async operations, and performance optimizations.
```

## Phase 9: API Documentation & Testing (45 minutes)

### Goals
- Implement Swagger/OpenAPI documentation
- Set up unit testing with Jest
- Create integration tests
- Implement test coverage reporting

### Tasks
1. **API Documentation**
   - Set up Swagger UI
   - Add OpenAPI annotations
   - Create documentation routes

2. **Unit Testing**
   - Set up Jest for TypeScript
   - Create service unit tests
   - Implement controller unit tests

3. **Integration Testing**
   - Set up Supertest
   - Create route integration tests
   - Implement database testing

4. **Coverage Reporting**
   - Configure Jest coverage
   - Set up coverage thresholds

### Verification Steps
- Swagger UI displays all endpoints
- Unit tests pass
- Integration tests pass
- Coverage meets thresholds

### Sample LLM Prompt
```
Create a TypeScript implementation for API documentation and testing in an Express application:

1. Swagger/OpenAPI setup with:
   - OpenAPI 3.0 configuration
   - Route annotations
   - Schema definitions
   - Authentication documentation

2. Unit testing with Jest:
   - Service tests for UserService
   - Controller tests with mocked dependencies
   - TypeScript-compatible test configuration

3. Integration testing with Supertest:
   - Auth endpoints test
   - Product endpoints test
   - Order flow test

4. Test configuration:
   - TypeScript Jest setup
   - Coverage reporting
   - Test database setup

Include TypeScript decorators for OpenAPI, proper typing for tests, and mock implementations where needed.
```

## Phase 10: Deployment & CI/CD (30 minutes)

### Goals
- Create Docker configuration
- Set up CI/CD pipeline
- Configure environment variables
- Create deployment documentation

### Tasks
1. **Docker Setup**
   - Create Dockerfile
   - Configure docker-compose.yml
   - Set up multi-stage builds

2. **Environment Configuration**
   - Create .env.example
   - Document required variables
   - Implement environment validation

3. **CI/CD Pipeline**
   - Configure GitHub Actions
   - Set up testing and building
   - Configure deployment

4. **Documentation**
   - Create deployment guide
   - Document scaling considerations
   - Update README.md

### Verification Steps
- Docker builds successfully
- CI/CD pipeline runs
- Environment validation works
- Documentation is comprehensive

### Sample LLM Prompt
```
Create Docker and CI/CD configuration for a TypeScript Express application:

1. A Dockerfile with:
   - Multi-stage build process
   - Node.js best practices
   - TypeScript compilation
   - Production optimization

2. A docker-compose.yml with:
   - Node.js application
   - PostgreSQL database
   - Redis cache
   - Volume mounting

3. GitHub Actions workflow that:
   - Runs on push/PR to main
   - Installs dependencies
   - Runs tests
   - Builds application
   - Creates Docker image
   - Deploys (optional)

4. Environment variable handling:
   - .env.example file
   - Runtime validation
   - Typescript interface for env vars

Include best practices for secure Docker images, TypeScript-specific considerations, and proper typing for configuration.
```

## Verification Checklist

After completing each phase, verify the following aspects:

1. **Compilation**: TypeScript compiles without errors
2. **Type Safety**: No `any` types or type assertions unless absolutely necessary
3. **Testing**: Tests pass and cover critical functionality
4. **Documentation**: Code is documented and API docs are generated
5. **Performance**: Endpoints respond within acceptable time limits
6. **Security**: Security headers and protections are in place

## Sample Task Verification Commands

```bash
# Verify TypeScript compilation
npm run build

# Run linting
npm run lint

# Run tests
npm run test

# Check test coverage
npm run test:coverage

# Verify API documentation
npm run docs

# Run security audit
npm audit
```

## Full Implementation Sample Prompt

```
Create a complete TypeScript Express backend for an e-commerce application with the following requirements:

1. Project setup:
   - TypeScript configuration
   - Express with proper typing
   - Project structure following domain-driven design

2. Database integration:
   - TypeORM configuration for PostgreSQL
   - Entity definitions for User, Product, Order, Cart
   - Migration setup and seeding

3. Authentication:
   - JWT authentication
   - Google OAuth integration
   - Role-based authorization

4. API endpoints:
   - Product CRUD with filtering, sorting, pagination
   - Shopping cart management
   - Order processing
   - Payment integration with Stripe

5. Architecture features:
   - Middleware for security, error handling, logging
   - Redis caching
   - Swagger documentation
   - Unit and integration testing

Implement this using TypeScript best practices, with proper interfaces, type definitions, and error handling. The code should be production-ready, following SOLID principles and clean architecture.
```

## Task Completion Checklist

- [ ] Phase 1: Project Setup & TypeScript Configuration
- [ ] Phase 2: Database & ORM Integration
- [ ] Phase 3: Authentication & Authorization
- [ ] Phase 4: API Endpoints - Products & Categories
- [ ] Phase 5: Cart & Order Management
- [ ] Phase 6: Payment Integration & Services
- [ ] Phase 7: Middleware & Security
- [ ] Phase 8: Caching & Performance
- [ ] Phase 9: API Documentation & Testing
- [ ] Phase 10: Deployment & CI/CD

## Conclusion

This roadmap provides a comprehensive plan for implementing the CrownKing E-commerce backend with TypeScript. By following these phases in order, you'll create a robust, type-safe application that follows best practices and is ready for production deployment. Each phase builds upon the previous one, ensuring a logical progression and minimizing rework. The included LLM prompts will help accelerate implementation by generating boilerplate and complex functionality quickly.

Remember to regularly commit your changes and verify the completion of each phase before moving to the next. This incremental approach will make the project manageable within a few hours while maintaining high quality and type safety. 