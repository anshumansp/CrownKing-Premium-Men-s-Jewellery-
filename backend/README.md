# CrownKing Backend API

This repository contains the backend API for the CrownKing e-commerce platform.

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication System](#authentication-system)
- [User Management](#user-management)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## Getting Started

### Prerequisites
- Node.js (>= 14.x)
- PostgreSQL
- Redis (for session management)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/crownking-backend.git
cd crownking-backend
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000
DB_NAME=crownking
DB_USER=postgres
DB_PASS=yourpassword
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM_EMAIL=noreply@crownking.com
SMTP_FROM_NAME=CrownKing
```

4. Run database migrations
```bash
npm run db:migrate
```

5. Run seeders (optional)
```bash
npm run db:seed
```

6. Start the development server
```bash
npm run dev
```

## Authentication System

CrownKing uses a JWT-based authentication system with OAuth 2.0 support for Google Sign-In.

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login a user | No |
| GET | `/api/auth/me` | Get current user's profile | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password using token | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/google` | Initiate Google OAuth login | No |
| GET | `/api/auth/google/callback` | Google OAuth callback | No |

### Registration

To register a new user:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-06-01T10:00:00.000Z"
  }
}
```

### Login

To login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-06-01T10:00:00.000Z"
  }
}
```

### Google OAuth Login

To initiate Google OAuth:

1. Redirect the user to `/api/auth/google`
2. User will authenticate with Google
3. After successful authentication, user will be redirected to `${CLIENT_URL}/auth/success?token=jwt_token_here`
4. Frontend should extract the token from the URL and store it

For more details on Google OAuth integration, see [Oauth_integration.md](./Oauth_integration.md).

### Using Authentication in Frontend

1. After login/registration, store the JWT token in localStorage or a secure cookie
2. Include the token in the Authorization header for authenticated requests:

```javascript
fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## User Management

### User Profile Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/users/profile` | Get user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |
| PUT | `/api/users/change-password` | Change user password | Yes |

### Address Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/users/addresses` | Get all user addresses | Yes |
| GET | `/api/users/addresses/:id` | Get single address | Yes |
| POST | `/api/users/addresses` | Create new address | Yes |
| PUT | `/api/users/addresses/:id` | Update address | Yes |
| DELETE | `/api/users/addresses/:id` | Delete address | Yes |
| PUT | `/api/users/addresses/:id/default` | Set address as default | Yes |

### Updating User Profile

```http
PUT /api/users/profile
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "1234567890"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "createdAt": "2023-06-01T10:00:00.000Z"
  }
}
```

### Managing User Addresses

User addresses can be of two types: `shipping` or `billing`. Each user can have multiple addresses, but only one default address per type.

#### Creating an Address

```http
POST /api/users/addresses
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "type": "shipping",
  "firstName": "John",
  "lastName": "Doe",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "phone": "1234567890",
  "isDefault": true
}
```

## API Documentation

For a full API documentation, refer to the [API Contract](./api-contracts.md) file.

## Testing

### Testing Authentication

1. Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

2. Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. Get user profile (replace TOKEN with the token from login response):
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

### Testing Google OAuth

1. Set up your frontend application to include a Google Sign-In button
2. Configure the button to redirect to `/api/auth/google`
3. After successful authentication, handle the redirect to `/auth/success?token=TOKEN`
4. Use the token for authenticated API requests

### Frontend Integration

To integrate the authentication and user management system with your frontend:

1. **Register/Login Forms**: Create forms that interact with the `/api/auth/register` and `/api/auth/login` endpoints.

2. **Google Login Button**: Add a Google login button that redirects to `/api/auth/google`.

3. **Profile Management**: Create a profile page that uses the `/api/users/profile` endpoint to fetch and update user information.

4. **Address Management**: Implement address management forms that interact with the corresponding address endpoints.

Example React component for Google login:

```jsx
function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-btn">
      Login with Google
    </button>
  );
}
```

Example React component for handling OAuth callback:

```jsx
function AuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      // Handle error
      navigate('/login?error=auth_failed');
    }
  }, [navigate]);
  
  return <div>Processing authentication...</div>;
}
```

---

## Address Endpoints

### Get All Addresses
- **URL**: `/api/users/addresses`
- **Method**: `GET`
- **Auth**: Required (JWT token)
- **Description**: Returns all addresses associated with the authenticated user
- **Response**: Array of address objects with id, type, firstName, lastName, etc.

### Get Address by ID
- **URL**: `/api/users/addresses/:id`
- **Method**: `GET`
- **Auth**: Required (JWT token)
- **Description**: Returns a specific address by ID (only if owned by the user)
- **Response**: Single address object with all details

### Create Address
- **URL**: `/api/users/addresses`
- **Method**: `POST`
- **Auth**: Required (JWT token)
- **Validation**: Requires type (shipping/billing), firstName, lastName, address, city, state, zipCode, country
- **Body Example**:
```json
{
  "type": "shipping",
  "firstName": "John",
  "lastName": "Doe",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "phone": "1234567890",
  "isDefault": true
}
```
- **Special Logic**: If setting as default, automatically unsets any existing default address of the same type

### Update Address
- **URL**: `/api/users/addresses/:id`
- **Method**: `PUT`
- **Auth**: Required (JWT token)
- **Description**: Updates an existing address (only if owned by the user)

### Delete Address
- **URL**: `/api/users/addresses/:id`
- **Method**: `DELETE`
- **Auth**: Required (JWT token)
- **Description**: Deletes an address by ID (only if owned by the user)

### Set Default Address
- **URL**: `/api/users/addresses/:id/default`
- **Method**: `PUT`
- **Auth**: Required (JWT token)
- **Body**: Requires `type` (shipping/billing)
- **Description**: Sets an address as the default for the specified type, automatically unsetting any existing default

All address endpoints use the Address model which includes fields for: id, userId, type (shipping/billing), firstName, lastName, address, city, state, zipCode, country, phone, email (optional), and isDefault.
