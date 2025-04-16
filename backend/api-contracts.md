# CrownKing API Contracts

## Authentication

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
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
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "User already exists",
        "code": "USER_EXISTS"
      }
    }
    ```

### Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
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
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid credentials",
        "code": "INVALID_CREDENTIALS"
      }
    }
    ```

### Get Current User
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "phone": "1234567890",
        "createdAt": "2023-06-01T10:00:00.000Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Not authorized to access this route",
        "code": "UNAUTHORIZED"
      }
    }
    ```

### Forgot Password
- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Password reset email sent"
    }
    ```
- **Error Response**:
  - **Code**: 500 Internal Server Error
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Email could not be sent",
        "code": "EMAIL_ERROR"
      }
    }
    ```

### Reset Password
- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "token": "reset_token_from_email",
    "password": "new_password123"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Password reset successful"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid or expired token",
        "code": "INVALID_TOKEN"
      }
    }
    ```

### Logout User
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```

### Google OAuth Login
- **URL**: `/api/auth/google`
- **Method**: `GET`
- **Auth Required**: No
- **Redirect**: Redirects to Google authentication page

### Google OAuth Callback
- **URL**: `/api/auth/google/callback`
- **Method**: `GET`
- **Auth Required**: No
- **Redirect**: Redirects to `${CLIENT_URL}/auth/success?token=jwt_token_here`

## User Management

### Get User Profile
- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "phone": "1234567890",
        "createdAt": "2023-06-01T10:00:00.000Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Not authorized",
        "code": "UNAUTHORIZED"
      }
    }
    ```

### Update User Profile
- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **Request Body**:
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "1234567890"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "user_id",
        "name": "John Updated",
        "email": "john.updated@example.com",
        "role": "user",
        "phone": "1234567890",
        "createdAt": "2023-06-01T10:00:00.000Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Email already in use",
        "code": "EMAIL_EXISTS"
      }
    }
    ```

### Change Password
- **URL**: `/api/users/change-password`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **Request Body**:
  ```json
  {
    "currentPassword": "securepassword123",
    "newPassword": "newSecurePassword456"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Password updated successfully"
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Current password is incorrect",
        "code": "INVALID_PASSWORD"
      }
    }
    ```

### Get All User Addresses
- **URL**: `/api/users/addresses`
- **Method**: `GET`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "address_id",
          "userId": "user_id",
          "type": "shipping",
          "firstName": "John",
          "lastName": "Doe",
          "address": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001",
          "country": "USA",
          "phone": "1234567890",
          "email": "john@example.com",
          "isDefault": true,
          "createdAt": "2023-06-01T10:00:00.000Z",
          "updatedAt": "2023-06-01T10:00:00.000Z"
        }
      ]
    }
    ```

### Get Address by ID
- **URL**: `/api/users/addresses/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **URL Parameters**: `id=[address_id]`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "address_id",
        "userId": "user_id",
        "type": "shipping",
        "firstName": "John",
        "lastName": "Doe",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA",
        "phone": "1234567890",
        "email": "john@example.com",
        "isDefault": true,
        "createdAt": "2023-06-01T10:00:00.000Z",
        "updatedAt": "2023-06-01T10:00:00.000Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Address not found",
        "code": "NOT_FOUND"
      }
    }
    ```

### Create Address
- **URL**: `/api/users/addresses`
- **Method**: `POST`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **Request Body**:
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
    "email": "john@example.com",
    "isDefault": true
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "address_id",
        "userId": "user_id",
        "type": "shipping",
        "firstName": "John",
        "lastName": "Doe",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA",
        "phone": "1234567890",
        "email": "john@example.com",
        "isDefault": true,
        "createdAt": "2023-06-01T10:00:00.000Z",
        "updatedAt": "2023-06-01T10:00:00.000Z"
      }
    }
    ```

### Update Address
- **URL**: `/api/users/addresses/:id`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **URL Parameters**: `id=[address_id]`
- **Request Body**:
  ```json
  {
    "type": "billing",
    "firstName": "John",
    "lastName": "Doe",
    "address": "456 Second Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "country": "USA",
    "phone": "1234567890",
    "email": "john@example.com",
    "isDefault": true
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "address_id",
        "userId": "user_id",
        "type": "billing",
        "firstName": "John",
        "lastName": "Doe",
        "address": "456 Second Ave",
        "city": "Los Angeles",
        "state": "CA",
        "zipCode": "90001",
        "country": "USA",
        "phone": "1234567890",
        "email": "john@example.com",
        "isDefault": true,
        "createdAt": "2023-06-01T10:00:00.000Z",
        "updatedAt": "2023-06-01T10:00:00.000Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Address not found",
        "code": "NOT_FOUND"
      }
    }
    ```

### Delete Address
- **URL**: `/api/users/addresses/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **URL Parameters**: `id=[address_id]`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Address deleted successfully"
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Address not found",
        "code": "NOT_FOUND"
      }
    }
    ```

### Set Address as Default
- **URL**: `/api/users/addresses/:id/default`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer jwt_token`
- **URL Parameters**: `id=[address_id]`
- **Request Body**:
  ```json
  {
    "type": "shipping"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": "address_id",
        "userId": "user_id",
        "type": "shipping",
        "firstName": "John",
        "lastName": "Doe",
        "address": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA",
        "phone": "1234567890",
        "email": "john@example.com",
        "isDefault": true,
        "createdAt": "2023-06-01T10:00:00.000Z",
        "updatedAt": "2023-06-01T10:00:00.000Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Address not found",
        "code": "NOT_FOUND"
      }
    }
    ``` 