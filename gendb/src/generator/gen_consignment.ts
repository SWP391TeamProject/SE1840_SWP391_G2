import {CrawledItem} from "../model/crawled_item";
import {Account, Role} from "../model/account";
import {faker} from "@faker-js/faker";
import {
    Consignment,
    ConsignmentStatus,
    ContactPreference
} from "../model/consignment";
import {
    ConsignmentDetail,
    ConsignmentDetailStatus
} from "../model/consignment_detail";
import dayjs from "dayjs";

export function genConsignment(roleToAccounts: Record<Role, Account[]>, items: CrawledItem[]): [Consignment[], ConsignmentDetail[]] {
    const consignmentList: Consignment[] = [];
    const consignmentDetailList: ConsignmentDetail[] = [];
    let itemIndex = 0;
    let detailId = 1;

    outer:
    for (let i = 0; i < items.length; i++) {
        const numOfDetails = faker.number.int({ min: 1, max: 3 });
        let detailStatus: ConsignmentDetailStatus[] = [];
        const sender = faker.helpers.arrayElement(roleToAccounts.MEMBER);
        const sendDate = dayjs(sender.createDate).add(
            faker.number.int({ min: 10, max: 300 }),
            "minute"
        ).toDate();

        for (let j = 0; j < numOfDetails; j++) {
            let status =  faker.helpers.enumValue(ConsignmentDetailStatus);
            status = faker.number.float() < 0.9 ? ConsignmentDetailStatus.FINISHED : status;
            if (itemIndex == items.length)
                break outer;
            const crawledItem = items[itemIndex++];

            consignmentDetailList.push({
                consignmentId: i + 1,
                __categoryId: crawledItem.categoryId,
                id: detailId++,
                __name: crawledItem.name,
                status: status,
                description: crawledItem.description,
                price: faker.number.int({ min: 10000, max: 1000000 }),
                imageUrls: crawledItem.imageUrls,
                createDate: sendDate,
                updateDate: sendDate
            });
            detailStatus.push(status);
        }

        let status: ConsignmentStatus = detailStatus.every(s => s === ConsignmentDetailStatus.FINISHED)
            ? ConsignmentStatus.FINISHED
            : detailStatus.some(s => s === ConsignmentDetailStatus.TERMINATED)
                ? ConsignmentStatus.TERMINATED
                : ConsignmentStatus.EVALUATING;

        consignmentList.push({
            id: i + 1,
            senderId: sender.id,
            status: status,
            preferContact: faker.helpers.enumValue(ContactPreference),
            staffId: faker.helpers.arrayElement(roleToAccounts.STAFF).id,
            createDate: sendDate,
            updateDate: sendDate
        })
    }

    return [consignmentList, consignmentDetailList];
}