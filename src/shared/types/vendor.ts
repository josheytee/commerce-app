// types/vendor-filter.types.ts
export interface VendorFilter {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'pending' | 'active' | 'suspended' | 'inactive';
    categoryId?: number;
    isVerified?: boolean;
    isFeatured?: boolean;
    sortBy?:
    | 'business_name'
    | 'rating_average'
    | 'total_ratings'
    | 'total_reviews'
    | 'created_at'
    | 'updated_at';
    sortOrder?: 'ASC' | 'DESC';
    minRating?: number;
    maxRating?: number;
    minReviews?: number;
    startDate?: string;
    endDate?: string;
    hasStores?: boolean;
    hasOrders?: boolean;
    bestSellers?: boolean;
    mostActive?: boolean;
    newVendors?: boolean;
    featured?: boolean;
}
