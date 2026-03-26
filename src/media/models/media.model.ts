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
import { MediaType } from './media-type.enum';

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
export class Media extends Model<Media> {
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
        type: DataType.ENUM(...Object.values(MediaType)),
        allowNull: false,
    })
    type: MediaType;

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