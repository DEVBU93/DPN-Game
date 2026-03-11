/**
 * Tests — errorHandler middleware
 */
import { Request, Response } from 'express';
import { errorHandler, AppError } from '../middlewares/errorHandler';

const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn();

describe('errorHandler middleware', () => {
  beforeEach(() => { process.env.NODE_ENV = 'test'; });

  it('should handle AppError with correct status code', () => {
    const err = new AppError('Not found', 404);
    const res = mockRes();
    errorHandler(err, {} as Request, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Not found' }));
  });

  it('should return 500 for unexpected errors', () => {
    const err = new Error('Unexpected crash');
    const res = mockRes();
    errorHandler(err, {} as Request, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
