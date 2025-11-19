import { Types } from 'mongoose';
import { SummarizedUserDto } from '../dtos/user.dto';
import { User, IUser } from '../models/User';

export class UserRepository {
  async count(query: any): Promise<number> {
    return User.countDocuments(query).exec();
  }

  async find(query: any, projection?: string): Promise<IUser[]> {
    return User.find(query, projection).exec();
  }

  async findPaginated(
    query: any,
    sortField: string = 'username',
    sortOrder: 1 | -1 = 1,
    page: number = 1,
    limit: number = 10
  ): Promise<SummarizedUserDto[]> {
    const skip = (page - 1) * limit;

    return User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'cards',
          localField: '_id',
          foreignField: 'owner',
          as: 'userCards',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'author',
          as: 'userComments',
        },
      },
      {
        $addFields: {
          totalLikes: {
            $sum: {
              $map: {
                input: '$userCards',
                as: 'card',
                in: { $size: { $ifNull: ['$$card.likes', []] } },
              },
            },
          },
        },
      },
      {
        $project: {
          id: '$_id',
          fullName: 1,
          username: 1,
          profilePicture: 1,
          followers: { $size: { $ifNull: ['$followers', []] } },
          following: { $size: { $ifNull: ['$following', []] } },
          cards: { $size: '$userCards' },
          likes: '$totalLikes',
          favorites: { $size: { $ifNull: ['$favorites', []] } },
          comments: { $size: '$userComments' },
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ]).exec() as Promise<SummarizedUserDto[]>;
  }

  async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId).exec();
  }

  async findSummarizedById(userId: string): Promise<SummarizedUserDto | null> {
    const result = await User.aggregate([
      { $match: { _id: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'cards',
          localField: '_id',
          foreignField: 'owner',
          as: 'userCards',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'author',
          as: 'userComments',
        },
      },
      {
        $addFields: {
          totalLikes: {
            $sum: {
              $map: {
                input: '$userCards',
                as: 'card',
                in: { $size: { $ifNull: ['$$card.likes', []] } },
              },
            },
          },
        },
      },
      {
        $project: {
          id: '$_id',
          fullName: 1,
          username: 1,
          profilePicture: 1,
          followers: { $size: { $ifNull: ['$followers', []] } },
          following: { $size: { $ifNull: ['$following', []] } },
          cards: { $size: '$userCards' },
          likes: '$totalLikes',
          favorites: { $size: { $ifNull: ['$favorites', []] } },
          comments: { $size: '$userComments' },
        },
      },
    ]).exec();

    return result.length > 0 ? result[0] : null;
  }

  async findOne(query: any): Promise<IUser | null> {
    return User.findOne(query).exec();
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async updateOne(query: any, update: any): Promise<IUser | null> {
    return User.findOneAndUpdate(query, update, { new: true }).exec();
  }

  async findByIdAndUpdate(userId: string, update: any): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, update, { new: true }).exec();
  }
}
