export class RatingResponseDto {
    id: number;
    rating: number;
    comment: string | null;
    entity_type: string;
    entity_id: number;
    user_id: number;
    criteria_scores: Record<string, number> | null;
    metadata: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;

    user?: {
        id: number;
        name: string;
        email: string;
    };
}
