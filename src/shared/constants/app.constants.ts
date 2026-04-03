// Shared constants across the application
export const APP_CONSTANTS = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    DEFAULT_SORT_ORDER: 'DESC',
};

export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Bad request',
    INTERNAL_SERVER_ERROR: 'Internal server error',
};

export const SUCCESS_MESSAGES = {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    FETCHED: 'Resource fetched successfully',
};


export enum ProductStatusEnum {
    DRAFT = 'draft',
    PENDING = 'pending',
    PUBLISHED = 'published',
    OUT_OF_STOCK = 'out_of_stock',
    DISCONTINUED = 'discontinued',
    ARCHIVED = 'archived',
}

export enum ProductTypeEnum {
    SIMPLE = 'simple',
    VARIABLE = 'variable',
    DIGITAL = 'digital',
    SERVICE = 'service',
    BUNDLE = 'bundle',
}

export enum StockStatusEnum {
    IN_STOCK = 'in_stock',
    OUT_OF_STOCK = 'out_of_stock',
    BACKORDER = 'backorder',
    PRE_ORDER = 'pre_order',
    LOW_STOCK = 'low_stock',
}

export enum DiscountTypeEnum {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
    BUY_X_GET_Y = 'buy_x_get_y',
    FREE_SHIPPING = 'free_shipping',
}

export enum DiscountAppliesToEnum {
    PRODUCT = 'product',
    VARIANT = 'variant',
    CATEGORY = 'category',
    CART = 'cart',
    CUSTOMER = 'customer',
}