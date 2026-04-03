import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

type TokenPayload = {
  userId: string;
  role: string;
};

export function auth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    if (!allowedRoles.includes(req.userRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}
