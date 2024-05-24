import app from './app';

const PORT: number = parseInt(process.env.PORT || '8080');

// eslint-disable-next-line no-console
app.listen(PORT, (): void => console.log(`running on port ${PORT}`));
