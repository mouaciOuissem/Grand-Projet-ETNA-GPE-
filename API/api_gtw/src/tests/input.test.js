const axios = require('axios');
const express = require('express');
const request = require('supertest');
const InputRoute = require('../Routes/Input');

// Mock d'Axios
jest.mock('axios');

// Mock de SecurityService
jest.mock('../Services/AuthService', () => ({
    AuthCookieValidator: jest.fn(),
}));

const Auth = require('../Services/AuthService');

describe('get user Controller', () => {
    let app;

    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.use('/', InputRoute);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 500 if user data is invalid in header', async () => {
        const response = await request(app)
            .get('/api/input/1') // Remplacez par votre route exacte
            .set('user', 'invalid_json_string'); // En-tête user avec données invalides

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Error in request setup: Cannot read properties of undefined (reading 'status')" });
    });

    it('should return 200 if user is found and authorized', async () => {
        const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
        Auth.AuthCookieValidator.mockReturnValue('mockToken');
        axios.get.mockResolvedValueOnce({ data: mockUser, status: 200 }); // Simulation de la réponse d'axios avec un utilisateur valide

        const response = await request(app)
            .get('/api/input/1')
            .set('user', JSON.stringify({ id: 1, role_id: 1 })); // L'utilisateur avec l'ID et le rôle admin

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
});

describe('delete user Controller', () => {
    let app;

    beforeAll(() => {
      app = express();
      app.use(express.json());
      app.use('/', InputRoute);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 500 if user data is invalid in header', async () => {
        const response = await request(app)
            .delete('/api/input/1') // Remplacez par votre route exacte
            .set('user', 'invalid_json_string'); // En-tête user avec données invalides

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: "Error in request setup: Cannot read properties of undefined (reading 'status')" });
    });

    it('should return 200 if user is found and authorized', async () => {
        const mockUser = { id: 1, username: 'john_doe', email: 'john@example.com' };
        Auth.AuthCookieValidator.mockReturnValue('mockToken');
        axios.delete.mockResolvedValueOnce({ data: mockUser, status: 200 }); // Simulation de la réponse d'axios avec un utilisateur valide

        const response = await request(app)
            .delete('/api/input/1')
            .set('user', JSON.stringify({ id: 1, role_id: 1 })); // L'utilisateur avec l'ID et le rôle admin

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
});