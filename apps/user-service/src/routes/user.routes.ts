import { Router } from 'express';
import { authenticate } from '@one-cart/common';
import { deleteUser, getUser, updateUser } from '../controllers/user.controller';
import  dotenv  from 'dotenv';
dotenv.config();
const router = Router();

router.get('/me', authenticate(process.env.JWT_ACCESS_TOKEN_SECRET as string), getUser);
router.put('/me', authenticate(process.env.JWT_ACCESS_TOKEN_SECRET as string), updateUser);
router.delete('/me', authenticate(process.env.JWT_ACCESS_TOKEN_SECRET as string), deleteUser);

export default router;
