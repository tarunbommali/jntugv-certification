import { certificationsApi } from '../../api/index.js';
import { extractData, success, failure } from '../shared/response.js';

export const getAllCertifications = async (params = {}) => {
  try {
    const response = await certificationsApi.getAdminCertifications(params);
    const certifications = extractData(response);
    return success(Array.isArray(certifications) ? certifications : []);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getCertificationById = async (certificationId) => {
  try {
    if (!certificationId) {
      return failure('Certification ID is required');
    }
    const response = await certificationsApi.getCertificationById(certificationId);
    const certification = extractData(response);
    return success(certification);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const createCertification = async (payload) => {
  try {
    if (!payload?.userId || !payload?.courseId) {
      return failure('userId and courseId are required');
    }

    const response = await certificationsApi.createCertification(payload);
    return success(extractData(response));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updateCertification = async (certificationId, payload) => {
  try {
    if (!certificationId) {
      return failure('Certification ID is required');
    }

    const response = await certificationsApi.updateCertification(certificationId, payload);
    return success(extractData(response));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const deleteCertification = async (certificationId) => {
  try {
    if (!certificationId) {
      return failure('Certification ID is required');
    }

    await certificationsApi.deleteCertification(certificationId);
    return success(true);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};
