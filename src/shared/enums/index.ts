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
    VARIANT_IMAGE = 'variant_image',
    PRODUCT_GALLERY = 'product_gallery',
    USER_AVATAR = 'user_avatar',
    USER_COVER = 'user_cover',
    SECTION_IMAGE = 'section_image',
    CATEGORY_IMAGE = 'category_image',
    REVIEW_IMAGE = 'review_image',
}

export enum MediaEntityTypeEnum {
    VENDOR = 'vendor',
    PRODUCT = 'product',
    PRODUCT_VARIANT = 'product_variant',
    USER = 'user',
    SECTION = 'section',
    CATEGORY = 'category',
    REVIEW = 'review',
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
    PROCESSING = 'processing',
    PAID = 'paid',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    PARTIALLY_REFUNDED = 'partially_refunded',
    REFUNDED = 'refunded',
    EXPIRED = 'expired',
}

export enum PaymentMethodEnum {
    CARD = 'card',
    BANK_TRANSFER = 'bank_transfer',
    USSD = 'ussd',
    MOBILE_MONEY = 'mobile_money',
    WALLET = 'wallet',
}

export enum PaymentProviderEnum {
    PAYSTACK = 'paystack',
    FLUTTERWAVE = 'flutterwave',
}

// src/shared/enums/order-status.enum.ts
export enum OrderStatusEnum {
    PENDING_PAYMENT = 'pending_payment',
    PAID = 'paid',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
    FAILED = 'failed',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    READY_FOR_PICKUP = 'ready_for_pickup',
    PAYMENT_FAILED = 'payment_failed',

}

// src/shared/enums/fulfillment-mode.enum.ts
export enum FulfillmentModeEnum {
    DELIVERY = 'delivery',
    PICKUP = 'pickup',
    DIGITAL = 'digital',
    APPOINTMENT = 'appointment',
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
    // PRE_ORDER = 'pre_order',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DISCONTINUED = 'discontinued',
    LOW_STOCK = 'low_stock',
}

export enum StockStatusEnum {
    IN_STOCK = 'in_stock',
    OUT_OF_STOCK = 'out_of_stock',
    BACKORDER = 'backorder',
    PRE_ORDER = 'pre_order',
    LOW_STOCK = 'low_stock',
    ON_BACKORDER = 'on_backorder',
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

export enum AttributeTypeEnum {
    SELECT = 'select', // Single choice (dropdown)
    MULTI_SELECT = 'multi', // Multiple choices (checkboxes)
    TEXT = 'text', // Free text input
    BOOLEAN = 'boolean', // Yes/No
    NUMBER = 'number', // Numeric value
}

export enum CartStatusEnum {
    ACTIVE = 'active',
    COMPLETED = 'completed',
    ABANDONED = 'abandoned',
    CONVERTED = 'CONVERTED',
}
