import { User, IUser } from '../models/User';

export class UserRepository {
  async find(query: any, projection?: string): Promise<IUser[]> {
    return User.find(query, projection).exec();
  }

  async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }

  async findOne(query: any): Promise<IUser | null> {
    return User.findOne(query);
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  async updateOne(query: any, update: any): Promise<IUser | null> {
    return User.findOneAndUpdate(query, update, { new: true }).exec();
  }
}
