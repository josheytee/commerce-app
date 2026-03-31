export const CACHE_KEYS = {
    PRODUCT_DETAIL: (id: number) => `product:${id}`,
    VENDOR_STOREFRONT: (slug: string) => `vendor:storefront:${slug}`,
    CATEGORY_TREE: 'categories:tree',
    USER_SESSION: (userId: number) => `session:${userId}`,
} as const;
