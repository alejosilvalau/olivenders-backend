import supertest from 'supertest';
import { app } from '../src/index';

const api = supertest(app);

describe('Wizard Login Endpoint', () => {
  test('Nonexistent user', async () => {
    const wizard = {
      username: 'notexist', // at least 6 chars
      password: 'Abc123#', // meets all requirements
    };
    const response = await api.post('/api/wizards/login').send(wizard).expect(404);
    expect(response.body).toHaveProperty('message', 'Wizard not found');
    console.log(response.body);
  });

  test('Incorrect password', async () => {
    const wizard = {
      username: 'dracomalfoy', // use a real username from your DB
      password: 'Wrong123#', // valid format, but wrong password
    };
    const response = await api.post('/api/wizards/login').send(wizard).expect(401);
    expect(response.body).toHaveProperty('message', 'Incorrect password');
    console.log(response.body);
  });

  test('Successful login', async () => {
    const wizard = {
      username: 'dracomalfoy', // use a real username from your DB
      password: 'Expelio123#@@', // correct password for that user
    };
    const response = await api.post('/api/wizards/login').send(wizard).expect(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('username', 'dracomalfoy');
    console.log(response.body);
  });

  test('Missing attributes', async () => {
    const wizard = {
      username: 'dracomalfoy',
      // password missing
    };
    const response = await api.post('/api/wizards/login').send(wizard).expect(500);
    expect(response.body).toHaveProperty('message');
    console.log(response.body);
  });
});

/*
  console.log
    [query] db.getCollection('wizard').find({ username: 'notexist' }, {}).limit(1).toArray(); [took 46 ms, 0 results]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    { message: 'Wizard not found' }

      at Object.<anonymous> (tests/login.test.ts:14:13)

  console.log
    Origin: undefined

      at origin (src/index.ts:29:15)

  console.log
    [query] db.getCollection('wizard').find({ username: 'dracomalfoy' }, {}).limit(1).toArray(); [took 55 ms, 1 result]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    { message: 'Incorrect password' }

      at Object.<anonymous> (tests/login.test.ts:24:13)

  console.log
    Origin: undefined

      at origin (src/index.ts:29:15)

  console.log
    [query] db.getCollection('wizard').find({ username: 'dracomalfoy' }, {}).limit(1).toArray(); [took 41 ms, 1 result]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    {
      message: 'Login successful',
      data: {
        id: '686fab31e5c1922fd703246c',
        username: 'dracomalfoy',
        name: 'draco',
        last_name: 'Malfoy',
        email: 'draco.malfoy2@hogwarts.edu',
        address: '5 Manor Drive, Malfoy Manor',
        phone: '445345678',
        role: 'admin',
        deactivated: false,
        school: '6870f73ba7d116ea3b5a1b06'
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmZhYjMxZTVjMTkyMmZkNzAzMjQ2YyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NTEzNjg3NiwiZXhwIjoxNzU1MTQwNDc2fQ.60SzX-OmSy7be_4xxTjHYL8AVZFcrey9CRRljjJU0is'
    }

      at Object.<anonymous> (tests/login.test.ts:36:13)

  console.log
    Origin: undefined

      at origin (src/index.ts:29:15)

  console.log
    [query] db.getCollection('wizard').find({ username: 'dracomalfoy' }, {}).limit(1).toArray(); [took 43 ms, 1 result]

      at DefaultLogger.log (node_modules/@mikro-orm/core/logging/DefaultLogger.js:38:14)

  console.log
    { message: 'data and hash arguments required' }

      at Object.<anonymous> (tests/login.test.ts:46:13)

 PASS  tests/login.test.ts (5.09 s)
  Wizard Login Endpoint
    √ Nonexistent user (134 ms)
    √ Incorrect password (127 ms)
    √ Successful login (110 ms)
    √ Missing attributes (55 ms)
                                                                                                                                
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        5.428 s, estimated 6 s
Ran all test suites.

*/
