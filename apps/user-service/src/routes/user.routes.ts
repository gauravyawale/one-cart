import { Router } from 'express';
import { authenticate } from '@one-cart/common';
import { deleteUser, getUser, updateUser } from '../controllers/user.controller';

const router = Router();

router.get('/me', authenticate, getUser);
router.get('/me', authenticate, updateUser);
router.get('/me', authenticate, deleteUser);

export default router;
