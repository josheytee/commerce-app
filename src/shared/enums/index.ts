export enum UserRoleEnum {
    ADMIN = 'admin',
    VENDOR = 'vendor',
    CUSTOMER = 'customer',
}

export enum OrderStatusEnum {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum PaymentStatusEnum {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}
