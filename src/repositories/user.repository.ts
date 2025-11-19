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
        $project: {
          id: '$_id',
          fullName: 1,
          username: 1,
          profilePicture: 1,
          followers: { $size: '$followers' },
          following: { $size: '$following' },
          cards: { $size: '$cards' },
          likes: { $size: '$likes' },
          favorites: { $size: '$favorites' },
          comments: { $size: '$comments' },
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
