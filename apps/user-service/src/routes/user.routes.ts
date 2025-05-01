import { Router } from 'express';
import { authenticate } from '@one-cart/common';

const router = Router();

router.get('/', authenticate, (req: any, res: any) => {
  res.status(200).json({ message: 'User service is running' });
});

export default router;
