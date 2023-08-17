import { PushSubscription } from "web-push";

/**
 * ISO format string that represents specific date and time.
 * For example, `2023-07-20T08:35:00.00Z`
 */
export type DateString = string;

export type Username = string;
export type BadgeCount = number;

export type Constructor<T = any> = new (...args: any[]) => T;

export class Pagination {
  from = 0;
  size = 10000;

  constructor(page?: number, size?: number) {
    if (size) this.size = size;
    if (page) this.from = Math.ceil((Math.max(page, 1) - 1) * this.size);
  }
}

export type StoredPushSubscription = {
  username: string;
  push_subscription_id: string;
  updated: Date;
} & PushSubscription;
