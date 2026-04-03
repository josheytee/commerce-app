export interface OrderSearchCriteria {
  id?: number;
  orderReference?: string;
  userId?: number;
  status?: string;
  paymentStatus?: string;
  email?: string;
  phone?: string;
  startDate?: Date;
  endDate?: Date;
}
