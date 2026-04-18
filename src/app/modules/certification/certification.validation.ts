import { z } from 'zod';

const createCertificationZodSchema = z.object({
  body: z.object({
    vendorId: z.string({ error: 'Vendor ID is required' }),
    certifyingAgency: z.string({ error: 'Agency name is required' }),
    certificationDate: z.string({ error: 'Date is required' }).datetime(),
  }),
});

const verifyCertificationZodSchema = z.object({
  body: z.object({
    isVerified: z.boolean().optional(),
  }),
});

export const CertificationValidation = {
  createCertificationZodSchema,
  verifyCertificationZodSchema,
};
