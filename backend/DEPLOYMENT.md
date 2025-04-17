# Deployment Guide for CrownKing Backend

This guide provides instructions for deploying the CrownKing backend to Render.com.

## Recommended Render.com Configuration

### Web Service Setup

1. **Repository**: https://github.com/anshumansp/CrownKing-Premium-Men-s-Jewellery-
2. **Branch**: main
3. **Root Directory**: backend
4. **Build Command**: 
```
chmod +x render-build.sh && ./render-build.sh
```
5. **Start Command**: 
```
chmod +x render-start.sh && ./render-start.sh
```

### Alternate Build Command (if render-build.sh isn't available)

```
npm install && npm install --save-dev @types/express @types/cors @types/express-session @types/passport @types/passport-google-oauth20 @types/jsonwebtoken @types/morgan @types/nodemailer @types/sequelize && npm run build
```

### Environment Variables

Ensure the following environment variables are configured in your Render dashboard:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<your-postgres-db-url>
JWT_SECRET=<your-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
REDIRECT_URL=<your-frontend-url>/auth/google/callback
CORS_ORIGIN=<your-frontend-url>
```

## Troubleshooting Common Deployment Issues

### TypeScript Build Errors

If you encounter TypeScript build errors during deployment:

1. Ensure all type declarations are installed correctly:
   ```bash
   npm install --save-dev @types/express @types/cors @types/express-session @types/passport @types/passport-google-oauth20 @types/jsonwebtoken @types/morgan @types/nodemailer @types/sequelize
   ```

2. Verify the render-build.sh script has executable permissions:
   ```bash
   chmod +x render-build.sh
   ```

3. Try forcing the build with skipLibCheck flag:
   ```bash
   npx tsc --skipLibCheck
   ```

### Database Connection Issues

1. Verify your DATABASE_URL is correctly formatted:
   ```
   postgres://username:password@host:port/database
   ```

2. Make sure the database service is running and accessible from your Render web service.

3. Add an explicit `retries` option in your database connection code.

## Manual Deployment

If you need to deploy manually:

1. Clone the repository:
   ```bash
   git clone https://github.com/anshumansp/CrownKing-Premium-Men-s-Jewellery-
   ```

2. Navigate to the backend directory:
   ```bash
   cd CrownKing-Premium-Men-s-Jewellery-/backend
   ```

3. Run the render build script:
   ```bash
   chmod +x render-build.sh && ./render-build.sh
   ```

4. Start the application:
   ```bash
   npm run start
   ``` 