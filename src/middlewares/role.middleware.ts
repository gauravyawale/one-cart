import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};
