import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as CertService from './certificates.service.js';

export const list = asyncHandler(async (req, res) => {
  const data = await CertService.listCertifications(req.query, req.user);
  res.json({ success: true, data });
});

export const getById = asyncHandler(async (req, res) => {
  const data = await CertService.getCertificationById(req.params.id, req.user);
  res.json({ success: true, data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await CertService.createCertification(req.body, req.user);
  res.status(201).json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await CertService.updateCertification(req.params.id, req.body, req.user);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  await CertService.deleteCertification(req.params.id);
  res.status(204).send();
});
