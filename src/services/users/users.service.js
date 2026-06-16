import { usersApi } from '../../api/index.js';
import { extractData, success, failure } from '../shared/response.js';
import { normalizeUser } from '../shared/normalizers.js';

export const getAllUsersData = async (limit, searchTerm = '') => {
  try {
    const response = await usersApi.getAllUsers({ limit, search: searchTerm });
    const users = extractData(response);
    return success((Array.isArray(users) ? users : []).map((user) => normalizeUser(user)));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getUserData = async (userId) => {
  try {
    if (!userId) {
      return failure('User ID is required');
    }
    const user = await usersApi.getUserById(userId);
    return success(normalizeUser(extractData(user)));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const createUserWithCredentials = async (payload) => {
  try {
    const result = await usersApi.createUser(payload);
    return success(normalizeUser(extractData(result)));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const toggleUserAccountStatus = async (userId, status) => {
  try {
    const result = await usersApi.updateUserById(userId, { status });
    return success(normalizeUser(extractData(result)));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const result = await usersApi.updateUserById(userId, { role });
    return success(normalizeUser(extractData(result)));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};
