import {faker} from '@faker-js/faker';
import fs from "fs";
import {scrapeItems} from "../crawler/item_crawler";
import {scrapeItemDetails} from "../crawler/item_detail_crawler";
import {ItemCategory} from "../model/item_category";
import {CrawledItem} from "../model/crawled_item";
import dayjs from "dayjs";
import {
    ConsignmentDetail,
    ConsignmentDetailStatus
} from "../model/consignment_detail";
import {Item, ItemStatus} from "../model/item";
import {addRandomDays} from "../utils/utils";

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

export function genItems(consignmentDetails: ConsignmentDetail[]): Item[] {
    const finishedConsignmentDetails = consignmentDetails
        .filter(d => d.status == ConsignmentDetailStatus.FINISHED);
    const items: Item[] = [];

    for (let i = 0; i < finishedConsignmentDetails.length; i++){
        const cd = finishedConsignmentDetails[i];
        const date = addRandomDays(3, 60, cd.createDate);

        items.push({
            id: i + 1,
            categoryId: cd.__categoryId,
            name: cd.__name,
            description: cd.description,
            reservePrice: cd.price, // giá sàn
            buyInPrice: cd.price * faker.number.int({ min: 10, max: 100 }), // gia mua đứt
            status: ItemStatus.QUEUE, // generate later
            imageURLs: cd.imageUrls,
            createDate: date,
            updateDate: date,
            ownerId: cd.__senderId, // generate later
            orderId: undefined // generate later
        })
    }

    return items
}