/* eslint-env node */
/* global process */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import aiRoutes from './routes/aiRoutes.js';
import { limitByIp, limitByTenant } from './middleware/rateLimitAi.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In a real app, middleware to set req.empresaId and roles would go here

app.use('/api/ai', limitByIp, limitByTenant, aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AI server running on port ${PORT}`));

export default app;
