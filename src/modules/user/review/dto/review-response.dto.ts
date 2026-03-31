import { ReviewTypeEnum } from "src/shared";

export class ReviewResponseDto {
    id: number;
    title: string;
    content: string;
    type: ReviewTypeEnum;
    entity_type: string;
    entity_id: number;
    user_id: number;
    pros: string[];
    cons: string[];
    images: string[];
    helpful_count: number;
    not_helpful_count: number;
    is_verified_purchase: boolean;
    is_approved: boolean;
    approved_at: Date | null;
    approved_by: number | null;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;

    // Optional: include user info if you want to populate
    user?: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
}
