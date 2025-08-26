import { it, describe, expect } from '@jest/globals';
import supertest from 'supertest';

import app from '../app';

const requestWithSupertest = supertest(app);

describe('Basic Test', () => {
  it('GET /', async () => {
    const res = await requestWithSupertest.get('/healthy');
    expect(res.status).toEqual(200);
  });
});
