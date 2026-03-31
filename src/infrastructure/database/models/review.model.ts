import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    CreatedAt,
    UpdatedAt,
    Index,
} from 'sequelize-typescript';
import { ReviewTypeEnum } from 'src/shared';

@Table({
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'reviews_entity_index',
            fields: ['entity_type', 'entity_id'],
        },
        {
            name: 'reviews_user_index',
            fields: ['user_id'],
        },
        {
            name: 'reviews_approved_index',
            fields: ['is_approved'],
        },
    ],
})
export class ReviewModel extends Model<ReviewModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    content: string;

    @Column({
        type: DataType.ENUM(...Object.values(ReviewTypeEnum)),
        allowNull: false,
    })
    entity_type: ReviewTypeEnum;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    entity_id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id: number;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    pros: string[];

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    cons: string[];

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    images: string[];

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    helpful_count: number;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    not_helpful_count: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_verified_purchase: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_approved: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    approved_at: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    approved_by: number;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    metadata: Record<string, any>;

    @CreatedAt
    @Column
    created_at: Date;

    @UpdatedAt
    @Column
    updated_at: Date;
}
