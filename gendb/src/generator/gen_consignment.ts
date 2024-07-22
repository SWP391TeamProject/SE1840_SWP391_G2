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
    ConsignmentDetailType
} from "../model/consignment_detail";
import dayjs from "dayjs";
import {ITEM_MAX_PRICE, ITEM_MIN_PRICE, NUMBER_OF_CONSIGNMENT} from "../config";

const metalNames: string[] = [
    "Gold",
    "Silver",
    "Platinum",
    "Palladium",
    "Titanium",
    "Copper",
    "Bronze",
    "Brass",
    "Iron",
    "Steel",
    "Aluminum",
    "Nickel",
    "Zinc",
    "Chromium",
    "Lead",
    "Tin",
    "Magnesium",
    "Cobalt",
    "Tungsten",
    "Mercury"
];

const colorNames: string[] = [
    'Yellow', 'White', 'Gray', 'Clear', 'Red', 'Green', 'Blue', 'Black',
    'Pink', 'Purple', 'Orange', 'Brown', 'Beige', 'Turquoise', 'Teal',
    'Lavender', 'Maroon', 'Navy', 'Cyan', 'Magenta'
];

const stampedNames: string[] = [
    'Cartier', 'Tiffany & Co.', 'Bvlgari', 'Harry Winston', 'Van Cleef & Arpels',
    'Graff', 'Mikimoto', 'Piaget', 'Boucheron', 'Chopard', 'De Beers', 'David Yurman',
    'Buccellati', 'Fred Leighton', 'Chaumet', 'Dior', 'Rolex', 'Hermès',
    'Gucci', 'Swarovski'
];

const gemstoneNames: string[] = [
    "Amethyst",
    "Emerald",
    "Ruby",
    "Sapphire",
    "Diamond",
    "Opal",
    "Topaz",
    "Turquoise",
    "Garnet",
    "Jade",
    "Aquamarine",
    "Peridot",
    "Citrine",
    "Lapis Lazuli",
    "Moonstone",
    "Onyx",
    "Quartz",
    "Tanzanite",
    "Zircon",
    "Spinel"
];

const itemConditions: string[] = [
    "New",
    "Like New",
    "Very Good",
    "Good",
    "Acceptable",
    "Fair"
];

const initialEvaluationMessages: string[] = [
    "Thank you for entrusting us with your item for valuation. To provide a precise valuation, we require a more in-depth examination. We kindly request that you bring the item to our office for a detailed appraisal. Our experts will conduct a thorough examination to determine its accurate worth. Please contact us to schedule an appointment. Sincerely, [Biddify]",
    "We have conducted a preliminary assessment of your consigned item. To accurately determine its value, a detailed inspection is necessary. We respectfully request that you bring the item to our offices for a thorough appraisal. Our valuation experts will conduct a detailed assessment to determine its fair market value. Please contact us to arrange a convenient time for you to visit. Sincerely, [Biddify]",
    "Thank you for consigning your item with us. To provide you with an accurate valuation, we require a closer inspection. We kindly request that you bring the item to our office for a detailed appraisal. Our experienced valuers will conduct a thorough examination to determine its fair market value. To schedule an appointment, please contact us. Sincerely, [Biddify]",
    "We have conducted a preliminary review of your consigned item. To provide you with a comprehensive valuation, a detailed inspection is necessary. We kindly request that you bring the item to our offices for a thorough appraisal. Our valuation experts will conduct a thorough assessment to determine its fair market value. Please contact us to schedule a convenient time for your visit. Sincerely, [Biddify]",
    "Thank you for choosing our auction house to consign your item. To determine its accurate worth, a more in-depth evaluation is required. We respectfully request that you bring the item to our office for a detailed appraisal. Our valuation team will conduct a thorough examination to provide you with a precise valuation. Please contact us to schedule an appointment. Sincerely, [Biddify]"
];

const acceptedMessages: string[] = [
    "Your evaluation has been approved. Please proceed with the auction listing.",
    "The estimated value is accurate. Please proceed to the next step.",
    "Your assessment is in line with market trends. Well done.",
    "The valuation is acceptable. Please proceed with the auction preparation.",
    "Your evaluation is comprehensive and accurate. Thank you.",
    "I concur with your assessment. Please proceed as planned.",
    "Your valuation aligns with our expectations. Please proceed to listing.",
    "The estimated value is reasonable. Please proceed with the auction.",
    "Your evaluation is spot on. Excellent work.",
    "I approve of your valuation. Please continue with the process."
];

const rejectedMessages: string[] = [
    "Please re-evaluate the item. The estimated value seems too high.",
    "I believe the estimated value needs adjustment. Please reconsider.",
    "Your valuation is inconsistent with market data. Please review.",
    "The estimated value is questionable. Please provide supporting evidence.",
    "I cannot approve the valuation. Please re-assess.",
    "There seems to be an error in the valuation. Please check again.",
    "The estimated value is significantly below market average. Please revise.",
    "Your evaluation requires further analysis. Please provide additional details.",
    "I cannot accept the current valuation. Please re-evaluate.",
    "The estimated value is not justified. Please provide a more accurate figure."
];

const staffToManagerMessages: string[] = [
    "I have completed the evaluation for the consigned item.",
    "An evaluation of the consigned item has been finalized.",
    "The valuation process for the item is complete.",
    "The item has undergone a thorough evaluation.",
    "I have submitted the valuation for your review.",
    "The estimated value for the consigned item is ready for your approval.",
    "A detailed evaluation of the item is attached for your consideration.",
    "Please review the attached valuation report.",
    "The valuation for the item is complete and awaiting your review.",
    "I have finalized the valuation and request your approval."
];

function generateUniqueHexString(length: number): string {
    const chars = '0123456789abcdef';
    let hexString = '';
    while (hexString.length < length) {
        hexString += chars[Math.floor(Math.random() * chars.length)];
    }
    return hexString;
}

export function genConsignment(roleToAccounts: Record<Role, Account[]>, items: CrawledItem[]): Consignment[] {
    items = items
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    const consignmentList: Consignment[] = [];
    let itemIndex = 0;
    const secretCodeSet = new Set();

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
        const staffId = faker.helpers.arrayElement(roleToAccounts.STAFF).id;
        const managerId = faker.helpers.arrayElement(roleToAccounts.MANAGER).id;
        let status: ConsignmentStatus = ConsignmentStatus.WAITING_STAFF;
        let secretCode: string | undefined = undefined;

        if (status == ConsignmentStatus.WAITING_STAFF && faker.number.float() < 0.95) {
            status = ConsignmentStatus.IN_INITIAL_EVALUATION;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
            details.push({
                accountId: staffId,
                consignmentId: i + 1,
                type: ConsignmentDetailType.INITIAL_EVALUATION,
                description: faker.helpers.arrayElement(initialEvaluationMessages),
                price: faker.number.int({ min: ITEM_MIN_PRICE, max: ITEM_MAX_PRICE }),
                imageURLs: [],
                createDate: updateDate.toDate(),
                updateDate: updateDate.toDate()
            });
        }

        if (status == ConsignmentStatus.IN_INITIAL_EVALUATION && faker.number.float() < 0.95) {
            let code: string;
            do {
                code = generateUniqueHexString(9);
            } while (secretCodeSet.has(code));
            secretCodeSet.add(code);
            secretCode = code;
            status = ConsignmentStatus.SENDING;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
        }

        if (status == ConsignmentStatus.SENDING && faker.number.float() < 0.95) {
            status = ConsignmentStatus.IN_FINAL_EVALUATION;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
            details.push({
                accountId: staffId,
                consignmentId: i + 1,
                type: ConsignmentDetailType.FINAL_EVALUATION,
                description: faker.helpers.arrayElement(staffToManagerMessages),
                price: faker.number.int({ min: ITEM_MIN_PRICE, max: ITEM_MAX_PRICE }),
                imageURLs: [],
                createDate: updateDate.toDate(),
                updateDate: updateDate.toDate()
            });
        }

        if (status == ConsignmentStatus.IN_FINAL_EVALUATION && faker.number.float() < 0.95) {
            // chance to reject final evaluation
            if (faker.number.float() < 0.2) {
                updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
                details.push({
                    accountId: managerId,
                    consignmentId: i + 1,
                    type: ConsignmentDetailType.MANAGER_REJECTED,
                    description: faker.helpers.arrayElement(rejectedMessages),
                    price: faker.number.int({ min: ITEM_MIN_PRICE, max: ITEM_MAX_PRICE }),
                    imageURLs: [],
                    createDate: updateDate.toDate(),
                    updateDate: updateDate.toDate()
                });
                updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
                details.push({
                    accountId: staffId,
                    consignmentId: i + 1,
                    type: ConsignmentDetailType.FINAL_EVALUATION,
                    description: faker.helpers.arrayElement(staffToManagerMessages),
                    price: faker.number.int({ min: ITEM_MIN_PRICE, max: ITEM_MAX_PRICE }),
                    imageURLs: [],
                    createDate: updateDate.toDate(),
                    updateDate: updateDate.toDate()
                });
            }

            status = ConsignmentStatus.WAITING_SELLER;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
            details.push({
                accountId: managerId,
                consignmentId: i + 1,
                type: ConsignmentDetailType.MANAGER_ACCEPTED,
                description: faker.helpers.arrayElement(acceptedMessages),
                price: faker.number.int({ min: ITEM_MIN_PRICE, max: ITEM_MAX_PRICE }),
                imageURLs: [],
                createDate: updateDate.toDate(),
                updateDate: updateDate.toDate()
            });
        }

        if (status == ConsignmentStatus.WAITING_SELLER && faker.number.float() < 0.95) {
            status = faker.number.float() < 0.95 ? ConsignmentStatus.TO_ITEM : ConsignmentStatus.TERMINATED;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
        }

        if (status == ConsignmentStatus.TO_ITEM && faker.number.float() < 0.95) {
            status = ConsignmentStatus.FINISHED;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
        }

        consignmentList.push({
            __name: crawledItem.name,
            __categoryId: crawledItem.categoryId,
            id: i + 1,
            userId: sender.id,
            staffId: staffId,
            status: status,
            stamped: faker.helpers.arrayElement(stampedNames),
            color: faker.helpers.arrayElement(colorNames),
            description: crawledItem.description,
            metal: faker.helpers.arrayElement(metalNames),
            measurement: `${faker.number.int({ min: 50, max: 500 })} x ${faker.number.int({ min: 50, max: 500 })} mm`,
            weight: faker.number.int({ min: 5, max: 300 }),
            condition: faker.helpers.arrayElement(itemConditions),
            gemstone: faker.helpers.arrayElement(gemstoneNames),
            secretCode: secretCode,
            imageURLs: crawledItem.imageUrls,
            preferContact: faker.helpers.enumValue(ContactPreference),
            contactEmail: faker.number.float() < 0.5 ? faker.internet.email() : sender.email,
            contactName: faker.number.float() < 0.5 ? faker.person.fullName() : sender.nickname,
            contactPhone: faker.number.float() < 0.5 ? "0" + faker.string.numeric(9) : sender.phone,
            createDate: sendDate.toDate(),
            updateDate: updateDate.toDate(),
            details
        })
    }

    return consignmentList;
}