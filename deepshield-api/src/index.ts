import { httpServer } from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`DeepShield API running on port ${PORT}`);
});
