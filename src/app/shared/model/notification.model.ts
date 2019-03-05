import { fromNow } from "../date.util";

export interface NotificationResponse {
  dateTime: string;
  message: string;
  read: false;
}

export class Notification {
  dateTime: string;
  message: string;
  read: false;

  static fromResponse(response: NotificationResponse): Notification {
    const notification = new Notification();

    notification.dateTime = fromNow(response.dateTime);
    notification.message = response.message;
    notification.read = response.read;

    return notification;
  }
}
