const axios = require('axios');
const express = require('express');
const request = require('supertest');
const AuthRoute = require('../Routes/Auth');

// Mock d'Axios
jest.mock('axios');

// Mock de SecurityService
jest.mock('../Services/AuthService', () => ({
    AuthCookieValidator: jest.fn(),
}));

const Auth = require('../Services/AuthService');

// Variables mockées
process.env.SNL_URL_DBCOM = 'mock-url';
process.env.SNL_PORT_DBCOM = '1234';

describe('login Controller', () => {
    let app;

    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.use('/', AuthRoute);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if user data is invalid in header', async () => {
        const response = await request(app)
            .post('/api/auth/login/') // Remplacez par votre route exact
            .send({ identifier: 'newemail@example.com' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "ERR_MISSING_DATA" });
    });

    it('should return 200 if user is found and authorized', async () => {
        const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
        axios.post.mockResolvedValueOnce({ data: mockUser, status: 200, headers: {User: mockUser, Token: 'mocktoken'} }); // Simulation de la réponse d'axios avec un utilisateur valide

        const response = await request(app)
            .post('/api/auth/login/')
            .send({ identifier: 'newemail@example.com', password: '1234' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it('should return 500 if user is found but bad request', async () => {
        const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
        axios.post.mockResolvedValueOnce({ data: mockUser, status: 200 }); // Simulation de la réponse d'axios avec un utilisateur valide

        const response = await request(app)
            .post('/api/auth/login/')
            .send({ identifier: 'newemail@example.com', password: '1234' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({"error": "Error in request setup: Cannot convert undefined or null to object"});
    });
});

describe('Register Controller', () => {
    let app;

    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.use('/', AuthRoute);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if user data is invalid in header', async () => {
        const response = await request(app)
            .post('/api/auth/register/') // Remplacez par votre route exact
            .send({ username: 'newemail@example.com' });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "ERR_MISSING_DATA" });
    });

    it('should return 200 if user is found and authorized', async () => {
        const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
        axios.post.mockResolvedValueOnce({ data: mockUser, status: 200, headers: {User: mockUser, Token: 'mocktoken'} }); // Simulation de la réponse d'axios avec un utilisateur valide

        const response = await request(app)
            .post('/api/auth/register/')
            .send({ email: 'newemail@example.com', password: '1234', username: 'test' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it('should return 500 if user is found but bad request', async () => {
        const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
        axios.post.mockResolvedValueOnce({ data: mockUser, status: 200 }); // Simulation de la réponse d'axios avec un utilisateur valide

        const response = await request(app)
            .post('/api/auth/register/')
            .send({ email: 'newemail@example.com', password: '1234', username: 'test' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({"error": "Error in request setup: Cannot convert undefined or null to object"});
    });
});