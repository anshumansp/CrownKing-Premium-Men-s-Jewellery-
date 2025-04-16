# Google OAuth Integration with CrownKing

This document explains how to integrate Google OAuth with the CrownKing e-commerce platform.

## Overview

The CrownKing backend supports Google OAuth for user authentication. This allows users to sign in using their Google accounts, providing a smooth login experience without requiring separate account creation.

## Prerequisites

1. A Google Cloud Platform account
2. A configured Google Cloud project with OAuth 2.0 credentials
3. CrownKing backend server running
4. CrownKing frontend application

## Setting Up Google OAuth

### Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. Configure the OAuth consent screen:
   - Choose "External" as the User Type
   - Enter your app name, user support email, and developer contact information
   - Add the following scopes: `./auth/userinfo.email`, `./auth/userinfo.profile`
   - Add authorized domains (e.g., your app's domain)
   - Save and continue

### Step 2: Create OAuth Credentials

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the Application type
4. Add a name for your OAuth client
5. Add authorized JavaScript origins (e.g., `http://localhost:3000` for development)
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - `https://your-production-domain.com/api/auth/google/callback` (for production)
7. Click "Create"
8. Save the Client ID and Client Secret

### Step 3: Configure CrownKing Backend

1. Add the Google OAuth credentials to your environment variables:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

2. Ensure your backend server is properly configured to use these credentials as defined in the `src/config/passport.ts` file.

### Step 4: Set Up Frontend Integration

1. Create a Google Sign-In button in your frontend application
2. When clicked, redirect the user to `/api/auth/google`:

```javascript
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:5000/api/auth/google';
};
```

3. Create a success callback page at `/auth/success` that extracts the JWT token from the URL:

```javascript
useEffect(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');
  
  if (token) {
    // Store the token in localStorage or a secure cookie
    localStorage.setItem('auth_token', token);
    
    // Redirect to a protected page or dashboard
    navigate('/dashboard');
  }
}, []);
```

## How It Works

1. When a user clicks the "Sign in with Google" button, they're redirected to `/api/auth/google`
2. The backend uses Passport.js to initiate the Google OAuth flow
3. Google displays the permission screen to the user
4. After the user grants permission, Google redirects to the callback URL with an authorization code
5. The backend exchanges this code for user information
6. If it's a new user, they're created in the database; if existing, their account is updated
7. A JWT token is generated and sent back to the frontend
8. The frontend stores this token and uses it for authenticated requests

## Testing the Integration

1. Start your backend server
2. Ensure your frontend application is running
3. Navigate to the login page
4. Click the "Sign in with Google" button
5. Complete the Google authentication flow
6. Verify you're redirected back to your application with a valid JWT token
7. Check that the user information is properly stored in your database

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**: Ensure the redirect URI in your Google Cloud settings exactly matches the callback URL in your application.

2. **CORS Issues**: If facing CORS errors, check your backend CORS configuration to allow requests from your frontend domain.

3. **Token Exchange Failures**: Verify your client ID and client secret are correctly set in the environment variables.

4. **User Not Created**: Check the Passport.js configuration to ensure it's correctly extracting user information from the Google profile.

## Security Considerations

1. **JWT Security**: Ensure JWTs are properly configured with appropriate expiration times.

2. **HTTPS**: Always use HTTPS in production to protect the token exchange.

3. **Scope Limitations**: Only request the necessary scopes from Google to minimize data access.

4. **Token Storage**: Store tokens securely, preferably in HttpOnly cookies rather than localStorage for production environments. 