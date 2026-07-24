import { handle } from 'hono/vercel';
import app from '../dist/index';

export default handle(app);
