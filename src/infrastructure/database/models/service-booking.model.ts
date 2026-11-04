// ============================================================
// SERVICE BOOKING

import {
    Table,
    PrimaryKey,
    AutoIncrement,
    Column,
    ForeignKey,
    AllowNull,
    DataType,
    Default,
    CreatedAt,
    UpdatedAt,
    Model,
    BelongsTo,
} from 'sequelize-typescript';
import { BookingStatusEnum } from 'src/shared';
import { CustomerModel } from './customer.model';
import { ProductVariantModel } from './product-variant.model';
import { StoreModel } from './store.model';

// ============================================================
@Table({
    timestamps: true,
    underscored: true,
    tableName: 'service_bookings',
    indexes: [
        {
            fields: ['variant_id', 'store_id', 'booking_date'],
            name: 'sb_lookup_idx',
        },
        { fields: ['customer_id', 'booking_date'], name: 'sb_customer_idx' },
        { fields: ['status'], name: 'sb_status_idx' },
    ],
})
export class ServiceBookingModel extends Model<ServiceBookingModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => ProductVariantModel)
    @AllowNull(false)
    @Column
    variant_id: number;

    @BelongsTo(() => ProductVariantModel)
    variant: ProductVariantModel;

    @ForeignKey(() => StoreModel)
    @AllowNull(false)
    @Column
    store_id: number;

    @BelongsTo(() => StoreModel)
    store: StoreModel;

    @ForeignKey(() => CustomerModel)
    @Column
    customer_id: number;

    @BelongsTo(() => CustomerModel)
    customer: CustomerModel;

    //   @ForeignKey(() => StoreStaffModel)
    //   @Column
    //   staff_id: number;

    //   @BelongsTo(() => StoreStaffModel)
    //   staff: StoreStaffModel;

    @AllowNull(false)
    @Column({ type: DataType.DATEONLY })
    booking_date: Date;

    @AllowNull(false)
    @Column({ type: DataType.TIME })
    start_time: Date;

    @AllowNull(false)
    @Column({ type: DataType.TIME })
    end_time: Date;

    @Default(BookingStatusEnum.HELD)
    @Column({
        type: DataType.ENUM(...Object.values(BookingStatusEnum)),
    })
    status: BookingStatusEnum;

    @Column({ type: DataType.TEXT })
    notes: string;

    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    reminder_sent: boolean;

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date;
}
