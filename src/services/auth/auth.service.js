import { authApi, usersApi } from '../../api/index.js';
import { extractData, success, failure } from '../shared/response.js';
import { normalizeUser } from '../shared/normalizers.js';

export const createOrUpdateUser = async (_user, payload = {}) => {
  try {
    const result = await authApi.updateProfile(payload);
    return success(normalizeUser(extractData(result)));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getUserProfile = async (userId) => {
  try {
    if (!userId || userId === 'me') {
      const profile = await authApi.fetchCurrentUser();
      return success(normalizeUser(extractData(profile)));
    }

    const user = await usersApi.getUserById(userId);
    return success(normalizeUser(extractData(user)));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updateUserProfile = async (_userId, payload) => {
  try {
    const result = await authApi.updateProfile(payload);
    return success(normalizeUser(extractData(result)));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};
