export type ICertificationCreateRequest = {
  vendorId: string;
  certifyingAgency: string;
  certificationDate: string;
};

export type ICertificationFilterRequest = {
  certifyingAgency?: string;
  vendorId?: string;
};
