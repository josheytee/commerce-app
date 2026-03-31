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
    Unique,
} from 'sequelize-typescript';

@Table({
    tableName: 'ratings',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'ratings_entity_index',
            fields: ['entity_type', 'entity_id'],
        },
        {
            name: 'ratings_user_index',
            fields: ['user_id'],
        },
        {
            name: 'ratings_user_entity_unique',
            unique: true,
            fields: ['entity_type', 'entity_id', 'user_id'],
        },
    ],
})
export class RatingModel extends Model<RatingModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    })
    rating: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    comment: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    entity_type: string;

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
    criteria_scores: Record<string, number>;

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