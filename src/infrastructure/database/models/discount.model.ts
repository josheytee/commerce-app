// discount.model.ts
import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    Default,
    AllowNull,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    Index,
    Unique,
} from 'sequelize-typescript';
import { DiscountTypeEnum } from 'src/shared';

@Table({
    timestamps: true,
    underscored: true,
    paranoid: true,
    tableName: 'discounts',
    indexes: [
        { fields: ['entity_type', 'entity_id'], name: 'discounts_entity_idx' },
        { fields: ['code'], name: 'discounts_code_idx', unique: true },
        { fields: ['start_date', 'end_date'], name: 'discounts_dates_idx' },
        { fields: ['is_active'], name: 'discounts_active_idx' },
        { fields: ['type'], name: 'discounts_type_idx' },
    ],
})
export class DiscountModel extends Model<DiscountModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column({ type: DataType.STRING(255) })
    name: string;

    @Column({ type: DataType.TEXT })
    description: string;

    @Unique
    @Column({ type: DataType.STRING(50) })
    code: string;

    @AllowNull(false)
    @Column({ type: DataType.ENUM(...Object.values(DiscountTypeEnum)) })
    type: DiscountTypeEnum;

    @AllowNull(false)
    @Column({ type: DataType.DECIMAL(10, 2) })
    value: number;

    // For Buy X Get Y
    @Column({ type: DataType.INTEGER })
    buy_quantity: number;

    @Column({ type: DataType.INTEGER })
    get_quantity: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    max_discount_amount: number;

    // Conditions
    @Column({ type: DataType.DECIMAL(10, 2) })
    min_order_amount: number;

    @Column({ type: DataType.DECIMAL(10, 2) })
    max_order_amount: number;

    @Column({ type: DataType.INTEGER })
    min_quantity: number;

    @Column({ type: DataType.INTEGER })
    max_quantity: number;

    // Polymorphic fields
    @Column({ type: DataType.STRING(100) })
    entity_type: string; // 'product', 'variant', 'category', 'customer'

    @Column({ type: DataType.INTEGER })
    entity_id: number;

    // Customer eligibility
    @Column({ type: DataType.JSONB })
    customer_eligibility: {
        customer_groups?: string[];
        first_time_only?: boolean;
        min_purchase_count?: number;
    };

    // Dates
    @AllowNull(false)
    @Column({ type: DataType.DATE })
    start_date: Date;

    @AllowNull(false)
    @Column({ type: DataType.DATE })
    end_date: Date;

    // Usage limits
    @Default(0)
    @Column({ type: DataType.INTEGER })
    usage_limit: number;

    @Default(0)
    @Column({ type: DataType.INTEGER })
    used_count: number;

    @Default(0)
    @Column({ type: DataType.INTEGER })
    usage_per_customer: number;

    // Status
    @Default(true)
    @Column({ type: DataType.BOOLEAN })
    is_active: boolean;

    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    is_public: boolean;

    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    stackable: boolean;

    @Column({ type: DataType.JSONB })
    metadata: Record<string, any>;

    @CreatedAt
    @Column
    created_at: Date;

    @UpdatedAt
    @Column
    updated_at: Date;

    @DeletedAt
    @Column
    deleted_at: Date;

    // Helper methods
    get is_valid(): boolean {
        const now = new Date();
        return (
            this.is_active &&
            now >= this.start_date &&
            now <= this.end_date &&
            (this.usage_limit === 0 || this.used_count < this.usage_limit)
        );
    }

    get formatted_value(): string {
        if (this.type === DiscountTypeEnum.PERCENTAGE) {
            return `${this.value}% OFF`;
        } else if (this.type === DiscountTypeEnum.FIXED) {
            return `$${this.value} OFF`;
        } else if (this.type === DiscountTypeEnum.BUY_X_GET_Y) {
            return `Buy ${this.buy_quantity} Get ${this.get_quantity} Free`;
        }
        return this.name;
    }
}
