export type IProduceFilterRequest = {
  searchTerm?: string;
  category?: string;
  vendorId?: string;
  minPrice?: string;
  maxPrice?: string;
};

export type IProduceCreateRequest = {
  name: string;
  description: string;
  price: number;
  category: string;
  vendorId: string;
  availableQuantity: number;
};
