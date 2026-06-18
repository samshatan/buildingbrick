import { jest } from '@jest/globals';

const mockJwt = {
  verify: jest.fn(),
  sign: jest.fn()
};

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: mockJwt
}));

const mockUser = {
  findById: jest.fn()
};

jest.unstable_mockModule('../../models/User.js', () => ({
  default: mockUser
}));

// Dynamic import needed after mocking with unstable_mockModule
const { protect } = await import('../authMiddleware.js');

describe('Auth Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Clear mocks
    jest.clearAllMocks();

    // Setup default environment variables
    process.env.JWT_SECRET = 'testsecret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should return 401 if no authorization header is provided', async () => {
    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', async () => {
    req.headers.authorization = 'Basic dXNlcjpwYXNz';
    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if valid token and user is found', async () => {
    const mockUserData = { _id: 'user123', name: 'John Doe' };
    req.headers.authorization = 'Bearer validtoken';

    mockJwt.verify.mockReturnValue({ id: 'user123' });

    // Mock the chainable select method
    mockUser.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUserData)
    });

    await protect(req, res, next);

    expect(mockJwt.verify).toHaveBeenCalledWith('validtoken', 'testsecret');
    expect(mockUser.findById).toHaveBeenCalledWith('user123');
    expect(req.user).toEqual(mockUserData);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    req.headers.authorization = 'Bearer invalidtoken';

    mockJwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw an error if JWT_SECRET is not defined', async () => {
    delete process.env.JWT_SECRET;
    req.headers.authorization = 'Bearer validtoken';

    // We expect protect to catch the error and return 401
    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not found', async () => {
    req.headers.authorization = 'Bearer validtoken';

    mockJwt.verify.mockReturnValue({ id: 'nonexistentuser' });

    mockUser.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, user not found' });
    expect(next).not.toHaveBeenCalled();
  });
});
