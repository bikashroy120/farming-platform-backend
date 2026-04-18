export type IOrderFilterRequest = {
  searchTerm?: string;
  status?: string;
  vendorId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
};

export type ICreateOrderRequest = {
  produceId: string;
  quantity: number;
};
