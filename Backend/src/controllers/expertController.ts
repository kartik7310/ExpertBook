import { Request, Response, NextFunction } from 'express';
import expertService from '../services/expertService';
import AppError from '../utils/AppError';

export const getExperts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, page, limit } = req.query;

    const result = await expertService.getAllExperts({
      name: name as string,
      category: category as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
    });

    res.status(200).json({
      status: 'success',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const expert = await expertService.getExpertById(req.params.id as string);

    if (!expert) {
      return next(new AppError('No expert found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: expert,
    });
  } catch (error) {
    next(error);
  }
};
