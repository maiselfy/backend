declare namespace Express {
  export interface Request {
    user: {
      id: string;
      name: string;
      lastname: string;
      email: string;
    };
  }
}
