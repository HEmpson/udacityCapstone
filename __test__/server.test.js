// test the server

const app = require('../src/server/index') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)


it('test the / endpoint', async () => {
    const response = await request.get('/');
    expect(response).toBeDefined();
    
})