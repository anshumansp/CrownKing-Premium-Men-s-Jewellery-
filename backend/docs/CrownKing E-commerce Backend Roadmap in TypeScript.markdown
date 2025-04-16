# CrownKing E-commerce Backend Roadmap in TypeScript

## Introduction

This roadmap outlines a comprehensive plan to build the CrownKing e-commerce backend in TypeScript within 6-8 hours, leveraging the provided `api-contracts.md` and `README.md`, and integrating insights from prior plans. The goal is to create a robust, secure, and scalable backend for a men's jewelry platform, covering database integration, authentication, user profiles, products, cart, checkout, payments, security, logging, documentation, caching, testing, and deployment. The plan uses Cursor for rapid development, TypeScript for type safety, and aligns with Node.js best practices to ensure production readiness as of April 16, 2025.

## Goals and Subtasks

### Goal 1: Project Setup and Core Architecture

- **Subtasks**:
  - Initialize TypeScript project with Express.
  - Set up Git repository and `.gitignore`.
  - Configure environment variables and folder structure.
- **Microgoals**:
  - Install dependencies (Express, TypeScript, Sequelize, etc.).
  - Create `tsconfig.json` for strict type checking.
  - Set up `src/` with modular directories (`config/`, `routes/`, etc.).
- **Tools/Libraries**: `typescript`, `express`, `ts-node-dev`, `dotenv`.
- **Best Practices**: Use strict mode in TypeScript, organize by feature, commit early.

### Goal 2: Database Integration and ORM

- **Subtasks**:
  - Configure PostgreSQL with Sequelize.
  - Define models and relationships (`User`, `Product`, `Order`, etc.).
  - Create migrations and seeders for initial data.
- **Microgoals**:
  - Set up database connection in `config/db.ts`.
  - Generate models based on `api-contracts.md` schemas.
  - Add indexes for performance (e.g., `Product.category`).
- **Tools/Libraries**: `sequelize`, `pg`, `sequelize-typescript`, `sequelize-cli`.
- **Best Practices**: Use migrations for schema changes, enforce unique constraints, enable connection pooling.

### Goal 3: Middleware Setup

- **Subtasks**:
  - Implement error handling middleware.
  - Configure CORS and security middleware (Helmet, rate limiting).
  - Set up logging with Winston and Morgan.
- **Microgoals**:
  - Create `errorHandler.ts` for centralized error management.
  - Configure `helmet` with CSP and `cors` with allowlist.
  - Log HTTP requests and errors to files.
- **Tools/Libraries**: `helmet`, `cors`, `rate-limiter-flexible`, `express-sanitizer`, `winston`, `morgan`.
- **Best Practices**: Follow OWASP guidelines, log with unique IDs, rotate logs daily.

### Goal 4: Authentication and User Management

- **Subtasks**:
  - Implement JWT-based authentication endpoints.
  - Build user profile and address management APIs.
  - Add OAuth (Google) integration.
- **Microgoals**:
  - Create `/api/auth/*` routes (`login`, `register`, `reset-password`, etc.).
  - Implement `UserService` for profile CRUD and RBAC.
  - Configure `passport-google-oauth20` for OAuth.
- **Tools/Libraries**: `jsonwebtoken`, `bcrypt`, `passport`, `passport-jwt`, `passport-google-oauth20`, `express-validator`, `nodemailer`.
- **Best Practices**: Store refresh tokens in Redis, validate inputs, use secure password hashing.

### Goal 5: Product Management

- **Subtasks**:
  - Implement product catalog endpoints.
  - Add filtering, search, and review functionality.
- **Microgoals**:
  - Create `/api/products/*` routes (`list`, `details`, `search`).
  - Optimize search with PostgreSQL `tsvector`.
  - Integrate reviews into product details.
- **Tools/Libraries**: `sequelize`, `pg-tsquery`.
- **Best Practices**: Cache product lists in Redis, paginate results, use parameterized queries.

### Goal 6: Cart and Checkout System

- **Subtasks**:
  - Build cart management APIs.
  - Implement order creation and checkout flow.
- **Microgoals**:
  - Create `/api/cart/*` routes (`add`, `update`, `remove`).
  - Ensure `/api/orders` integrates with payment flow.
  - Use transactions for cart-to-order consistency.
- **Tools/Libraries**: `sequelize`, `express-validator`.
- **Best Practices**: Validate quantities, use atomic transactions, log cart changes.

### Goal 7: Payment and Transactions

- **Subtasks**:
  - Integrate Stripe for payments.
  - Implement transaction status updates and tracking.
- **Microgoals**:
  - Create `/api/payments/*` routes (`create-intent`, `confirm`).
  - Add `/api/orders/:id/status` for updates.
  - Set up Stripe webhooks for async updates.
- **Tools/Libraries**: `stripe`.
- **Best Practices**: Use idempotency keys, store transaction logs, handle payment failures.

### Goal 8: API Documentation, Caching, and Testing

- **Subtasks**:
  - Generate Swagger documentation.
  - Optimize caching for products and search.
  - Write unit and integration tests.
- **Microgoals**:
  - Set up `/api-docs` with Swagger UI.
  - Cache `/api/products` with Redis (TTL: 300s).
  - Test auth, products, and payment flows with Jest.
- **Tools/Libraries**: `swagger-ui-express`, `swagger-jsdoc`, `redis`, `jest`, `supertest`.
- **Best Practices**: Use OpenAPI 3.0, invalidate cache on updates, aim for 80% test coverage.

### Goal 9: Deployment and Finalization

- **Subtasks**:
  - Containerize with Docker.
  - Set up CI/CD with GitHub Actions.
  - Deploy to Render.com (alternative to Heroku for simplicity).
- **Microgoals**:
  - Create `Dockerfile` and `docker-compose.yml`.
  - Configure GitHub Actions for testing/deployment.
  - Perform end-to-end testing with Postman.
- **Tools/Libraries**: `docker`, `github-actions`, `postman`.
- **Best Practices**: Use environment-specific configs, enable auto-scaling, monitor logs.

## Step-by-Step Roadmap

**Duration**: 6-8 Hours (April 16, 2025, 11:16 AM PDT to \~7:16 PM PDT)

### Hour 1: Project Setup and Database (60 min)

- **Tasks**:
  - Initialize TypeScript project:

    ```bash
    npm init -y
    npm i express typescript ts-node-dev @types/express @types/node dotenv sequelize sequelize-typescript pg pg-hstore
    npm i -D @types/cors @types/morgan
    ```
  - Configure `tsconfig.json`:

    ```json
    {
      "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "strict": true,
        "esModuleInterop": true,
        "outDir": "./dist",
        "rootDir": "./src"
      }
    }
    ```
  - Set up folder structure:

    ```
    src/
    ├── config/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── controllers/
    ├── services/
    ├── utils/
    ├── docs/
    └── app.ts
    ```
  - Configure PostgreSQL and Sequelize:

    ```typescript
    // src/config/db.ts
    import { Sequelize } from 'sequelize-typescript';
    import * as dotenv from 'dotenv';
    dotenv.config();
    
    const sequelize = new Sequelize({
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      dialect: 'postgres',
      models: [__dirname + '/../models/*.model.ts'],
    });
    
    export default sequelize;
    ```
  - Generate models (`User`, `Product`, `Order`, `Cart`, `Address`, `Review`, `Category`) using `sequelize-cli`:

    ```bash
    npx sequelize-cli model:generate --name User --attributes id:uuid,name:string,email:string,password:string,role:enum
    ```
  - Create migrations and seeders based on `api-contracts.md` schemas.
- **Check After Completion**:
  - Verify database connection with `sequelize.authenticate()`.
  - Confirm models compile without errors.
  - Run migrations (`npx sequelize-cli db:migrate`).
- **Output**: `src/config/db.ts`, `src/models/*.model.ts`, `migrations/`, `seeders/`.

### Hour 2: Middleware Setup (45 min)

- **Tasks**:
  - Install middleware dependencies:

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
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        error: {
          code: statusCode,
          message: err.message,
          validation: err.errors,
          stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        },
      });
    };
    ```
  - Configure security and logging:

    ```typescript
    // src/app.ts
    import express from 'express';
    import helmet from 'helmet';
    import cors from 'cors';
    import morgan from 'morgan';
    import winston from 'winston';
    import { errorHandler } from './middleware/errorHandler';
    import { RateLimiterMemory } from 'rate-limiter-flexible';
    
    const app = express();
    const logger = winston.createLogger({
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
    
    const rateLimiter = new RateLimiterMemory({
      points: 100,
      duration: 60,
    });
    
    app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } } }));
    app.use(cors({ origin: process.env.CLIENT_URL }));
    app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg) } }));
    app.use(express.json());
    app.use(async (req, res, next) => {
      try {
        await rateLimiter.consume(req.ip);
        next();
      } catch {
        res.status(429).json({ error: 'Too Many Requests' });
      }
    });
    app.use(errorHandler);
    
    export default app;
    ```
- **Check After Completion**:
  - Verify CORS allows `CLIENT_URL`.
  - Check logs in `logs/` directory.
  - Test rate limiter with repeated requests.
- **Output**: `src/middleware/errorHandler.ts`, `src/app.ts`, `logs/`.

### Hour 3: Authentication and User Management (60 min)

- **Tasks**:
  - Install auth dependencies:

    ```bash
    npm i jsonwebtoken bcrypt passport passport-jwt passport-google-oauth20 nodemailer express-validator
    npm i -D @types/jsonwebtoken @types/bcrypt @types/passport @types/passport-jwt @types/passport-google-oauth20
    ```
  - Implement auth endpoints:

    ```typescript
    // src/routes/auth.ts
    import { Router } from 'express';
    import { login, register, forgotPassword, resetPassword, refreshToken, logout } from '../controllers/auth.controller';
    import { validate } from '../middleware/validate';
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
    router.post('/register', validate([/* similar validations */]), register);
    router.post('/forgot-password', forgotPassword);
    router.post('/reset-password', resetPassword);
    router.post('/refresh-token', refreshToken);
    router.post('/logout', logout);
    
    export default router;
    ```
  - Create auth controller with sample task for LLM: **Sample LLM Prompt**:

    ```
    Create a TypeScript Express controller function for user login that:
    - Takes email and password from request body
    - Validates credentials using bcrypt
    - Generates a JWT token with user ID and role
    - Returns token and user data as per the CrownKing API contract:
      {
        token: string,
        user: { id: string, name: string, email: string, role: 'user' | 'admin', createdAt: string }
      }
    - Uses Sequelize to query the User model
    - Throws custom errors for invalid credentials
    - Follows TypeScript best practices with proper types
    ```

    **Expected Output**:

    ```typescript
    // src/controllers/auth.controller.ts
    import { Request, Response, NextFunction } from 'express';
    import bcrypt from 'bcrypt';
    import jwt from 'jsonwebtoken';
    import { User } from '../models/user.model';
    
    interface LoginRequest {
      email: string;
      password: string;
    }
    
    export const login = async (req: Request<{}, {}, LoginRequest>, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          const error = new Error('Invalid credentials') as any;
          error.statusCode = 401;
          throw error;
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        });
      } catch (err) {
        next(err);
      }
    };
    ```
  - Implement user profile and address routes (`/api/user/profile`, `/api/user/addresses/*`).
  - Configure OAuth with `passport`:

    ```typescript
    // src/config/passport.ts
    import passport from 'passport';
    import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
    
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
      // Handle user creation/login
    }));
    ```
- **Check After Completion**:
  - Test `/api/auth/login` with Postman.
  - Verify JWT token decoding.
  - Check email sending for password reset.
- **Output**: `src/routes/auth.ts`, `src/controllers/auth.controller.ts`, `src/config/passport.ts`.

### Hour 4: Product Management (60 min)

- **Tasks**:
  - Create product routes:

    ```typescript
    // src/routes/products.ts
    import { Router } from 'express';
    import { getProducts, getProductById, searchProducts } from '../controllers/products.controller';
    
    const router = Router();
    
    router.get('/', getProducts);
    router.get('/:id', getProductById);
    router.get('/search', searchProducts);
    
    export default router;
    ```
  - Implement search with PostgreSQL `tsvector`:

    ```typescript
    // src/controllers/products.controller.ts
    import { Request, Response, NextFunction } from 'express';
    import { Product } from '../models/product.model';
    import { Op } from 'sequelize';
    
    export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { query, page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const products = await Product.findAndCountAll({
          where: query ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${query}%` } },
              { description: { [Op.iLike]: `%${query}%` } },
            ],
          } : {},
          limit: Number(limit),
          offset,
        });
        res.json({
          products: products.rows,
          total: products.count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(products.count / Number(limit)),
        });
      } catch (err) {
        next(err);
      }
    };
    ```
  - Add review endpoints (`/api/products/:productId/reviews/*`).
- **Check After Completion**:
  - Test `/api/products` pagination and filtering.
  - Verify search returns relevant results.
  - Check reviews appear in product details.
- **Output**: `src/routes/products.ts`, `src/controllers/products.controller.ts`.

### Hour 5: Cart and Checkout (60 min)

- **Tasks**:
  - Implement cart routes:

    ```typescript
    // src/routes/cart.ts
    import { Router } from 'express';
    import { getCart, addToCart, updateCartItem, removeCartItem } from '../controllers/cart.controller';
    import { authMiddleware } from '../middleware/auth';
    
    const router = Router();
    
    router.get('/', authMiddleware, getCart);
    router.post('/', authMiddleware, addToCart);
    router.put('/:itemId', authMiddleware, updateCartItem);
    router.delete('/:itemId', authMiddleware, removeCartItem);
    
    export default router;
    ```
  - Create order routes:

    ```typescript
    // src/routes/orders.ts
    import { Router } from 'express';
    import { createOrder, getOrders, getOrderById, cancelOrder } from '../controllers/orders.controller';
    import { authMiddleware } from '../middleware/auth';
    
    const router = Router();
    
    router.post('/', authMiddleware, createOrder);
    router.get('/', authMiddleware, getOrders);
    router.get('/:id', authMiddleware, getOrderById);
    router.post('/:id/cancel', authMiddleware, cancelOrder);
    
    export default router;
    ```
  - Use transactions for checkout:

    ```typescript
    // src/controllers/orders.controller.ts
    import { Request, Response, NextFunction } from 'express';
    import { sequelize } from '../config/db';
    import { Order } from '../models/order.model';
    import { Cart } from '../models/cart.model';
    
    export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
      const transaction = await sequelize.transaction();
      try {
        const cart = await Cart.findAll({ where: { userId: req.user!.id } });
        const order = await Order.create({
          userId: req.user!.id,
          items: cart,
          total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
          status: 'pending',
        }, { transaction });
        await Cart.destroy({ where: { userId: req.user!.id }, transaction });
        await transaction.commit();
        res.json(order);
      } catch (err) {
        await transaction.rollback();
        next(err);
      }
    };
    ```
- **Check After Completion**:
  - Test cart CRUD operations.
  - Verify order creation clears cart.
  - Check transaction rollback on failure.
- **Output**: `src/routes/cart.ts`, `src/routes/orders.ts`, `src/controllers/cart.controller.ts`, `src/controllers/orders.controller.ts`.

### Hour 6: Payment and Transactions (45 min)

- **Tasks**:
  - Install Stripe:

    ```bash
    npm i stripe
    npm i -D @types/stripe
    ```
  - Implement payment routes:

    ```typescript
    // src/routes/payments.ts
    import { Router } from 'express';
    import { createPaymentIntent, confirmPayment } from '../controllers/payments.controller';
    import { authMiddleware } from '../middleware/auth';
    
    const router = Router();
    
    router.post('/create-intent', authMiddleware, createPaymentIntent);
    router.post('/confirm', authMiddleware, confirmPayment);
    
    export default router;
    ```
  - Create payment controller:

    ```typescript
    // src/controllers/payments.controller.ts
    import { Request, Response, NextFunction } from 'express';
    import Stripe from 'stripe';
    
    const stripe = new Stripe(process.env.STRIPE_KEY!, { apiVersion: '2023-10-16' });
    
    export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { orderId, amount } = req.body;
        const intent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: 'usd',
          payment_method_types: ['card'],
          metadata: { orderId },
        });
        res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
      } catch (err) {
        next(err);
      }
    };
    ```
  - Add transaction status updates:

    ```typescript
    // src/controllers/orders.controller.ts
    export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        if (!order) throw new Error('Order not found');
        order.status = status;
        await order.save();
        res.json(order);
      } catch (err) {
        next(err);
      }
    };
    ```
- **Check After Completion**:
  - Test payment intent creation with Stripe sandbox.
  - Verify order status updates.
  - Check webhook setup (local testing with `stripe listen`).
- **Output**: `src/routes/payments.ts`, `src/controllers/payments.controller.ts`.

### Hour 7: Documentation, Caching, and Testing (60 min)

- **Tasks**:
  - Install documentation and testing dependencies:

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
        info: { title: 'CrownKing API', version: '1.0.0', description: 'E-commerce API' },
      },
      apis: ['./src/routes/*.ts'],
    };
    
    const swaggerSpec = swaggerJsDoc(options);
    
    export const setupSwagger = (app: express.Express) => {
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    };
    ```
  - Configure Redis caching:

    ```typescript
    // src/middleware/cache.ts
    import { Request, Response, NextFunction } from 'express';
    import redis from 'redis';
    
    const client = redis.createClient({ url: process.env.REDIS_URL });
    client.connect();
    
    export const cacheMiddleware = (ttl: number) => async (req: Request, res: Response, next: NextFunction) => {
      const key = `cache:${req.originalUrl}`;
      const cached = await client.get(key);
      if (cached) return res.json(JSON.parse(cached));
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        client.setEx(key, ttl, JSON.stringify(body));
        return originalJson(body);
      };
      next();
    };
    ```
  - Write tests:

    ```typescript
    // src/tests/products.test.ts
    import request from 'supertest';
    import app from '../app';
    import { sequelize } from '../config/db';
    
    beforeAll(() => sequelize.sync());
    afterAll(() => sequelize.close());
    
    describe('Product API', () => {
      it('should get products', async () => {
        const res = await request(app).get('/api/products?page=1&limit=10');
        expect(res.status).toBe(200);
        expect(res.body.products).toBeInstanceOf(Array);
      });
    });
    ```
- **Check After Completion**:
  - Access `/api-docs` and verify endpoint documentation.
  - Test caching with repeated `/api/products` calls.
  - Run `npm test` and check coverage.
- **Output**: `src/docs/swagger.ts`, `src/middleware/cache.ts`, `src/tests/`.

### Hour 8: Deployment and Finalization (60 min)

- **Tasks**:
  - Create `Dockerfile`:

    ```dockerfile
    # Dockerfile
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
    ```
  - Set up GitHub Actions:

    ```yaml
    # .github/workflows/ci.yml
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
  - Deploy to Render.com:
    - Create a new web service, link GitHub repo, set environment variables.
    - Use PostgreSQL and Redis add-ons.
  - Update `README.md`:

    ```markdown
    # CrownKing Backend
    ## Setup
    ```bash
    npm install
    npm run build
    npm start
    ```

    ## Environment Variables
    - `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_HOST`
    - `JWT_SECRET`, `STRIPE_KEY`, `REDIS_URL`

    ```
    
    ```
- **Check After Completion**:
  - Verify app runs with `docker-compose up`.
  - Check deployment on Render.com.
  - Test all endpoints with Postman.
- **Output**: `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`, updated `README.md`.

## Best Practices and Libraries

- **TypeScript**:
  - Use interfaces for request/response types.
  - Enable `strictNullChecks` and `noImplicitAny`.
- **Modularity**: Organize by feature (`auth`, `products`) with controllers, services, and models.
- **Error Handling**: Centralize with custom error classes:

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
  - Follow OWASP Top 10 (OWASP).
  - Sanitize inputs with `express-sanitizer`.
  - Limit requests to 100/min per IP.
- **Performance**:
  - Cache with Redis (`TTL: 300s` for products).
  - Optimize Sequelize with `raw: true` for large queries.
- **Documentation**:
  - Use JSDoc for code comments.
  - Keep Swagger in sync with `api-contracts.md`.
- **Libraries**:
  - `express`, `@types/express`: Core framework.
  - `sequelize-typescript`, `pg`: ORM and database.
  - `jsonwebtoken`, `bcrypt`: Authentication.
  - `stripe`: Payments.
  - `winston`, `morgan`: Logging.
  - `swagger-ui-express`, `swagger-jsdoc`: API docs.
  - `jest`, `supertest`: Testing.
  - `helmet`, `rate-limiter-flexible`, `express-sanitizer`: Security.

## Tools for Speed

- **Cursor**: Generate boilerplate, debug errors, write tests.
- **Postman**: Test APIs during development.
- **Sequelize CLI**: Automate model/migration creation.
- **Render CLI**: Simplify deployment (`render deploy`).
- **Docker Desktop**: Test containers locally.

## Security and Scalability

- **Security**:
  - Enable HTTPS via Render’s SSL.
  - Use `helmet.contentSecurityPolicy` to restrict scripts.
  - Validate all inputs with `express-validator`.
- **Scalability**:
  - Use Redis for caching and session management.
  - Configure Render auto-scaling (1-10 instances).
  - Optimize database with indexes (`Product.name`, `Order.createdAt`).

## Testing Strategy

- **Unit Tests**: Test services (`AuthService`, `PaymentService`) with Jest.
- **Integration Tests**: Test endpoints with `supertest`, mocking Stripe/Redis.
- **End-to-End**: Verify flows (login → cart → checkout) with Postman.
- **Coverage Goal**: 80% for services, 60% for routes.

## Deployment Strategy

- **Platform**: Render.com for simplicity over Heroku (free tier available).
- **CI/CD**: GitHub Actions to run tests and deploy on push.
- **Monitoring**: Use Render’s logs and integrate New Relic for performance.

## Risk Mitigation

| **Risk** | **Early Warning** | **Contingency** |
| --- | --- | --- |
| Time Overrun | Tasks exceed hourly estimates | Prioritize auth, products, payments; defer OAuth |
| Type Errors | TypeScript compilation fails | Use Cursor to fix types; fallback to `any` temporarily |
| API Failures | Postman tests fail | Debug with Cursor; mock external services |
| Deployment Issues | Render errors | Test locally with Docker; use Render support |

## Key Performance Indicators

- **Completion Time**: 6-8 hours.
- **API Uptime**: 99.9% post-deployment.
- **Test Coverage**: 80% services, 60% routes.
- **Error Rate**: &lt;1% in Postman tests.
- **Response Time**: &lt;200ms for cached endpoints.

## Conclusion

This TypeScript-based roadmap ensures a robust CrownKing backend within hours, leveraging Cursor for speed and aligning with `api-contracts.md`. The modular architecture, type safety, and comprehensive testing make it production-ready, with Render deployment enabling immediate use. Future enhancements (e.g., GraphQL, WebSockets) can build on this foundation, keeping CrownKing competitive as of April 16, 2025.

## Citations

- Node.js Best Practices
- Sequelize Documentation
- TypeScript Documentation
- Nodemailer Documentation
- Stripe Node.js
- Winston Logging
- Swagger UI Express
- Node Redis
- Jest Testing
- Render Documentation
- GitHub Actions
- Postman
- OWASP Top 10