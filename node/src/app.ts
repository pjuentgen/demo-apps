import opentelemetry from '@opentelemetry/api';
import axios from 'axios';
import express, { Express } from 'express';

import logger from './logger';

const counter = opentelemetry.metrics
  .getMeter('default')
  .createCounter('otel-counted-requests');

const app: Express = express();

const TIME: number = parseInt(process.env.TIME || '500');
const TIME_FOR_ERROR: number = parseInt(process.env.TIME_FOR_ERROR || '500');
const READIENESS_DELAY: number = parseInt(process.env.TIME_FOR_ERROR || '0');
const REMOTE_URL: string =
  process.env.REMOTE_URL || 'https://api.chucknorris.io/jokes/random';

app.get('/', (req, res) => {
  logger.info('Request to /');
  counter.add(1, { url: '/' });
  const randomTime = Math.floor(Math.random() * TIME);

  setTimeout(() => {
    if (randomTime > 300) {
      res.status(500).send('Error occured');
      logger.error('Error occured');
    } else {
      res.send('Hello World!');
    }
  }, randomTime);
});

app.get('/random-error', (req, res) => {
  logger.info('Request to /random-error');
  counter.add(1, { url: '/error' });
  const randomTime = Math.floor(Math.random() * TIME);

  setTimeout(() => {
    if (randomTime > TIME_FOR_ERROR) {
      res.status(500).send('Error occured');
      logger.error('Error occured');
    } else {
      res.send('Hello World!');
    }
  }, randomTime);
});

app.get('/bad', (req, res) => {
  logger.info('Request to /bad');
  counter.add(1, { url: '/bad' });
  res.status(500).send('Error occured');
  logger.error('Error occured');
});

app.get('/healthy', (req, res) => {
  logger.info('Request to /healthy');
  counter.add(1, { url: '/healthy' });

  res.send('Hello World!');
});

app.get('/remote', async (req, res) => {
  logger.info('Request to /remote');
  counter.add(1, { url: '/remote' });
  logger.info('Connecting to ' + REMOTE_URL);
  try {
    const response = await axios.get(REMOTE_URL);
    const body = response.data;
    res.send(body);
  } catch (error) {
    logger.error('Error occurred while fetching remote data');
    res.status(500).send('Error occurred while fetching remote data');
  }
});

app.get('/liveness', (req, res) => {
  logger.info('Request to /liveness');
  counter.add(1, { url: '/liveness' });
  res.send('Live');
});

app.get('/readiness', (req, res) => {
  logger.info('Request to /readiness');
  counter.add(1, { url: '/readiness' });
  setTimeout(() => {
    res.send('Ready');
  }, READIENESS_DELAY);
});

export default app;
