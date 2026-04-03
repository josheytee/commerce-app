import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    Unique,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';
import { TagTypeEnum } from 'src/shared';

@Table({
    timestamps: true,
    underscored: true,
    tableName: 'tags',
    indexes: [
        { fields: ['name'], name: 'tags_name_idx', unique: true },
        { fields: ['slug'], name: 'tags_slug_idx', unique: true },
    ],
})
export class TagModel extends Model<TagModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Unique
    @Column({ type: DataType.STRING(100) })
    name: string;

    @Unique
    @Column({ type: DataType.STRING(100) })
    slug: string;

    @Column({ type: DataType.TEXT })
    description: string;

    @Column({ type: DataType.INTEGER })
    usage_count: number;

    @Column({
        type: DataType.ENUM(...Object.values(TagTypeEnum)),
        allowNull: false,
    })
    entity_type: TagTypeEnum;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    entity_id: number;

    @CreatedAt
    @Column
    created_at: Date;

    @UpdatedAt
    @Column
    updated_at: Date;
}
