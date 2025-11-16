import { Request as ExpressRequest } from 'express';
import {
  Controller,
  Get,
  Route,
  Security,
  Tags,
  Request,
  Put,
  Response,
  Path,
} from 'tsoa';
import { NotificationDto } from '../dtos/notification.dto';
import { AuthenticatedRequest } from '../types/auth';
import { NotificationService } from '../services/notification.service';

@Route('notifications')
@Tags('Notifications')
@Security('jwt')
export class NotificationsController extends Controller {
  private notificationService = new NotificationService();

  @Get('/')
  public async getNotifications(
    @Request() req: ExpressRequest
  ): Promise<NotificationDto[]> {
    const authenticatedUser = (req as AuthenticatedRequest).user;

    if (!authenticatedUser) {
      throw { status: 401, message: 'User not authenticated.' };
    }

    const userId = authenticatedUser?.id;

    return this.notificationService.getNotificationsForUser(userId);
  }

  @Put('{id}/read')
  @Response(404, 'Notification not found')
  public async markAsRead(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<NotificationDto> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;

    if (!authenticatedUserId)
      throw { status: 401, message: 'User not authenticated.' };

    const notification = await this.notificationService.markNotificationAsRead(
      id
    );

    if (!notification)
      throw { status: 404, message: 'Notification not found.' };

    return notification;
  }

  @Put('/read-all')
  @Response(401, 'User not authenticated')
  public async readAll(@Request() req: ExpressRequest): Promise<void> {
    const authenticatedUserId = (req as AuthenticatedRequest).user?.id;

    if (!authenticatedUserId) {
      throw { status: 401, message: 'User not authenticated.' };
    }

    await this.notificationService.markAllNotificationsAsRead(
      authenticatedUserId
    );
  }
}
