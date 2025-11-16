import { Notification, INotification } from '../models/Notification';

export class NotificationRepository {
  async findByRecipient(
    userId: string,
    options: { sort?: any; limit?: number } = {}
  ): Promise<INotification[]> {
    let query = Notification.find({ recipient: userId }).populate(
      'sender',
      'profilePicture username'
    );

    if (options.sort) query = query.sort(options.sort);
    if (options.limit) query = query.limit(options.limit);

    return query.exec();
  }

  async findOneByRecipient(query: any): Promise<INotification | null> {
    return Notification.findOne(query)
      .populate('sender', 'profilePicture username')
      .exec();
  }

  async create(data: Partial<INotification>): Promise<INotification> {
    const notification = new Notification(data);
    await notification.save();

    await notification.populate('sender', 'profilePicture username');
    return notification;
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    ).exec();
  }

  async deleteById(notificationId: string): Promise<INotification | null> {
    return Notification.findByIdAndDelete(notificationId).exec();
  }

  async deleteAllByRecipient(userId: string): Promise<void> {
    await Notification.deleteMany({ recipient: userId }).exec();
  }

  async deleteOne(query: any): Promise<void> {
    await Notification.deleteOne(query).exec();
  }
}
