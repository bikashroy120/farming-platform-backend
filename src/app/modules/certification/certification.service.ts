import httpStatus from 'http-status';
import { SustainabilityCert } from '../../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import ApiError from '../../../error/ApiError';

/**
 * Submit a new certification for a vendor
 */
const createCertification = async (
  data: SustainabilityCert,
): Promise<SustainabilityCert> => {
  return await prisma.$transaction(async tx => {
    // Check if vendor profile exists
    const vendor = await tx.vendorProfile.findUnique({
      where: { id: data.vendorId },
    });

    if (!vendor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Vendor profile not found');
    }

    const result = await tx.sustainabilityCert.create({
      data: {
        ...data,
        certificationDate: new Date(data.certificationDate),
      },
      include: { vendor: true },
    });

    return result;
  });
};

/**
 * Get all certifications for a specific vendor
 */
const getVendorCertifications = async (
  vendorId: string,
): Promise<SustainabilityCert[]> => {
  return await prisma.sustainabilityCert.findMany({
    where: { vendorId },
    orderBy: { certificationDate: 'desc' },
  });
};

/**
 * Admin action to verify/update certification
 */
const verifyCertification = async (
  id: string,
  payload: any,
): Promise<SustainabilityCert> => {
  const isExist = await prisma.sustainabilityCert.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Certification record not found');
  }

  // Update logic
  return await prisma.sustainabilityCert.update({
    where: { id },
    data: payload,
  });
};

export const CertificationService = {
  createCertification,
  getVendorCertifications,
  verifyCertification,
};
