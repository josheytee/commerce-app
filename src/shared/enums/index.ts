// Pattern: <DescriptiveName>Enum (PascalCase, values in UPPER_SNAKE_CASE)

export * from './order.enums';
export * from './discount.enums';
export * from './fulfillment.enums';
export * from './product.enum';

export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
}

export enum VendorStatusEnum {
    PENDING = 'pending',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    INACTIVE = 'inactive',
    REJECTED = 'rejected',
}

export enum UserRoleEnum {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    VENDOR = 'vendor',
    CUSTOMER = 'customer',
    GUEST = 'guest',
}

export enum PermissionEnum {
    VENDOR_CREATE = 'vendor:create',
    VENDOR_READ = 'vendor:read',
    VENDOR_UPDATE = 'vendor:update',
    VENDOR_DELETE = 'vendor:delete',
    PRODUCT_CREATE = 'product:create',
    PRODUCT_READ = 'product:read',
    ORDER_MANAGE = 'order:manage',
    USER_MANAGE = 'user:manage',
}

export enum MediaTypeEnum {
    VENDOR_LOGO = 'vendor_logo',
    VENDOR_COVER = 'vendor_cover',
    VENDOR_GALLERY = 'vendor_gallery',
    PRODUCT_IMAGE = 'product_image',
    PRODUCT_GALLERY = 'product_gallery',
    USER_AVATAR = 'user_avatar',
    USER_COVER = 'user_cover',
    SECTION_IMAGE = 'section_image',
    CATEGORY_IMAGE = 'category_image',
    REVIEW_IMAGE = 'review_image',
}

export enum ReviewTypeEnum {
    VENDOR = 'vendor',
    PRODUCT = 'product',
    STORE = 'store',
}
export enum TagTypeEnum {
    VENDOR = 'vendor',
    PRODUCT = 'product',
    STORE = 'store',
}

export enum BusinessTypeEnum {
    INDIVIDUAL = 'individual',
    REGISTERED_BUSINESS = 'registered_business',
}

export enum DocumentTypeEnum {
    ID_CARD = 'id_card',
    PASSPORT = 'passport',
    CAC = 'cac', // Corporate Affairs Commission
    UTILITY_BILL = 'utility_bill',
}

export enum PromotionTypeEnum {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
    BOGO = 'bogo', // Buy One Get One
}

export enum PaymentStatusEnum {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum AddressableTypeEnum {
    CUSTOMER = 'customer',
    STORE = 'store',
}

export enum AddressTypeEnum {
    SHIPPING = 'shipping',
    BILLING = 'billing',
    BOTH = 'both',
    PHYSICAL = 'physical',
    POSTAL = 'postal',
    WAREHOUSE = 'warehouse',
    RETURNS = 'returns',
}

export enum VariantStockStatusEnum {
    IN_STOCK = 'in_stock',
    OUT_OF_STOCK = 'out_of_stock',
    BACKORDER = 'backorder',
}


export enum StockStatusEnum {
    IN_STOCK = 'in_stock',
    OUT_OF_STOCK = 'out_of_stock',
    BACKORDER = 'backorder',
    PRE_ORDER = 'pre_order',
    LOW_STOCK = 'low_stock',
}

export enum StoreStatusEnum {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
}

export enum RiderStatusEnum {
    AVAILABLE = 'available',
    BUSY = 'busy',
    OFFLINE = 'offline',
}
