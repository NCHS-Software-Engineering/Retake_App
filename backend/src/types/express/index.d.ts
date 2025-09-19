import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user: {
        id: number;
        email: string;
        username: string;
        googleId: string;
        role: 'teacher' | 'student' | 'admin';
    }
  }
}
