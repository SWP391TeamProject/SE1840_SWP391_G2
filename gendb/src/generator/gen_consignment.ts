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

const requestReceivedMessages: string[] = [
    "Thank you for submitting your jewelry consignment request. We have received it and will begin our review shortly.",
    "Your jewelry consignment request has been received. Our team will conduct an initial assessment and provide an estimation shortly.",
    "We acknowledge receipt of your jewelry consignment request. A preliminary evaluation is underway.",
    "Your jewelry consignment request has been received. We will promptly review and provide an initial valuation.",
    "We have received your jewelry consignment request and will perform an initial assessment for valuation purposes.",
    "Thank you for your submission. Our team has received your jewelry consignment request and will assess its value.",
    "Your jewelry consignment request has been received. We will conduct a quick review and provide an initial estimation shortly.",
    "We confirm the receipt of your jewelry consignment request. Our team will review and estimate its value.",
    "Thank you for submitting your jewelry consignment request. We will review and provide an initial assessment promptly.",
    "Your jewelry consignment request is acknowledged. Our team will perform an initial assessment and provide an estimation.",
    "We have received your jewelry consignment request and will assess its worth. An initial estimation will follow shortly.",
    "Thank you for your submission. We have received your jewelry consignment request and will assess its value.",
    "Your jewelry consignment request has been received. Our team will perform an initial evaluation and provide an estimation.",
    "We acknowledge receipt of your jewelry consignment request. Our team will conduct an initial assessment.",
    "Your jewelry consignment request has been received. We will review and estimate its value accordingly.",
    "We confirm receipt of your jewelry consignment request. Our initial review and estimation process is now underway.",
    "Thank you for your submission. We have received your jewelry consignment request and will evaluate its worth.",
    "Your jewelry consignment request has been received. We will conduct an initial review and provide an estimation.",
    "We have received your jewelry consignment request and will proceed with an initial evaluation and estimation.",
    "Thank you for submitting your jewelry consignment request. We will assess its value and provide an initial estimation."
];

const itemReceivedMessages: string[] = [
    "We have received the delivery of your jewelry item for consignment. Our team will conduct a thorough review and provide a final estimation shortly.",
    "Your jewelry item has been delivered to us for consignment. We will proceed with a detailed assessment and provide a final valuation.",
    "We acknowledge receipt of your jewelry item for consignment. A formal review will be conducted, and a final estimation will be provided.",
    "Your jewelry item has been received. Our team will perform a comprehensive review and provide the final valuation.",
    "We confirm receipt of your jewelry item for consignment. A detailed assessment will be carried out, and the final valuation will be provided.",
    "Thank you for delivering your jewelry item for consignment. Our team will conduct a thorough assessment and provide a final estimation.",
    "Your jewelry item has been delivered for consignment. We will conduct a formal review and provide the final estimation of its value.",
    "We have received your jewelry item for consignment. A concise review will be conducted, and the final valuation will be communicated.",
    "Your jewelry item has been received. We will conduct a formal review and provide the final estimation of its consignment value.",
    "We confirm receipt of your jewelry item for consignment. Our team will conduct a thorough review and provide the final valuation shortly.",
    "Thank you for delivering your jewelry item for consignment. A formal review will be conducted, and the final estimation will follow.",
    "Your jewelry item has been received. We will conduct a detailed review and provide the final estimation of its consignment value.",
    "We have received your jewelry item for consignment. A formal assessment will be conducted, and the final valuation will be communicated.",
    "Your jewelry item has been delivered for consignment. Our team will conduct a detailed assessment and provide the final valuation shortly.",
    "We acknowledge receipt of your jewelry item for consignment. A thorough review will be conducted, and the final estimation will be provided.",
    "Your jewelry item has been received. We will conduct a formal review and provide the final estimation of its consignment value shortly.",
    "We have received your jewelry item for consignment. A formal assessment will be conducted, and the final valuation will be communicated shortly.",
    "Your jewelry item has been delivered for consignment. We will proceed with a detailed review and provide the final valuation.",
    "We confirm receipt of your jewelry item for consignment. A thorough assessment will be conducted, and the final valuation will be provided shortly.",
    "Thank you for delivering your jewelry item for consignment. We will conduct a formal review and provide the final estimation of its value."
];

const requestAcceptMessages: string[] = [
    "We are pleased to inform you that your jewelry has been accepted for consignment.",
    "Your jewelry has successfully passed our verification and valuation process.",
    "Congratulations! Your jewelry meets our standards for consignment.",
    "We are delighted to accept your jewelry into our upcoming auction.",
    "After careful consideration, we have accepted your jewelry for consignment.",
    "Your jewelry has been approved for consignment at our auction.",
    "We are happy to accept your jewelry for auction consignment.",
    "Your jewelry has met all necessary requirements for consignment.",
    "We have reviewed and accepted your jewelry for our auction catalog.",
    "We have decided to include your jewelry in our upcoming auction.",
    "Your jewelry has been accepted based on our evaluation criteria.",
    "Congratulations, your jewelry is now part of our consignment auction.",
    "We are pleased to announce that your jewelry has been selected for consignment.",
    "Your jewelry has passed our assessment and is accepted for consignment.",
    "We have accepted your jewelry submission for our auction event.",
    "Your jewelry has been approved for consignment sale.",
    "We are happy to inform you that your jewelry is accepted for auction consignment.",
    "Your jewelry has been chosen for consignment based on our evaluation.",
    "Your jewelry has been accepted into our auction consignment program.",
    "Congratulations, your jewelry has been approved for auction consignment."
];

const requestDeclineMessages: string[] = [
    "We regret to inform you that your jewelry does not meet our consignment criteria.",
    "Unfortunately, your jewelry did not pass our verification and valuation process.",
    "We have decided not to accept your jewelry for consignment at this time.",
    "Upon review, we have determined that your jewelry does not meet our auction standards.",
    "We must decline your request to consign your jewelry based on our assessment.",
    "Regrettably, your jewelry does not meet our consignment requirements.",
    "We are unable to accept your jewelry for consignment at this time.",
    "After careful consideration, we cannot proceed with consigning your jewelry.",
    "Unfortunately, your jewelry does not align with our auction consignment criteria.",
    "We regret to inform you that your jewelry does not qualify for consignment.",
    "Based on our evaluation, we cannot accept your jewelry for consignment.",
    "We have reviewed your jewelry and have decided not to proceed with consignment.",
    "Your jewelry does not meet the necessary criteria for consignment at this time.",
    "We regret that we are unable to accept your jewelry for our auction consignment.",
    "We have carefully assessed your jewelry and unfortunately cannot accept it for consignment.",
    "We must decline your request to consign your jewelry for our upcoming auction.",
    "Unfortunately, your jewelry submission for consignment has been declined.",
    "We have carefully reviewed your jewelry and regret to inform you that we cannot accept it for consignment.",
    "We have considered your jewelry for consignment and regret to inform you that it does not meet our requirements.",
    "We appreciate your submission, but we cannot accept your jewelry for our auction consignment program."
];

export function genConsignment(roleToAccounts: Record<Role, Account[]>, items: CrawledItem[]): Consignment[] {
    items = items
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
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
                description: faker.helpers.arrayElement(requestReceivedMessages),
                price: faker.number.int({ min: ITEM_MIN_PRICE, max: ITEM_MAX_PRICE }),
                imageURLs: [],
                createDate: updateDate.toDate(),
                updateDate: updateDate.toDate()
            });
        }

        if (status == ConsignmentStatus.IN_INITIAL_EVALUATION && faker.number.float() < 0.95) {
            secretCode = faker.string.numeric({length: 6});
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
                description: faker.helpers.arrayElement(itemReceivedMessages),
                price: faker.number.int({ min: ITEM_MIN_PRICE, max: ITEM_MAX_PRICE }),
                imageURLs: [],
                createDate: updateDate.toDate(),
                updateDate: updateDate.toDate()
            });
        }

        if (status == ConsignmentStatus.IN_FINAL_EVALUATION && faker.number.float() < 0.95) {
            const type = faker.number.float() < 0.95 ?
              ConsignmentDetailType.MANAGER_ACCEPTED : ConsignmentDetailType.MANAGER_REJECTED;
            status = ConsignmentStatus.WAITING_SELLER;
            updateDate = updateDate.add(faker.number.int({ min: 10, max: 600 }), "minute");
            details.push({
                accountId: managerId,
                consignmentId: i + 1,
                type: type,
                description: faker.helpers.arrayElement(
                  type == ConsignmentDetailType.MANAGER_ACCEPTED ?
                    requestAcceptMessages : requestDeclineMessages),
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