import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewType } from './model/review-type.enum';
import { Review } from './model/review.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private reviewModel: typeof Review,
  ) { }

  async create(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<Review> {
    return await this.reviewModel.create({
      ...createReviewDto,
      user_id: userId,
    });
  }

  async findAll(options?: {
    entity_type?: string;
    entity_id?: number;
    user_id?: number;
    is_approved?: boolean;
    type?: ReviewType;
    limit?: number;
    offset?: number;
    sort?: string;
    order?: 'ASC' | 'DESC';
  }): Promise<{ data: Review[]; total: number }> {
    const where: any = {};

    if (options?.entity_type) where.entity_type = options.entity_type;
    if (options?.entity_id) where.entity_id = options.entity_id;
    if (options?.user_id) where.user_id = options.user_id;
    if (options?.is_approved !== undefined)
      where.is_approved = options.is_approved;
    if (options?.type) where.type = options.type;

    const order: any = [];
    if (options?.sort) {
      order.push([options.sort, options.order || 'DESC']);
    } else {
      order.push(['created_at', 'DESC']);
    }

    const { rows, count } = await this.reviewModel.findAndCountAll({
      where,
      limit: options?.limit,
      offset: options?.offset,
      order,
    });

    return { data: rows, total: count };
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewModel.findByPk(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    userId?: number,
  ): Promise<Review> {
    const review = await this.findOne(id);

    if (userId && review.user_id !== userId) {
      throw new BadRequestException('You can only update your own reviews');
    }

    await review.update(updateReviewDto);
    return review;
  }

  async remove(id: number, userId?: number): Promise<void> {
    const review = await this.findOne(id);

    if (userId && review.user_id !== userId) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    await review.destroy();
  }

  async approve(id: number, approvedBy: number): Promise<Review> {
    const review = await this.findOne(id);
    await review.update({
      is_approved: true,
      approved_at: new Date(),
      approved_by: approvedBy,
    });
    return review;
  }

  async reject(id: number, approvedBy: number): Promise<Review> {
    const review = await this.findOne(id);
    await review.update({
      is_approved: false,
      approved_at: new Date(),
      approved_by: approvedBy,
    });
    return review;
  }

  async markHelpful(id: number): Promise<Review> {
    const review = await this.findOne(id);
    await review.increment('helpful_count');
    return review;
  }

  async markNotHelpful(id: number): Promise<Review> {
    const review = await this.findOne(id);
    await review.increment('not_helpful_count');
    return review;
  }

  async getStats(
    entity_type: string,
    entity_id: number,
  ): Promise<{
    total_reviews: number;
    approved_reviews: number;
    pending_reviews: number;
    average_rating?: number;
    helpfulness_rate: number;
    recent_reviews: Review[];
  }> {
    const total = await this.reviewModel.count({
      where: { entity_type, entity_id },
    });

    const approved = await this.reviewModel.count({
      where: { entity_type, entity_id, is_approved: true },
    });

    const pending = await this.reviewModel.count({
      where: { entity_type, entity_id, is_approved: false },
    });

    const reviews = await this.reviewModel.findAll({
      where: { entity_type, entity_id, is_approved: true },
      attributes: ['helpful_count', 'not_helpful_count'],
    });

    let totalHelpful = 0;
    let totalVotes = 0;
    reviews.forEach((review) => {
      totalHelpful += review.helpful_count;
      totalVotes += review.helpful_count + review.not_helpful_count;
    });

    const helpfulnessRate = totalVotes > 0 ? totalHelpful / totalVotes : 0;

    const recentReviews = await this.reviewModel.findAll({
      where: { entity_type, entity_id, is_approved: true },
      limit: 5,
      order: [['created_at', 'DESC']],
    });

    return {
      total_reviews: total,
      approved_reviews: approved,
      pending_reviews: pending,
      helpfulness_rate: helpfulnessRate,
      recent_reviews: recentReviews,
    };
  }

  async getUserReview(
    entity_type: string,
    entity_id: number,
    user_id: number,
  ): Promise<Review | null> {
    return await this.reviewModel.findOne({
      where: { entity_type, entity_id, user_id },
    });
  }
}
