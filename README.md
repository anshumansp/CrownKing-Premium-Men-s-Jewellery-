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
- **Profile Management**: Update personal details and manage addresses

### Technical Features
- **Modern UI**: Sleek, minimalist design with animations and transitions
- **Secure Authentication**: JWT-based authentication system
- **Payment Integration**: Stripe payment processing
- **Form Validation**: Client and server-side validation
- **API Error Handling**: Robust error handling and user-friendly error messages
- **Optimized Images**: Fast-loading product images

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript
- **React**: 19.1.0
- **Styling**: Tailwind CSS
- **State Management**: React Redux with Redux Toolkit
- **Animations**: Framer Motion
- **Payment**: Stripe JS
- **Icons**: Heroicons, React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT, Passport (Google OAuth)
- **Payment Processing**: Stripe API
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston, Morgan
- **Validation**: Express Validator

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
   API_URL=http://localhost:5000/api
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
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
│       │   ├── about/        # About page
│       │   ├── blog/         # Blog section
│       │   ├── care/         # Jewelry care guides
│       │   ├── cart/         # Shopping cart
│       │   ├── checkout/     # Checkout process
│       │   ├── contact/      # Contact page
│       │   ├── faq/          # FAQ page
│       │   ├── orders/       # Order history and tracking
│       │   ├── payments/     # Payment processing
│       │   ├── products/     # Product listing and details
│       │   ├── profile/      # User profile management
│       │   └── wishlist/     # User wishlist
│       ├── components/       # Reusable React components
│       ├── hooks/            # Custom React hooks
│       ├── types/            # TypeScript type definitions
│       └── utils/            # Utility functions
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── package.json          # Frontend dependencies
│
└── backend/                  # Express.js backend
    ├── src/                  # Source code
    │   ├── api/              # API endpoints
    │   ├── config/           # Configuration files
    │   ├── middleware/       # Express middleware
    │   ├── migrations/       # Database migrations
    │   ├── models/           # Sequelize models
    │   ├── services/         # Business logic services
    │   ├── types/            # TypeScript types
    │   ├── utils/            # Utility functions
    │   ├── app.ts            # Express app setup
    │   └── server.ts         # Server entry point
    └── package.json          # Backend dependencies
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Protected routes require valid tokens
- Token expiration is set to 7 days
- Google OAuth login option available

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
- `GET /api/auth/google` - Google OAuth authentication

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

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/addresses` - Get user addresses
- `POST /api/user/addresses` - Add new address
- `PUT /api/user/addresses/:id` - Update address
- `DELETE /api/user/addresses/:id` - Delete address

## 🚀 Deployment

### Frontend
The frontend can be deployed to Vercel:
```bash
cd frontend
vercel
```

### Backend
The backend can be deployed to platforms like Heroku, Railway, or DigitalOcean.

## ⚠️ Known Issues

- Dynamic route parameters in `/products/[id]` need to be awaited before use
- Missing product images at `/images/products/`

## 📝 License

This project is licensed under the MIT License

## 👤 Contributors

- [Anshuman Parmar](https://github.com/anshumansp) - Lead Developer

---

**CrownKing** - Distinctive Elegance for Men | Premium men's jewelry crafted with precision and sophistication 