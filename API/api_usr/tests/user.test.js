const request = require('supertest');

describe('User API Tests', () => {

  // Check Cookie Route Tests
  describe('GET /auth/check-cookie', () => {
    it('should return isAuthenticated true with valid token in cookies', async () => {
      const loginRes = await request('http://localhost:3000')
        .post('/api/auth/login')
        .send({
          identifier: 'updateduser@example.com',
          password: 'password1235'
        });
  
      authToken = loginRes.body.token;
      console.log(authToken);
      const checkRes = await request('http://localhost:3000') 
        .get('/api/auth/check-cookie') 
        .set('Cookie', `authToken=${authToken}`);

      expect(checkRes.statusCode).toBe(200);
      expect(checkRes.body).toEqual(expect.objectContaining({
        isAuthenticated: true,
      }));
    });
  });

  // Test for retrieving user details
  describe('GET /user/:id', () => {
    it('should retrieve user details', async () => {
      const loginRes = await request('http://localhost:3000')
      .post('/api/auth/login')
      .send({
        identifier: 'updateduser@example.com',
        password: 'newpassword1235'
      });

      const token = loginRes.body.token;
      console.log(token);

      const res = await request('http://localhost:3000')
        .get('/api/user/13')
        .set('Cookie', `authToken=${loginRes.body.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', "User found");
      console.log(res.statusCode);
    });

    it('should return 401 if unauthorized access to user data', async () => {
      const res = await request('http://localhost:3000').get('/api/user/2');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorized access');
    });
  });

  // Test for updating user email
  describe('PATCH /user/email/:id', () => {
    it('should update the user email successfully', async () => {
      
      const loginRes = await request('http://localhost:3000')
      .post('/api/auth/login')
      .send({
        identifier: 'updateduser@example.com',
        password: 'newpassword1235'
      });
      const token = loginRes.body.token;
      console.log(token);
      
      const res = await request('http://localhost:3000')
        .patch('/api/user/email/13')
        .set('Cookie', `authToken=${token}`)
        .send({ email: 'updateduser2@example.com' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('token');  // New token after email update
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request('http://localhost:3000')
        .patch('/api/user/email/13')
        .set('user', JSON.stringify({ id: 1, role_id: 1 }))
        .send({ email: 'invalidemail' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid Data');
    });

  });

  // Test for updating user password
  describe('PATCH /user/password/:id', () => {
    it('should update the user password successfully', async () => {

      const loginRes = await request('http://localhost:3000')
      .post('/api/auth/login')
      .send({
        identifier: 'updateduser@example.com',
        password: 'newpassword1235'
      });
      const token = loginRes.body.token;
      console.log(token);


      const res = await request('http://localhost:3000')
        .patch('/api/user/password/13')
        .set('Cookie', `authToken=${token}`)
        .send({ password: 'newpassword1236' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('token');  // New token after password update
    });

    it('should return 400 if no password provided', async () => {
      const res = await request('http://localhost:3000')
        .patch('/api/user/password/13')
        .set('user', JSON.stringify({ id: 1, role_id: 1 }));

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid Data');
    });

  });

  // // Test for deleting a user
  // describe('DELETE /user/:id', () => {
  //   it('should delete the user', async () => {
  //     const res = await request('http://localhost:3000')
  //       .delete('/api/user/1')
  //       .set('Cookie', `authToken=${authToken}`);
  //     expect(res.statusCode).toBe(200);
  //   });
  // it('should return 401 if unauthorized delete request', async () => {
  //   const res = await request('http://localhost:3000').delete('/api/user/2');
  //   expect(res.statusCode).toBe(401);
  //   expect(res.body).toHaveProperty('error', 'Unauthorized access');
  // });
  // });

  describe('PATCH /user/role/:id', () => {
    it('should update the role of a user if authorized', async () => {

      const loginRes = await request('http://localhost:3000')
      .post('/api/auth/login')
      .send({
        identifier: 'updateduser@example.com',
        password: 'newpassword1235'
      });
      const token = loginRes.body.token;
      console.log(token);

      const res = await request('http://localhost:3000')
        .patch('/api/user/role/13')
        .set('user', JSON.stringify({ id: 1, role_id: 1 }))
        .send({ role_id: 2 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.message.user).toHaveProperty('role_id', 2);
    });

    it('should return 400 if invalid role data is provided', async () => {
      const res = await request('http://localhost:3000')
        .patch('/api/user/role/13')
        .set('user', JSON.stringify({ id: 1, role_id: 1 }))
        .send({ role_id: 'invalid' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid Data');
    });
  });

  // Test for retrieving all users (requires admin role)
  describe('GET /users', () => {
    it('should retrieve all users as an admin', async () => {
      const loginRes = await request('http://localhost:3000')
      .post('/api/auth/login')
      .send({
        identifier: 'updateduser@example.com',
        password: 'newpassword1235'
      });
      const token = loginRes.body.token;
      console.log(token);

      const res = await request('http://localhost:3000')
        .get('/api/user')
        .set('Cookie', `authToken=${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 401 if non-admin user tries to access', async () => {
      const res = await request('http://localhost:3000')
        .get('/api/users')
        .set('user', JSON.stringify({ id: 2, role_id: 2 }));

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error', 'Unauthorized access');
    });

  });
});