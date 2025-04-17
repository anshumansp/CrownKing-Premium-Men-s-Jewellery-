# Deployment Guide: Fixing TypeScript Build Errors

This guide addresses common TypeScript build errors in the CrownKing backend project.

## Common TypeScript Build Errors and Solutions

### Missing Type Declarations

Many build errors occur because TypeScript can't find type declarations for Node.js modules. This can be fixed by installing the appropriate `@types` packages.

```bash
npm install --save-dev @types/express @types/cors @types/express-session @types/passport @types/passport-google-oauth20 @types/jsonwebtoken @types/morgan @types/nodemailer
```

### For ioredis

The ioredis package provides its own types, so just install the package:

```bash
npm install ioredis
```

### For Express.User Type Extension

To fix the `Express.User` error in passport.ts, we've created a custom type declaration file at `src/types/express.d.ts` that extends Express types.

### Fixing Parameter Type Errors

For parameters without types (like error callbacks), add explicit type annotations:

```typescript
// Example
redisClient.on('error', (err: Error) => {
  logger.error(`Redis error: ${err}`);
});
```

## Build Process

When deploying to Render, ensure:

1. The build command is set to `npm run build`
2. The start command is set to `npm start` 
3. Environment variables are properly configured

## Pre-deployment Check

Before deploying, run these commands locally to catch any type errors:

```bash
npm run build
```

If any errors occur, fix them using the guidelines above before deploying. 