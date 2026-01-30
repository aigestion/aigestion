import type { NextFunction, Request, Response } from 'express';
import { buildResponse } from '../common/response-builder';
import { TYPES, container } from '../config/inversify.config';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/errors';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = container.get<UserService>(TYPES.UserService);
    const user = await userService.create(req.body);
    res.status(201).json(buildResponse(user, 201, (req as any).requestId));
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = container.get<UserService>(TYPES.UserService);
    const { page = 1, limit = 10 } = (req as any).pagination || {};
    const { data, total } = await userService.findAll(Number(page), Number(limit));

    const response = {
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total
      },
    };
    res.json(buildResponse(response, 200, (req as any).requestId));
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = container.get<UserService>(TYPES.UserService);
    const { id } = req.params as any;
    const user = await userService.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404, 'NOT_FOUND'));
    }
    res.json(buildResponse(user, 200, (req as any).requestId));
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = container.get<UserService>(TYPES.UserService);
    const { id } = req.params as any;
    const user = await userService.update(id, req.body);
    if (!user) {
      return next(new AppError('User not found', 404, 'NOT_FOUND'));
    }
    res.json(buildResponse(user, 200, (req as any).requestId));
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = container.get<UserService>(TYPES.UserService);
    const { id } = req.params as any;
    const success = await userService.delete(id);
    if (!success) {
      return next(new AppError('User not found', 404, 'NOT_FOUND'));
    }
    res.json(buildResponse({ message: 'User deleted' }, 200, (req as any).requestId));
  } catch (err) {
    next(err);
  }
};
