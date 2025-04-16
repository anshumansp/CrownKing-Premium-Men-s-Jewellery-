# CrownKing E-commerce Backend

This is the backend service for the CrownKing men's jewelry e-commerce platform. It provides APIs for product management, user authentication, cart operations, order processing, and payment integration.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Caching**: Redis
- **Authentication**: JWT
- **Payment Processing**: Stripe
- **Deployment**: Docker / Render.com

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL
- Redis (optional for development)
- Docker (for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/crownking-backend.git
   cd crownking-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Using Docker

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

## API Documentation

Once the server is running, you can access the API documentation at:
http://localhost:5000/api-docs

## Project Structure

```
crownking-backend/
├── src/
│   ├── api/                    # API routes and controllers
│   ├── config/                 # Configuration files
│   ├── middleware/             # Custom middleware
│   ├── models/                 # Sequelize models
│   ├── services/               # Business logic
│   ├── utils/                  # Reusable utilities
│   ├── docs/                   # API documentation
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
└── [Other config files]
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint the code
- `npm run format` - Format the code

## License

[MIT](LICENSE)
