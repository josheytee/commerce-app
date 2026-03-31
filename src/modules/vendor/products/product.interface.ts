export interface ProductModel {
  id?: number;

  name: string;

  slug?: string;

  description: string;

  details?: string;

  quantity: number;

  // featured: boolean;

  // review_able: boolean;

  price: number;

  status?: string;

  section_id: number;

  store_id: number;
}
