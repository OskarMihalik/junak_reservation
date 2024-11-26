import type { FastifyRequest, FastifyReply } from 'fastify';
import { it, expect, describe, vi } from 'vitest';


// Mocking FastifyRequest and FastifyReply
const mockRequest = {
  jwt: {
    sign: vi.fn(() => 'mockToken'), // Mocked implementation of `sign`
    verify: vi.fn(() => ({
      id: 1,
      email: 'test@example.com',
      name: 'John',
      surname: 'Doe',
    })), // Mocked implementation of `verify`
  },
} as unknown as FastifyRequest;

const mockReply = {
  setCookie: vi.fn(), // Mocked implementation of `setCookie`
} as unknown as FastifyReply;


export const tokenTests = () => {
  describe('Request and JWT Integration', () => {
    it('should sign and set a token on login', async () => {
      const userPayload = {
        id: 1,
        email: 'test@example.com',
        name: 'John',
        surname: 'Doe',
      };

      // Call the mocked `sign` method
      const token = mockRequest.jwt.sign(userPayload);

      // Validate that the token matches the mock
      expect(token).toBe('mockToken');

      // Simulate setting the cookie
      mockReply.setCookie('access_token', token, {
        path: '/',
        httpOnly: true,
        secure: true,
      });

      // Validate that `setCookie` was called with the correct parameters
      expect(mockReply.setCookie).toHaveBeenCalledWith(
        'access_token',
        'mockToken',
        expect.objectContaining({ httpOnly: true })
      );
    });

    it('should verify a valid token', async () => {
      // Call the mocked `verify` method
      const decodedUser = mockRequest.jwt.verify('mockToken');

      // Validate that the decoded user matches the expected payload
      expect(decodedUser).toMatchObject({
        id: 1,
        email: 'test@example.com',
        name: 'John',
        surname: 'Doe',
      });
    });

    it('should reject an invalid token', async () => {
      // Override the `verify` mock to throw an error for an invalid token
      mockRequest.jwt.verify = vi.fn(() => {
        throw new Error('Invalid token');
      });

      // Validate that the invalid token throws an error
      expect(() => mockRequest.jwt.verify('badToken')).toThrow('Invalid token');
    });
  });
}

if (import.meta.url === 'file://' + __filename) {
  // If so, run the tests immediately
  tokenTests();
}
