# CrownKing E-commerce Platform API Contracts

This document outlines the API contracts for the CrownKing e-commerce platform, detailing the integration points between the frontend and backend, required data models, and endpoints.

## Authentication

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "user" | "admin",
      "createdAt": "string"
    }
  }
  ```

### Register
- **Endpoint**: `POST /api/auth/register`
- **Request**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: Same as login

### Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Request**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "string"
  }
  ```

## Products

### Get All Products
- **Endpoint**: `GET /api/products`
- **Query Parameters**:
  - `category`: Filter by category
  - `subCategory`: Filter by sub-category
  - `priceMin`: Minimum price
  - `priceMax`: Maximum price
  - `rating`: Minimum rating
  - `sortBy`: Sort options (price-asc, price-desc, newest, rating)
  - `limit`: Number of items to return
  - `page`: Page number
- **Response**:
  ```json
  {
    "products": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "images": ["string"],
        "category": "string",
        "subCategory": "string",
        "specifications": {
          "material": "string",
          "weight": "string",
          "dimensions": "string",
          "warranty": "string"
        },
        "rating": "number",
        "reviews": "number",
        "inStock": "boolean",
        "featured": "boolean",
        "discount": "number",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Get Product by ID
- **Endpoint**: `GET /api/products/:id`
- **Response**: Individual product object

### Get Featured Products
- **Endpoint**: `GET /api/products/featured`
- **Response**: Array of product objects

### Get New Arrivals
- **Endpoint**: `GET /api/products/new-arrivals`
- **Response**: Array of product objects

### Get Best Sellers
- **Endpoint**: `GET /api/products/best-sellers`
- **Response**: Array of product objects

### Get Top Rated Products
- **Endpoint**: `GET /api/products/top-rated`
- **Response**: Array of product objects

### Get Product Categories
- **Endpoint**: `GET /api/products/categories`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string"
    }
  ]
  ```

## Cart

### Get Cart
- **Endpoint**: `GET /api/cart`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "quantity": "number",
      "images": ["string"],
      "category": "string",
      "subCategory": "string",
      "specifications": {
        "material": "string",
        "weight": "string",
        "dimensions": "string",
        "warranty": "string"
      },
      "rating": "number",
      "reviews": "number",
      "inStock": "boolean",
      "featured": "boolean",
      "discount": "number"
    }
  ]
  ```

### Add to Cart
- **Endpoint**: `POST /api/cart`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "productId": "string",
    "quantity": "number"
  }
  ```
- **Response**: Updated cart array

### Update Cart Item
- **Endpoint**: `PUT /api/cart/:itemId`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "quantity": "number"
  }
  ```
- **Response**: Updated cart array

### Remove Cart Item
- **Endpoint**: `DELETE /api/cart/:itemId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Updated cart array

## Orders

### Create Order
- **Endpoint**: `POST /api/orders`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "items": ["CartItem objects"],
    "shippingAddress": {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    },
    "total": "number"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "items": ["CartItem objects"],
    "total": "number",
    "status": "pending",
    "createdAt": "string",
    "shippingAddress": {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    }
  }
  ```

### Process Payment
- **Endpoint**: `POST /api/orders/:orderId/payment`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "paymentMethodId": "string",
    "amount": "number"
  }
  ```
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string",
    "orderId": "string"
  }
  ```

### Get User Orders
- **Endpoint**: `GET /api/orders`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of order objects

### Get Order by ID
- **Endpoint**: `GET /api/orders/:id`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Order object

### Cancel Order
- **Endpoint**: `POST /api/orders/:orderId/cancel`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string",
    "orderId": "string"
  }
  ```

## User Profile

### Get User Profile
- **Endpoint**: `GET /api/user/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: User object

### Update User Profile
- **Endpoint**: `PUT /api/user/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    }
  }
  ```
- **Response**: Updated user object

## Contact Form

### Submit Contact Form
- **Endpoint**: `POST /api/contact`
- **Request**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "subject": "string",
    "message": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

## Wishlist

### Get Wishlist
- **Endpoint**: `GET /api/wishlist`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Array of product objects

### Add to Wishlist
- **Endpoint**: `POST /api/wishlist`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "productId": "string"
  }
  ```
- **Response**: Updated wishlist array

### Remove from Wishlist
- **Endpoint**: `DELETE /api/wishlist/:productId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Updated wishlist array

## Blog

### Get Blog Posts
- **Endpoint**: `GET /api/blog`
- **Query Parameters**:
  - `category`: Filter by category
  - `limit`: Number of items to return
  - `page`: Page number
- **Response**:
  ```json
  {
    "posts": [
      {
        "id": "string",
        "title": "string",
        "excerpt": "string",
        "content": "string",
        "date": "string",
        "author": "string",
        "authorRole": "string",
        "category": "string",
        "readTime": "string",
        "image": "string",
        "slug": "string"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Get Blog Post by Slug
- **Endpoint**: `GET /api/blog/:slug`
- **Response**: Blog post object

## FAQ

### Get FAQ Items
- **Endpoint**: `GET /api/faq`
- **Query Parameters**:
  - `category`: Filter by category
- **Response**:
  ```json
  [
    {
      "id": "string",
      "question": "string",
      "answer": "string",
      "category": "string"
    }
  ]
  ```

## Data Schemas

### Product Schema
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subCategory: string;
  specifications: {
    material: string;
    weight: string;
    dimensions: string;
    warranty: string;
  };
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  discount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Cart Item Schema
```typescript
{
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  category: string;
  subCategory: string;
  specifications: {
    [key: string]: string;
  };
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  discount: number;
}
```

### Order Schema
```typescript
{
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  };
}
```

### User Schema
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
}
```

### Category Schema
```typescript
{
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}
```

### Blog Post Schema
```typescript
{
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  image: string;
  slug: string;
}
```

### FAQ Item Schema
```typescript
{
  id: string;
  question: string;
  answer: string;
  category: string;
}
```

## Sample Data (For Initial Database Population)

### Products
```javascript
const products = [
  {
    id: '1',
    name: 'Luxury Gold Chain Necklace',
    description: 'Premium handcrafted 24K gold chain necklace for men, perfect for special occasions',
    price: 82917,
    images: ['/jewe1.webp'],
    category: 'Necklaces',
    subCategory: 'Gold',
    specifications: {
      material: '24K Gold',
      weight: '45g',
      dimensions: '20 inches',
      warranty: '2 years',
    },
    rating: 4.8,
    reviews: 124,
    inStock: true,
    featured: true,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Classic Silver Bracelet',
    description: 'Elegant pure silver bracelet with contemporary design for the modern man',
    price: 38171,
    images: ['/jewe2.webp'],
    category: 'Bracelets',
    subCategory: 'Silver',
    specifications: {
      material: 'Pure Silver',
      weight: '25g',
      dimensions: '8 inches',
      warranty: '1 year',
    },
    rating: 4.7,
    reviews: 98,
    inStock: true,
    featured: true,
    discount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Diamond-Studded Ring',
    description: 'Premium gold ring with authentic diamond studs for an elegant statement',
    price: 107891,
    images: ['/jewe3.jpeg'],
    category: 'Rings',
    subCategory: 'Diamond',
    specifications: {
      material: '18K Gold with Diamonds',
      weight: '12g',
      dimensions: 'Size 10',
      warranty: '5 years',
    },
    rating: 4.9,
    reviews: 76,
    inStock: true,
    featured: true,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Royal Platinum Cufflinks',
    description: 'Sophisticated platinum cufflinks with minimalist design for formal occasions',
    price: 66391,
    images: ['/jewe4.jpg'],
    category: 'Accessories',
    subCategory: 'Cufflinks',
    specifications: {
      material: 'Platinum',
      weight: '15g',
      dimensions: '1.5 cm diameter',
      warranty: '3 years',
    },
    rating: 4.6,
    reviews: 45,
    inStock: true,
    featured: true,
    discount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Designer Gold Ring',
    description: 'Artisan crafted designer gold ring with unique patterns',
    price: 64999,
    images: ['/jewe5.jpg'],
    category: 'Rings',
    subCategory: 'Gold',
    specifications: {
      material: '22K Gold',
      weight: '8g',
      dimensions: 'Size 9',
      warranty: '2 years',
    },
    rating: 4.5,
    reviews: 87,
    inStock: true,
    featured: true,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Premium Silver Earrings',
    description: 'Sophisticated silver earrings for men with minimalist design',
    price: 29990,
    images: ['/jewe6.avif'],
    category: 'Earrings',
    subCategory: 'Silver',
    specifications: {
      material: 'Pure Silver',
      weight: '5g',
      dimensions: '1.2 cm',
      warranty: '1 year',
    },
    rating: 4.3,
    reviews: 58,
    inStock: true,
    featured: true,
    discount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Royal Gold Bracelet',
    description: 'Luxurious gold bracelet with intricate design and premium finish',
    price: 95990,
    images: ['/jewe7.webp'],
    category: 'Bracelets',
    subCategory: 'Gold',
    specifications: {
      material: '24K Gold',
      weight: '35g',
      dimensions: '7.5 inches',
      warranty: '5 years',
    },
    rating: 4.9,
    reviews: 112,
    inStock: true,
    featured: true,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Diamond Pendant Chain',
    description: 'Stylish pendant chain with authentic diamond centerpiece',
    price: 74999,
    images: ['/jewe8.webp'],
    category: 'Necklaces',
    subCategory: 'Diamond',
    specifications: {
      material: '18K Gold with Diamond',
      weight: '20g',
      dimensions: '22 inches',
      warranty: '3 years',
    },
    rating: 4.7,
    reviews: 68,
    inStock: true,
    featured: true,
    discount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Classic Tie Pin',
    description: 'Elegant gold tie pin with subtle design patterns for formal wear',
    price: 15990,
    images: ['/jewe9.jpg'],
    category: 'Accessories',
    subCategory: 'Tie Pins',
    specifications: {
      material: '18K Gold',
      weight: '6g',
      dimensions: '5.5 cm',
      warranty: '1 year',
    },
    rating: 4.4,
    reviews: 42,
    inStock: true,
    featured: true,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Luxury Tungsten Ring',
    description: 'Modern tungsten carbide ring with sleek black finish for the contemporary man',
    price: 42599,
    images: ['/jewe10.jpg'],
    category: 'Rings',
    subCategory: 'Tungsten',
    specifications: {
      material: 'Tungsten Carbide',
      weight: '18g',
      dimensions: 'Size 11',
      warranty: '2 years',
    },
    rating: 4.6,
    reviews: 59,
    inStock: true,
    featured: true,
    discount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Elegant Leather Bracelet',
    description: 'Sophisticated braided leather bracelet with stainless steel magnetic clasp',
    price: 18499,
    images: ['/jewe11.webp'],
    category: 'Bracelets',
    subCategory: 'Leather',
    specifications: {
      material: 'Premium Leather and Stainless Steel',
      weight: '12g',
      dimensions: '8.5 inches',
      warranty: '1 year',
    },
    rating: 4.5,
    reviews: 73,
    inStock: true,
    featured: true,
    discount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Diamond-Accented Watch',
    description: 'Luxury chronograph watch with diamond accents and premium leather strap',
    price: 154999,
    images: ['/jewe12.webp'],
    category: 'Watches',
    subCategory: 'Luxury',
    specifications: {
      material: 'Stainless Steel with Diamond Accents',
      weight: '85g',
      dimensions: '42mm case',
      warranty: '5 years',
    },
    rating: 4.9,
    reviews: 94,
    inStock: true,
    featured: true,
    discount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
```

### FAQ Items
```javascript
const faqItems = [
  {
    id: 'materials-used',
    question: 'What materials are used in your jewelry?',
    answer: 'Our men\'s jewelry collection features premium materials including 925 Sterling Silver, 14K and 18K Gold (yellow, white, and rose), Stainless Steel, and Titanium. We source ethically mined diamonds and gemstones for our statement pieces. Each product description provides detailed information about the specific materials used.',
    category: 'products'
  },
  {
    id: 'size-guide',
    question: 'How do I determine the right size for my rings and bracelets?',
    answer: 'For accurate sizing, we recommend visiting a local jeweler for professional measurement. However, you can also use our printable size guide (available on product pages), measure a ring that fits you well and compare to our size chart, or for bracelets, measure your wrist with a flexible tape measure and add 0.5-1 inch for comfort.',
    category: 'products'
  },
  {
    id: 'custom-jewelry',
    question: 'Do you offer custom or personalized jewelry?',
    answer: 'Yes, we offer customization services including engraving, personalized designs, and bespoke pieces. For custom orders, please contact our design team to discuss your requirements. Custom pieces typically require 3-6 weeks for completion, depending on complexity.',
    category: 'products'
  },
  {
    id: 'hypoallergenic',
    question: 'Are your products hypoallergenic?',
    answer: 'Many of our pieces are suitable for sensitive skin. Our stainless steel, titanium, and platinum pieces are hypoallergenic. Our gold jewelry is nickel-free, making it suitable for most people with metal sensitivities. Each product description specifies material composition for transparency.',
    category: 'products'
  },
  {
    id: 'shipping-time',
    question: 'How long will it take to receive my order?',
    answer: 'Shipping timeframes vary based on your location and selected shipping method: Standard Shipping: 3-5 business days (domestic), Express Shipping: 1-2 business days (domestic), International Shipping: 7-14 business days.',
    category: 'orders'
  },
  {
    id: 'order-tracking',
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a confirmation email with tracking information. You can also track your order by signing into your account and visiting the "Order History" section. If you\'ve created a guest checkout, use the order number and email address provided during checkout on our order tracking page.',
    category: 'orders'
  },
  {
    id: 'international-shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. International orders may be subject to import duties, taxes, and customs clearance fees, which are the responsibility of the recipient. Delivery times for international shipments typically range from 7-14 business days, depending on the destination country and customs processing.',
    category: 'orders'
  },
  {
    id: 'order-changes',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'Order modifications or cancellations can be accommodated if requested within 2 hours of placing your order. Once an order enters processing, we may not be able to make changes. Please contact our customer service team immediately if you need to modify or cancel your order.',
    category: 'orders'
  },
  {
    id: 'return-policy',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for unworn items in their original condition with all packaging and documentation. Custom and personalized items cannot be returned unless there is a manufacturing defect.',
    category: 'returns'
  },
  {
    id: 'refund-processing',
    question: 'How long does it take to process a refund?',
    answer: 'Once we receive and inspect your returned item, refunds are typically processed within 3-5 business days. The time it takes for the refund to appear in your account depends on your payment method and financial institution, usually an additional 2-10 business days.',
    category: 'returns'
  },
  {
    id: 'exchanges',
    question: 'How do exchanges work?',
    answer: 'For exchanges, initiate a standard return through our Returns Portal and place a new order for the desired item. If you prefer a direct exchange, please contact our customer service team who can assist with the process and ensure you\'re not charged twice.',
    category: 'returns'
  },
  {
    id: 'damaged-items',
    question: 'What if I receive a damaged or incorrect item?',
    answer: 'If your item arrives damaged or is incorrect, please contact us within 48 hours of receipt. Please provide your order number, photos of the damaged/incorrect item, and a description of the issue. We\'ll arrange for a replacement or refund at no additional cost to you, including return shipping.',
    category: 'returns'
  },
  {
    id: 'jewelry-care',
    question: 'How should I care for my jewelry?',
    answer: 'Proper care ensures your jewelry remains in excellent condition for years: Store pieces individually to prevent scratches, remove jewelry before swimming, showering, or physical activities, clean regularly with a soft cloth and appropriate jewelry cleaner, and avoid exposure to harsh chemicals and perfumes.',
    category: 'care'
  },
  {
    id: 'cleaning-products',
    question: 'What cleaning products should I use for my jewelry?',
    answer: 'We recommend using mild soap and warm water for most pieces. For silver, use a designated silver polishing cloth. For gold and platinum, a soft brush with mild soap works well. Avoid harsh chemicals, ultrasonic cleaners (except for diamonds without treatments), and abrasive materials.',
    category: 'care'
  },
  {
    id: 'warranty',
    question: 'Do your products come with a warranty?',
    answer: 'Yes, all our jewelry comes with a one-year limited warranty covering manufacturing defects. Our premium collections include extended warranties of up to five years. The warranty does not cover damage from normal wear and tear, accidents, or improper care. Please register your purchase on our website to activate your warranty.',
    category: 'care'
  },
  {
    id: 'repair-services',
    question: 'Do you offer repair services?',
    answer: 'Yes, we provide repair and maintenance services for all our jewelry. Services include resizing, replating, stone replacement, clasp repair, and chain soldering. Repairs for manufacturing defects within the warranty period are complimentary. For out-of-warranty repairs, we provide quotes before proceeding.',
    category: 'care'
  },
  {
    id: 'payment-methods',
    question: 'What payment methods do you accept?',
    answer: 'We accept a variety of payment methods: Major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, Shop Pay, and Bank transfers.',
    category: 'payment'
  },
  {
    id: 'account-benefits',
    question: 'What are the benefits of creating an account?',
    answer: 'Creating an account offers several advantages: Faster checkout process with saved shipping information, order tracking and history, access to exclusive promotions and early collection releases, loyalty rewards program, ability to create and share wishlists, and simplified returns and exchanges.',
    category: 'payment'
  },
  {
    id: 'discount-codes',
    question: 'How do I apply a discount code to my order?',
    answer: 'To apply a discount code, enter the code in the designated field during checkout, just before the payment step. Click "Apply" to see the discount reflected in your order total. Please note that some discount codes cannot be combined with other promotions, and some may have minimum purchase requirements or product restrictions.',
    category: 'payment'
  },
  {
    id: 'data-security',
    question: 'How do you protect my personal and payment information?',
    answer: 'We take data security seriously. Our website uses SSL encryption to secure all transmissions of personal information. We comply with PCI DSS standards for handling credit card data. We never store complete credit card details on our servers. Additionally, we have implemented robust data protection protocols and regularly update our security measures to safeguard your information.',
    category: 'payment'
  }
];
```

### Blog Posts
```javascript
const blogPosts = [
  {
    id: 'care-guide',
    title: "The Ultimate Men's Jewelry Care Guide",
    excerpt: 'Discover essential tips for maintaining the brilliance and longevity of your precious metal and gemstone jewelry pieces.',
    content: 'Full article content here...',
    date: 'March 28, 2024',
    author: 'Alexander Wright',
    authorRole: 'Jewelry Expert',
    category: 'Care & Maintenance',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'care-guide'
  },
  {
    id: 'styling-tips',
    title: 'How to Style Bracelets with Your Formal Attire',
    excerpt: 'Elevate your formal look with these expert styling tips for incorporating bracelets into your professional wardrobe.',
    content: 'Full article content here...',
    date: 'March 15, 2024',
    author: 'Michael Johnson',
    authorRole: 'Fashion Consultant',
    category: 'Style Guide',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/1472334/pexels-photo-1472334.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'styling-tips'
  },
  {
    id: 'diamond-guide',
    title: "A Gentleman's Guide to Diamond Selection",
    excerpt: 'Understanding the 4Cs and beyond when choosing the perfect diamond piece for your collection.',
    content: 'Full article content here...',
    date: 'February 28, 2024',
    author: 'Emily Richards',
    authorRole: 'Gemologist',
    category: 'Education',
    readTime: '7 min read',
    image: 'https://images.pexels.com/photos/307847/pexels-photo-307847.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'diamond-guide'
  },
  {
    id: 'spring-collection',
    title: 'Spring Collection 2024: Behind the Design',
    excerpt: 'Explore the inspiration and craftsmanship behind our latest seasonal collection.',
    content: 'Full article content here...',
    date: 'February 10, 2024',
    author: 'Jennifer Thompson',
    authorRole: 'Design Director',
    category: 'Collections',
    readTime: '6 min read',
    image: 'https://images.pexels.com/photos/57690/pexels-photo-57690.jpeg?auto=compress&cs=tinysrgb&w=600',
    slug: 'spring-collection'
  }
];
```

### Store Contact Information
```javascript
const storeInfo = {
  address: {
    street: '123 Luxury Lane',
    city: 'London',
    state: '',
    zipCode: 'W1S 1DP',
    country: 'UK'
  },
  phone: {
    customerService: '+44 123 456 7890',
    ordersSupport: '+44 123 456 7891'
  },
  email: {
    general: 'info@crownking.com',
    support: 'support@crownking.com'
  },
  businessHours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '10:00 AM - 4:00 PM',
    sunday: 'Closed'
  }
};
```

## Reviews

### Get Product Reviews
- **Endpoint**: `GET /api/products/:productId/reviews`
- **Query Parameters**:
  - `rating`: Filter by rating (1-5)
  - `sort`: Sort options (newest, oldest, highest-rating, lowest-rating)
  - `limit`: Number of items to return
  - `page`: Page number
- **Response**:
  ```json
  {
    "reviews": [
      {
        "id": "string",
        "productId": "string",
        "userId": "string",
        "userName": "string",
        "rating": "number",
        "title": "string",
        "comment": "string",
        "createdAt": "string",
        "verified": "boolean",
        "likes": "number"
      }
    ],
    "total": "number",
    "page": "number", 
    "limit": "number",
    "totalPages": "number"
  }
  ```

### Add Product Review
- **Endpoint**: `POST /api/products/:productId/reviews`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "rating": "number",
    "title": "string",
    "comment": "string"
  }
  ```
- **Response**:
  ```json
  {
    "id": "string",
    "productId": "string",
    "userId": "string",
    "userName": "string",
    "rating": "number",
    "title": "string",
    "comment": "string",
    "createdAt": "string",
    "verified": "boolean",
    "likes": "number"
  }
  ```

### Update Product Review
- **Endpoint**: `PUT /api/products/:productId/reviews/:reviewId`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "rating": "number",
    "title": "string",
    "comment": "string"
  }
  ```
- **Response**: Updated review object

### Delete Product Review
- **Endpoint**: `DELETE /api/products/:productId/reviews/:reviewId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

## Stripe Payment Integration

### Create Payment Intent
- **Endpoint**: `POST /api/payments/create-intent`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "orderId": "string",
    "amount": "number",
    "currency": "string"
  }
  ```
- **Response**:
  ```json
  {
    "clientSecret": "string",
    "paymentIntentId": "string"
  }
  ```

### Confirm Payment
- **Endpoint**: `POST /api/payments/confirm`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "paymentIntentId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": "boolean",
    "orderId": "string",
    "status": "string"
  }
  ```

## User Address Management

### Get User Addresses
- **Endpoint**: `GET /api/user/addresses`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "userId": "string",
      "type": "billing" | "shipping",
      "isDefault": "boolean",
      "firstName": "string",
      "lastName": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string",
      "phone": "string"
    }
  ]
  ```

### Add User Address
- **Endpoint**: `POST /api/user/addresses`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "type": "billing" | "shipping",
    "isDefault": "boolean",
    "firstName": "string",
    "lastName": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string",
    "phone": "string"
  }
  ```
- **Response**: Created address object

### Update User Address
- **Endpoint**: `PUT /api/user/addresses/:addressId`
- **Headers**: `Authorization: Bearer {token}`
- **Request**: Same as add address
- **Response**: Updated address object

### Delete User Address
- **Endpoint**: `DELETE /api/user/addresses/:addressId`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

### Set Default Address
- **Endpoint**: `PUT /api/user/addresses/:addressId/default`
- **Headers**: `Authorization: Bearer {token}`
- **Request**:
  ```json
  {
    "type": "billing" | "shipping"
  }
  ```
- **Response**: Updated address object

## Product Search

### Search Products
- **Endpoint**: `GET /api/products/search`
- **Query Parameters**:
  - `query`: Search text
  - `category`: Filter by category
  - `subCategory`: Filter by sub-category
  - `priceMin`: Minimum price
  - `priceMax`: Maximum price
  - `rating`: Minimum rating
  - `sortBy`: Sort options (price-asc, price-desc, newest, rating)
  - `limit`: Number of items to return
  - `page`: Page number
- **Response**: Same as Get All Products

## Order Management

### Update Order Status
- **Endpoint**: `PUT /api/orders/:orderId/status`
- **Headers**: `Authorization: Bearer {token}` (Admin only)
- **Request**:
  ```json
  {
    "status": "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  }
  ```
- **Response**: Updated order object

### Add Tracking Information
- **Endpoint**: `POST /api/orders/:orderId/tracking`
- **Headers**: `Authorization: Bearer {token}` (Admin only)
- **Request**:
  ```json
  {
    "carrier": "string",
    "trackingNumber": "string",
    "estimatedDelivery": "string"
  }
  ```
- **Response**: Updated order object with tracking information

## User Authentication

### Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Request**:
  ```json
  {
    "token": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

### Verify Email
- **Endpoint**: `GET /api/auth/verify-email`
- **Query Parameters**:
  - `token`: Verification token
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

### Refresh Token
- **Endpoint**: `POST /api/auth/refresh-token`
- **Request**:
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "refreshToken": "string"
  }
  ```

### Logout
- **Endpoint**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

## Category Management

### Create Category
- **Endpoint**: `POST /api/categories`
- **Headers**: `Authorization: Bearer {token}` (Admin only)
- **Request**:
  ```json
  {
    "name": "string",
    "description": "string",
    "image": "string"
  }
  ```
- **Response**: Created category object

### Update Category
- **Endpoint**: `PUT /api/categories/:id`
- **Headers**: `Authorization: Bearer {token}` (Admin only)
- **Request**: Same as create
- **Response**: Updated category object

### Delete Category
- **Endpoint**: `DELETE /api/categories/:id`
- **Headers**: `Authorization: Bearer {token}` (Admin only)
- **Response**:
  ```json
  {
    "success": "boolean",
    "message": "string"
  }
  ```

## Additional Schemas

### Review Schema
```typescript
{
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  verified: boolean;
  likes: number;
}
```

### Address Schema
```typescript
{
  id: string;
  userId: string;
  type: 'billing' | 'shipping';
  isDefault: boolean;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}
```

### Tracking Information Schema
```typescript
{
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  status: string;
  history: {
    status: string;
    location: string;
    timestamp: string;
  }[];
}
```

### Product Category Schema
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subCategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}
```
