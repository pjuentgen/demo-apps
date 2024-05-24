import { it, describe, expect } from '@jest/globals';
import supertest from 'supertest';

import app from '../app';

const requestWithSupertest = supertest(app);

describe('Basic Test', () => {
  // it('GET /', async () => {
  //   const res = await requestWithSupertest.get('/healthy');
  //   expect(res.status).;
  // });
  it('GET /healthy', async () => {
    const res = await requestWithSupertest.get('/healthy');
    expect(res.status).toEqual(200);
    // expect(res.type).toEqual(expect.stringContaining('json'));
    // expect(res.body).toHaveProperty('users')
  });
  it('GET /bad', async () => {
    const res = await requestWithSupertest.get('/bad');
    expect(res.status).toEqual(500);
    // expect(res.type).toEqual(expect.stringContaining('json'));
    // expect(res.body).toHaveProperty('users')
  });
});
