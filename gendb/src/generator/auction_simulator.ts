import {PaymentStatus, PaymentType, Transaction} from "../model/transaction";
import {AuctionSession, AuctionStatus} from "../model/auction_session";
import {Account} from "../model/account";
import {addRandomDays, addRandomHours} from "../utils/utils";
import {Item, ItemStatus} from "../model/item";
import {AuctionItem} from "../model/auction_item";
import {faker} from "@faker-js/faker";
import dayjs from "dayjs";

export function simulateAuction(members: Account[], items: Item[]): [Transaction[], AuctionSession[]] {
    const transactions: Transaction[] = [];
    const auctionSessions: AuctionSession[] = [];
    const now = new Date();
    const excludeItems: Set<number> = new Set();
    let transId = 1;
    let auctionItemId = 1;

    outer:
        for (let i = 0; i < 100; i++) {
            const auctionId = i + 1;
            console.log("Generating auction: " + auctionId);
            const startDate = addRandomDays(-365, 100);
            const endDate = addRandomHours(1, 3, startDate);
            const createdDate = addRandomDays(-90, -3, startDate);
            const status = now < startDate
                ? AuctionStatus.SCHEDULED
                : now > endDate
                    ? AuctionStatus.FINISHED
                    : AuctionStatus.PROGRESSING;
            console.log(`Start at ${startDate}, end at ${endDate}, status: ${status}`);
            const auctionItems: AuctionItem[] = [];

            const numOfItems = faker.number.int({ min: 3, max: 5 });
            console.log(`Number of items: ${numOfItems}`);

            for (let j = 0; j < numOfItems; j++) {
                const item = items.find(i => i.status == ItemStatus.QUEUE &&
                    i.createDate < startDate
                    && !excludeItems.has(i.id));
                if (item == undefined)
                    continue outer;
                item.status = ItemStatus.IN_AUCTION;
                excludeItems.add(item.id);

                let currentPrice = 0;

                const numOfParticipants = faker.number.int({min: 10, max: 30});
                const participants: Account[] = members.filter(m =>
                    m.createDate < dayjs(startDate).subtract(3, 'day').toDate())
                    .slice(0, numOfParticipants);
                console.log(`Item ${item.id}, number of participants: ${numOfParticipants}`);
                const deposits: Map<number, number> = new Map();

                for (let participant of participants) {
                    const depositPrice = item.reservePrice * faker.number.float({
                        min: 0.01,
                        max: 0.1
                    });

                    // deposit
                    const auctionDepositDate = addRandomHours(-72, -1, startDate);
                    const depositDate = addRandomHours(-3, -1, auctionDepositDate);
                    transactions.push({
                        id: transId++,
                        amount: depositPrice,
                        type: PaymentType.DEPOSIT,
                        status: PaymentStatus.SUCCESS,
                        accountId: participant.id,
                        createDate: depositDate,
                        auctionItem: {
                            itemId: item.id,
                            auctionId: auctionId,
                        }
                    });
                    transactions.push({
                        id: transId++,
                        amount: depositPrice,
                        type: PaymentType.AUCTION_DEPOSIT,
                        status: PaymentStatus.SUCCESS,
                        accountId: participant.id,
                        createDate: auctionDepositDate,
                        auctionItem: {
                            itemId: item.id,
                            auctionId: auctionId,
                        }
                    });
                    deposits.set(participant.id, depositPrice);

                    currentPrice = Math.max(currentPrice, depositPrice);
                }

                if (status != AuctionStatus.SCHEDULED) {
                    // bidding
                    let virtualDate = dayjs(startDate);
                    let lastParticipant: Account | undefined = undefined;
                    let bidCount = 0;

                    while (virtualDate.valueOf() < endDate.getTime()) {
                        bidCount++;
                        virtualDate = virtualDate.add(faker.number.int({
                            min: 15,
                            max: 60
                        }), 'second');
                        const participant = faker.helpers.arrayElement(participants);
                        lastParticipant = participant;
                        const bidIncrease = item.reservePrice * faker.number.float({
                            min: 0.01,
                            max: 0.05
                        });
                        const bidPrice = currentPrice + bidIncrease;
                        transactions.push({
                            id: transId++,
                            amount: bidPrice,
                            type: PaymentType.AUCTION_BID,
                            status: PaymentStatus.SUCCESS,
                            accountId: participant.id,
                            createDate: virtualDate.toDate(),
                            auctionItem: {
                                itemId: item.id,
                                auctionId: auctionId,
                            }
                        });
                        currentPrice = Math.max(currentPrice, bidPrice);
                    }
                    console.log(`- Number of bids: ${bidCount}`);

                    if (status == AuctionStatus.FINISHED) {
                        if (currentPrice >= item.reservePrice && lastParticipant !== undefined) {
                            item.status = ItemStatus.SOLD;

                            // order
                            const orderDate = virtualDate.add(faker.number.int({
                                min: 1,
                                max: 36
                            }), 'hour').toDate()
                            transactions.push({
                                id: transId++,
                                amount: currentPrice,
                                type: PaymentType.DEPOSIT,
                                status: PaymentStatus.SUCCESS,
                                accountId: lastParticipant.id,
                                createDate: orderDate,
                                auctionItem: null
                            });
                            transactions.push({
                                id: transId++,
                                amount: currentPrice,
                                type: PaymentType.AUCTION_ORDER,
                                status: PaymentStatus.SUCCESS,
                                accountId: lastParticipant.id,
                                createDate: orderDate,
                                auctionItem: {
                                    itemId: item.id,
                                    auctionId: auctionId,
                                }
                            });

                            // refund
                            for (let entry of deposits.entries()) {
                                if (entry[0] == lastParticipant.id)
                                    continue;
                                transactions.push({
                                    id: transId++,
                                    amount: entry[1],
                                    type: PaymentType.AUCTION_DEPOSIT_REFUND,
                                    status: PaymentStatus.SUCCESS,
                                    accountId: entry[0],
                                    createDate: virtualDate.toDate(),
                                    auctionItem: {
                                        itemId: item.id,
                                        auctionId: auctionId,
                                    }
                                });
                            }
                            console.log(`- Winner: ${lastParticipant.id}`);
                        } else {
                            item.status = ItemStatus.UNSOLD;
                        }
                    }
                }

                auctionItems.push({
                    id: auctionItemId + 1,
                    item_id: item.id,
                    current_price: currentPrice,
                    create_date: createdDate,
                    update_date: status == AuctionStatus.SCHEDULED ? createdDate :
                        (status == AuctionStatus.PROGRESSING ? new Date() : endDate)
                });
            }

            auctionSessions.push({
                id: auctionId,
                title: "Auction #" + auctionId,
                startDate: startDate,
                endDate: endDate,
                status: status,
                createDate: createdDate,
                updateDate: status == AuctionStatus.SCHEDULED ? createdDate :
                    (status == AuctionStatus.PROGRESSING ? startDate : endDate),
                imageURLs: auctionItems.map(i => items[i.item_id-1])
                    .flatMap(i => i.imageURLs)
                    .slice(0, faker.number.int({ min: 3, max: 10 })),
                items: auctionItems
            });
        }


    return [transactions, auctionSessions];
}
