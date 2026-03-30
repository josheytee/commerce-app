import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './models/rating.model';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating)
    private ratingModel: typeof Rating,
  ) { }

  async create(
    createRatingDto: CreateRatingDto,
    userId: number,
  ): Promise<Rating> {
    // Check if user already rated this entity
    const existing = await this.ratingModel.findOne({
      where: {
        entity_type: createRatingDto.entity_type,
        entity_id: createRatingDto.entity_id,
        user_id: userId,
      },
    });

    if (existing) {
      throw new BadRequestException('User has already rated this entity');
    }

    return await this.ratingModel.create({
      ...createRatingDto,
      user_id: userId,
    });
  }

  async update(
    id: number,
    updateRatingDto: UpdateRatingDto,
    userId: number,
  ): Promise<Rating> {
    const rating = await this.findOne(id);

    if (rating.user_id !== userId) {
      throw new BadRequestException('You can only update your own ratings');
    }

    await rating.update(updateRatingDto);
    return rating;
  }

  async findOne(id: number): Promise<Rating> {
    const rating = await this.ratingModel.findByPk(id);
    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
    return rating;
  }

  async findByUser(
    entity_type: string,
    entity_id: number,
    user_id: number,
  ): Promise<Rating | null> {
    return await this.ratingModel.findOne({
      where: { entity_type, entity_id, user_id },
    });
  }

  async findAll(options?: {
    entity_type?: string;
    entity_id?: number;
    user_id?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Rating[]; total: number }> {
    const where: any = {};

    if (options?.entity_type) where.entity_type = options.entity_type;
    if (options?.entity_id) where.entity_id = options.entity_id;
    if (options?.user_id) where.user_id = options.user_id;

    const { rows, count } = await this.ratingModel.findAndCountAll({
      where,
      limit: options?.limit,
      offset: options?.offset,
      order: [['created_at', 'DESC']],
    });

    return { data: rows, total: count };
  }

  async getStats(
    entity_type: string,
    entity_id: number,
  ): Promise<{
    average_rating: number;
    total_ratings: number;
    rating_distribution: Record<number, number>;
    criteria_averages?: Record<string, number>;
  }> {
    const ratings = await this.ratingModel.findAll({
      where: { entity_type, entity_id },
    });

    if (ratings.length === 0) {
      return {
        average_rating: 0,
        total_ratings: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const total = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / total;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    // Calculate criteria averages if criteria_scores exist
    let criteriaAverages: Record<string, number> = {};
    const criteriaRatings = ratings.filter((r) => r.criteria_scores);

    if (criteriaRatings.length > 0) {
      const criteriaSum: Record<string, number> = {};
      const criteriaCount: Record<string, number> = {};

      criteriaRatings.forEach((r) => {
        Object.entries(r.criteria_scores).forEach(([key, value]) => {
          criteriaSum[key] = (criteriaSum[key] || 0) + value;
          criteriaCount[key] = (criteriaCount[key] || 0) + 1;
        });
      });

      criteriaAverages = Object.keys(criteriaSum).reduce((acc, key) => {
        acc[key] = criteriaSum[key] / criteriaCount[key];
        return acc;
      }, {});
    }

    return {
      average_rating: parseFloat(average.toFixed(2)),
      total_ratings: total,
      rating_distribution: distribution,
      criteria_averages: criteriaAverages,
    };
  }

  async remove(id: number, userId: number): Promise<void> {
    const rating = await this.findOne(id);

    if (rating.user_id !== userId) {
      throw new BadRequestException('You can only delete your own ratings');
    }

    await rating.destroy();
  }

  async removeByEntity(entity_type: string, entity_id: number): Promise<void> {
    await this.ratingModel.destroy({
      where: { entity_type, entity_id },
    });
  }
}
