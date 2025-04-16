declare module 'express-sanitizer' {
  import { RequestHandler } from 'express';
  
  function expressSanitizer(): RequestHandler;
  
  export = expressSanitizer;
  export default expressSanitizer;
} 