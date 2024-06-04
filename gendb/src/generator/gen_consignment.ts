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
import {NUMBER_OF_CONSIGNMENT} from "../config";

export function genConsignment(roleToAccounts: Record<Role, Account[]>, items: CrawledItem[]): Consignment[] {
    const consignmentList: Consignment[] = [];
    let itemIndex = 0;

    for (let i = 0; i < NUMBER_OF_CONSIGNMENT; i++) {
        if (itemIndex == items.length)
            break;
        const crawledItem = items[itemIndex++];
        const sender = faker.helpers.arrayElement(roleToAccounts.MEMBER);
        const sendDate = dayjs(sender.createDate).add(
            faker.number.int({ min: 10, max: 300 }),
            "minute"
        );
        let updateDate = sendDate;
        const details: ConsignmentDetail[] = [];

        let status: ConsignmentStatus = ConsignmentStatus.WAITING_STAFF;
        details.push({
            consignmentId: i + 1,
            status: ConsignmentDetailStatus.REQUEST,
            description: crawledItem.description,
            price: faker.number.int({ min: 10000, max: 1000000 }),
            imageUrls: crawledItem.imageUrls,
            createDate: updateDate.toDate(),
            updateDate: updateDate.toDate()
        });

        if (status == ConsignmentStatus.WAITING_STAFF && faker.number.float() < 0.9) {
            status = ConsignmentStatus.IN_INITIAL_EVALUATION;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
            details.push({
                consignmentId: i + 1,
                status: ConsignmentDetailStatus.INITIAL_EVALUATION,
                description: crawledItem.description,
                price: faker.number.int({ min: 10000, max: 1000000 }),
                imageUrls: crawledItem.imageUrls,
                createDate: updateDate.toDate(),
                updateDate: updateDate.toDate()
            });
        }

        if (status == ConsignmentStatus.IN_INITIAL_EVALUATION && faker.number.float() < 0.9) {
            status = ConsignmentStatus.SENDING;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
        }

        if (status == ConsignmentStatus.SENDING && faker.number.float() < 0.9) {
            status = ConsignmentStatus.IN_FINAL_EVALUATION;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
            details.push({
                consignmentId: i + 1,
                status: ConsignmentDetailStatus.FINAL_EVALUATION,
                description: crawledItem.description,
                price: faker.number.int({ min: 10000, max: 1000000 }),
                imageUrls: crawledItem.imageUrls,
                createDate: updateDate.toDate(),
                updateDate: updateDate.toDate()
            });
        }

        if (status == ConsignmentStatus.IN_FINAL_EVALUATION && faker.number.float() < 0.9) {
            const res = faker.number.float() < 0.9 ? ConsignmentDetailStatus.MANAGER_ACCEPTED : ConsignmentDetailStatus.MANAGER_REJECTED;
            status = res == ConsignmentDetailStatus.MANAGER_ACCEPTED ? ConsignmentStatus.FINISHED : ConsignmentStatus.TERMINATED;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
            details.push({
                consignmentId: i + 1,
                status: res,
                description: crawledItem.description,
                price: faker.number.int({ min: 10000, max: 1000000 }),
                imageUrls: crawledItem.imageUrls,
                createDate: updateDate.toDate(),
                updateDate: updateDate.toDate()
            });
        }

        consignmentList.push({
            __name: crawledItem.name,
            __categoryId: crawledItem.categoryId,
            id: i + 1,
            senderId: sender.id,
            status: status,
            preferContact: faker.helpers.enumValue(ContactPreference),
            staffId: faker.helpers.arrayElement(roleToAccounts.STAFF).id,
            createDate: sendDate.toDate(),
            updateDate: updateDate.toDate(),
            details
        })
    }

    return consignmentList;
}