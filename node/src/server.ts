import app from './app';
import { logger } from './logger';

const PORT: number = parseInt(process.env.PORT || '8080');

// eslint-disable-next-line no-console
app.listen(PORT, (): void => { logger.info(`Server is running on port ${PORT}`); });
