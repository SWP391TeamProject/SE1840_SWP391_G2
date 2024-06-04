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

export async function prepareItemAndCategory(baseDate: Date): Promise<[ItemCategory[], CrawledItem[]]> {
    const categories = JSON.parse(
        fs.readFileSync(`./data/item_category.json`, 'utf8')
    ) as { id: number, name: string }[];

    const categoryList: ItemCategory[] = [];
    const itemList: CrawledItem[] = [];

    for (let i = 0; i < categories.length; i++){
        const categoryCache = categories[i];
        const categoryCreateDate = dayjs(baseDate).add(
            faker.number.int({ min: 5, max: 24 }),
            "hour"
        ).toDate();
        const category = {
            id: i + 1,
            name: categoryCache.name,
            createDate: categoryCreateDate,
            updateDate: categoryCreateDate
        };

        await scrapeItems(categoryCache.name.toLowerCase())
        const crawledItems = await scrapeItemDetails(categoryCache.name.toLowerCase(), category.id)

        categoryList.push(category)
        itemList.push(...crawledItems)
    }

    return [categoryList, itemList]
}

export function genItems(consignments: Consignment[]): Item[] {
    const availableConsignments = consignments
        .filter(d => d.status == ConsignmentStatus.FINISHED);
    const items: Item[] = [];

    for (let i = 0; i < availableConsignments.length; i++){
        const cd = availableConsignments[i];
        const date = addRandomDays(3, 60, cd.createDate);
        const detail = cd.details[cd.details.length - 1];

        items.push({
            id: i + 1,
            categoryId: cd.__categoryId,
            name: cd.__name,
            description: detail.description,
            reservePrice: detail.price, // giá sàn
            buyInPrice: detail.price * faker.number.int({ min: 10, max: 100 }), // gia mua đứt
            status: ItemStatus.QUEUE, // generate later
            imageURLs: detail.imageUrls,
            createDate: date,
            updateDate: date,
            ownerId: cd.senderId, // generate later
            orderId: undefined // generate later
        })
    }

    return items
}