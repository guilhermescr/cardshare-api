import { RegisterDto } from '../../../src/dtos/auth.dto';
import { ClassValidator } from '../../../src/utils/ClassValidator';

describe('ClassValidator', () => {
  it('should validate a correct RegisterDto', async () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };
    const result = await ClassValidator.validate(RegisterDto, validData);
    expect(result).toBeInstanceOf(RegisterDto);
    expect(result.username).toBe(validData.username);
  });

  it('should throw on invalid RegisterDto', async () => {
    const invalidData = {
      username: '',
      email: 'not-an-email',
      password: 'short',
    };
    await expect(
      ClassValidator.validate(RegisterDto, invalidData)
    ).rejects.toHaveProperty('status', 400);
  });

  it('should throw if no data is provided', async () => {
    await expect(
      ClassValidator.validate(RegisterDto, undefined)
    ).rejects.toHaveProperty('status', 400);
  });

  it('should handle validation errors without constraints', async () => {
    jest
      .spyOn(require('class-validator'), 'validate')
      .mockResolvedValue([{ property: 'username' }]);
    await expect(
      ClassValidator.validate(RegisterDto, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toHaveProperty('status', 400);
    require('class-validator').validate.mockRestore();
  });
});
