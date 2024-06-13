import {faker} from '@faker-js/faker';
import fs from "fs";
import {scrapeItems} from "../crawler/item_crawler";
import {scrapeItemDetails} from "../crawler/item_detail_crawler";
import {ItemCategory} from "../model/item_category";
import {CrawledItem} from "../model/crawled_item";
import dayjs from "dayjs";
import {Item, ItemStatus} from "../model/item";
import {addRandomDays} from "../utils/utils";
import {Consignment, ConsignmentStatus} from "../model/consignment";
import {Account} from "../model/account";
import {
    NOTIFICATION_PER_ACCOUNT_MAX,
    NOTIFICATION_PER_ACCOUNT_MIN
} from "../config";

export function genNotification(acc: Account[]): [{
    notification: string[],
    distribution: any
}, number] {
    const notification = JSON.parse(
        fs.readFileSync(`./data/notification.json`, 'utf8')
    ) as string[];

    const distribution = new Map<number, number[]>();
    let notiCount = 0;

    for (let account of acc) {
        const n = faker.number.int({
            min: NOTIFICATION_PER_ACCOUNT_MIN,
            max: NOTIFICATION_PER_ACCOUNT_MAX
        });
        const notificationList: number[] = [];
        for (let i = 0; i < n; i++) {
            const index = faker.number.int({ min: 0, max: notification.length - 1 });
            notificationList.push(index);
            notiCount++;
        }
        distribution.set(account.id, notificationList);
    }

    return [{
        notification,
        distribution: Object.fromEntries(distribution.entries())
    }, notiCount]
}