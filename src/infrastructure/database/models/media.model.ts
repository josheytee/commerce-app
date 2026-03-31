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
import { MediaTypeEnum } from 'src/shared';
@Table({
    tableName: 'media',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'media_entity_index',
            fields: ['entity_type', 'entity_id'],
        },
        {
            name: 'media_type_index',
            fields: ['type'],
        },
    ],
})
export class MediaModel extends Model<MediaModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
    })
    url: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    key: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    thumbnail_url: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    medium_url: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    alt_text: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: true,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    caption: string;

    @Column({
        type: DataType.ENUM(...Object.values(MediaTypeEnum)),
        allowNull: false,
    })
    type: MediaTypeEnum;

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
        defaultValue: 0,
    })
    sort_order: number;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    is_primary: boolean;

    @Column({
        type: DataType.JSONB,
        allowNull: true,
    })
    metadata: Record<string, any>;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    file_size: number;

    @Column({
        type: DataType.STRING(50),
        allowNull: true,
    })
    mime_type: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    uploaded_by: number;

    @CreatedAt
    @Column
    created_at: Date;

    @UpdatedAt
    @Column
    updated_at: Date;
}