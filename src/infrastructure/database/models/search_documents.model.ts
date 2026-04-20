import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    AllowNull,
    Index,
    ForeignKey,
    Default,
} from 'sequelize-typescript';

@Table({
    tableName: 'search_documents',
    indexes: [
        { fields: ['entity_type', 'entity_id'], unique: true },
        // GIN index for JSONB filtering (PostgreSQL)
        { fields: ['filters'], using: 'GIN' },
        // Full-text search
        { fields: ['search_vector'], using: 'GIN' },
        // Common filters
        { fields: ['store_id', 'entity_type', 'is_active'] },
        { fields: ['section_id', 'is_active'] },
        { fields: ['price_min', 'price_max'] },
    ],
})
export class SearchDocumentModel extends Model<SearchDocumentModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @AllowNull(false)
    @Column({ type: DataType.STRING(50) })
    entity_type: 'product' | 'section' | 'vendor';

    @AllowNull(false)
    @Column
    entity_id: number;

    // Ownership
    @Column
    store_id: number;

    @Column
    vendor_id: number;

    @Column
    section_id: number;

    // Searchable content
    @Column({ type: DataType.TEXT })
    title: string;

    @Column({ type: DataType.TEXT })
    content: string; // Concatenated description, attributes, etc.

    @Column({ type: DataType.TSVECTOR }) // PostgreSQL full-text
    search_vector: string;

    // Denormalized filters (JSONB for flexibility)
    @Column({ type: DataType.JSONB })
    filters: {
        price_min: number;
        price_max: number;
        rating_min: number;
        attributes: Record<string, string[]>; // { color: ['red', 'blue'], size: ['M'] }
        in_stock: boolean;
        is_featured: boolean;
        tags: string[];
    };

    @Column({ type: DataType.JSONB })
    sort_data: {
        price: number;
        created_at: string;
        popularity: number;
        name: string;
    };

    @Default(true)
    @Column({ type: DataType.BOOLEAN })
    is_active: boolean;

    @Column({ type: DataType.DATE })
    last_synced_at: Date;
}
