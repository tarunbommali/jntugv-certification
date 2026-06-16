import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as UsersService from './users.service.js';

export const list = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number.parseInt(req.query.limit, 10) : undefined;
  const searchTerm = req.query.search;
  const users = await UsersService.listUsers(limit, searchTerm);
  res.json({ success: true, data: users });
});

export const getById = asyncHandler(async (req, res) => {
  const user = await UsersService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});

export const create = asyncHandler(async (req, res) => {
  const user = await UsersService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

export const update = asyncHandler(async (req, res) => {
  const user = await UsersService.updateUser(req.params.id, req.body);
  res.json({ success: true, data: user });
});
