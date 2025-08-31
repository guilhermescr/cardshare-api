import request from 'supertest';
import app from '../../../src/index';
import { UserRepository } from '../../../src/repositories/user.repository';
import { RegisterDto } from '../../../src/dtos/auth.dto';

const userRepository = new UserRepository();

describe('AuthController', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };
      const res = await request(app).post('/auth/register').send(registerDto);
      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('username', 'testuser');
      expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
    });

    it('should not register with existing email/username', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };
      await request(app).post('/auth/register').send(registerDto);
      const res = await request(app).post('/auth/register').send(registerDto);
      expect(res.status).toBe(409);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/auth/register').send({
        username: 'loginuser',
        email: 'loginuser@example.com',
        password: 'password123',
      });
      await userRepository.updateOne(
        { email: 'loginuser@example.com' },
        { emailConfirmed: true }
      );
    });

    it('should login with correct credentials', async () => {
      const res = await request(app).post('/auth/login').send({
        identifier: 'loginuser@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'loginuser@example.com');
    });

    it('should fail login with wrong password', async () => {
      const res = await request(app).post('/auth/login').send({
        identifier: 'loginuser@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /auth/confirm-email', () => {
    it('should confirm email with valid token', async () => {
      await request(app).post('/auth/register').send({
        username: 'confirmuser',
        email: 'confirmuser@example.com',
        password: 'password123',
      });
      const user = await userRepository.findOne({
        email: 'confirmuser@example.com',
      });
      const token = user?.emailConfirmationToken;
      const res = await request(app).get(`/auth/confirm-email?token=${token}`);
      expect(res.status).toBe(200);
      expect(res.text).toContain('Email Confirmed');
    });

    it('should fail with invalid token', async () => {
      const res = await request(app).get(
        '/auth/confirm-email?token=invalidtoken'
      );
      expect(res.status).toBe(404);
    });
  });
});
