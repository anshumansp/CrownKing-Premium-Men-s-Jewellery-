# CrownKing - Premium Men's Jewelry E-commerce

![CrownKing Logo](frontend/public/CrownKing.svg)

CrownKing is a full-stack e-commerce platform specializing in premium men's jewelry. The application offers a seamless shopping experience with a sleek, modern interface for customers to browse and purchase high-quality jewelry items.

## ✨ Features

### Customer Features
- **Product Browsing**: Explore products with filtering by category, price range, and ratings
- **Product Details**: View comprehensive product information, specifications, and images
- **Shopping Cart**: Add items to cart, modify quantities, and review before checkout
- **User Authentication**: Register, login, and password recovery functionality
- **Checkout Process**: Secure checkout with shipping details and payment processing
- **Order Management**: Track orders and view order history
- **Order Confirmation**: Receive confirmation with order details after purchase
- **Wishlist**: Save favorite items for future purchase
- **Responsive Design**: Optimized for all devices (desktop, tablet, mobile)

### Technical Features
- **Modern UI**: Sleek, minimalist design with animations and transitions
- **Secure Authentication**: JWT-based authentication system
- **Payment Integration**: Stripe payment processing
- **Form Validation**: Client and server-side validation
- **API Error Handling**: Robust error handling and user-friendly error messages
- **Optimized Images**: Fast-loading product images

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **Payment**: Stripe JS
- **Icons**: Heroicons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Processing**: Stripe API
- **Security**: Helmet, CORS, Rate Limiting
- **Caching**: Redis (optional)

## 📋 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/crownking.git
cd crownking
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Set up environment variables
   - Create `.env.local` in the frontend directory
   - Create `.env` in the backend directory

   Example backend `.env`:
   ```
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/crownking
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   NODE_ENV=development
   ```

   Example frontend `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

5. Set up the database
```bash
cd backend
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

6. Run the application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
crownking/
├── frontend/                 # Next.js frontend
│   ├── public/               # Static assets
│   └── src/                  # Source code
│       ├── app/              # Next.js app router
│       │   ├── auth/         # Authentication pages
│       │   ├── cart/         # Shopping cart
│       │   ├── checkout/     # Checkout process
│       │   ├── orders/       # Order history and confirmation
│       │   └── products/     # Product listing and details
│       ├── components/       # Reusable React components
│       ├── hooks/            # Custom React hooks
│       ├── types/            # TypeScript type definitions
│       └── utils/            # Utility functions
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── package.json          # Frontend dependencies
│
└── backend/                  # Express.js backend
    ├── config/               # Configuration files
    ├── controllers/          # Route controllers
    ├── middleware/           # Express middleware
    ├── models/               # Sequelize models
    ├── routes/               # API routes
    ├── utils/                # Utility functions
    └── package.json          # Backend dependencies
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Protected routes require valid tokens
- Token expiration is set to 7 days

## 💳 Payment Processing

Payment is handled securely through Stripe:
- Credit card processing
- Secure checkout flow
- Payment confirmation

## 🌐 API Endpoints

The backend provides the following API endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/forgot-password` - Request password reset

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create a new order

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent

## 🚀 Deployment

### Frontend
The frontend can be deployed to Vercel:
```bash
cd frontend
vercel
```

### Backend
The backend can be deployed to platforms like Heroku, Railway, or DigitalOcean.

## 📝 License

This project is licensed under the MIT License

## 👤 Contributors

- [Your Name](https://github.com/yourusername) - Lead Developer

---

**CrownKing** - Distinctive Elegance for Men | Premium men's jewelry crafted with precision and sophistication 