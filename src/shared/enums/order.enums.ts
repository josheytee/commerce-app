// shared/enums/order.enums.ts

export enum PaymentStatusEnum {
    PENDING = 'pending',
    PROCESSING = 'processing',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum OrderItemStatusEnum {
    PENDING = 'pending',
    PICKED = 'picked',
    PACKED = 'packed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
    FULFILLED = 'FULFILLED',
    PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
}

export enum CartStatusEnum {
    ACTIVE = 'active',
    CONVERTED = 'converted',
    ABANDONED = 'abandoned',
}

export enum InventoryReservationStatusEnum {
    HELD = 'held',
    COMMITTED = 'committed',
    RELEASED = 'released',
    EXPIRED = 'expired',
}

export enum BookingStatusEnum {
    HELD = 'held',
    CONFIRMED = 'confirmed',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
}

export enum OrderStatusEnum {
    ALL = 'all',
    PENDING_PAYMENT = 'pending_payment',
    PAYMENT_FAILED = 'payment_failed',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    READY_FOR_PICKUP = 'ready_for_pickup',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
    FULFILLED = 'FULFILLED',
    PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
}

export enum OrderTypeEnum {
    SINGLE_VENDOR = 'single_vendor',
    MULTI_VENDOR = 'multi_vendor',
    SINGLE_STORE = 'single_store',
    MULTI_STORE = 'multi_store',
}

export enum SubOrderTypeEnum {
    PHYSICAL = 'physical',
    SERVICE = 'service',
    DIGITAL = 'digital',
    MIXED = 'mixed',
}

export enum FulfillmentTypeEnum {
    PHYSICAL = 'physical',
    SERVICE = 'service',
    DIGITAL = 'digital',
    PICKUP = 'pickup',
}

export enum OrderSourceEnum {
    WEB = 'web',
    MOBILE = 'mobile',
    API = 'api',
    POS = 'pos',
    MARKETPLACE = 'marketplace',
    BULK = 'bulk',
}

export enum ShipmentStatusEnum {
    PENDING = 'pending',
    PROCESSING = 'processing',
    READY_FOR_PICKUP = 'ready_for_pickup',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
}
