import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => res.json({ message: 'simulation API' }));

export default router;
