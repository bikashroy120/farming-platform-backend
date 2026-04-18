import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { CertificationService } from './certification.service';
import { sendResponse } from '../../../shared/customResponse';

const createCertification = catchAsync(async (req: Request, res: Response) => {
  const result = await CertificationService.createCertification(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Certification submitted successfully',
    data: result,
  });
});

const getVendorCertifications = catchAsync(
  async (req: Request, res: Response) => {
    const { vendorId } = req.params;
    const result = await CertificationService.getVendorCertifications(
      vendorId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Vendor certifications retrieved successfully',
      data: result,
    });
  },
);

const verifyCertification = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CertificationService.verifyCertification(
    id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Certification verified/updated successfully',
    data: result,
  });
});

export const CertificationController = {
  createCertification,
  getVendorCertifications,
  verifyCertification,
};
