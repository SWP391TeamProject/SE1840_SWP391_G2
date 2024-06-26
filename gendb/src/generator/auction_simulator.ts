import {PaymentStatus, PaymentType, Transaction} from "../model/transaction";
import {AuctionSession, AuctionStatus} from "../model/auction_session";
import {Account} from "../model/account";
import {addRandomDays, addRandomHours, addRandomMinute} from "../utils/utils";
import {Item, ItemStatus} from "../model/item";
import {AuctionItem} from "../model/auction_item";
import {faker} from "@faker-js/faker";
import dayjs from "dayjs";
import {
    AUCTION_WIN_CHANCE,
    MAX_AUCTION_MINUTES,
    MAX_BID_TIME_INCREMENT,
    MAX_ITEM_PER_AUCTION,
    MAX_PARTICIPANT,
    MIN_AUCTION_MINUTES,
    MIN_BID_TIME_INCREMENT,
    MIN_ITEM_PER_AUCTION,
    MIN_PARTICIPANT,
    NUMBER_OF_AUCTION
} from "../config";

export function simulateAuction(members: Account[], items: Item[]): [Transaction[], AuctionSession[]] {
    const transactions: Transaction[] = [];
    const auctionSessions: AuctionSession[] = [];
    const now = new Date();
    const excludeItems: Set<number> = new Set();
    let transId = 1;
    let auctionItemId = 1;
    let auctionId = 0;

    for (const auctionSessionTimes of NUMBER_OF_AUCTION.entries()) {
        outer:
          for (let tronTronTronVN = 0; tronTronTronVN < auctionSessionTimes[1]; tronTronTronVN++) {
              auctionId++;
              const status = auctionSessionTimes[0];

              let startDate, endDate: Date;

              switch (status) {
                  case AuctionStatus.SCHEDULED: {
                      startDate = addRandomDays(1, 90);
                      endDate = addRandomMinute(MIN_AUCTION_MINUTES, MAX_AUCTION_MINUTES, startDate);
                      break;
                  }
                  case AuctionStatus.PROGRESSING: {
                      startDate = addRandomMinute(-MAX_AUCTION_MINUTES, -MIN_AUCTION_MINUTES, now);
                      endDate = addRandomMinute(MIN_AUCTION_MINUTES, MAX_AUCTION_MINUTES, startDate);
                      break;
                  }
                  case AuctionStatus.FINISHED: {
                      endDate = addRandomDays(-365, -1);
                      startDate = addRandomMinute(-MAX_AUCTION_MINUTES, -MIN_AUCTION_MINUTES, endDate);
                      break;
                  }
              }

              const createdDate = addRandomDays(-90, -3, startDate);
              const auctionItems: AuctionItem[] = [];
              const numOfItems = faker.number.int({
                  min: MIN_ITEM_PER_AUCTION,
                  max: MAX_ITEM_PER_AUCTION
              });
              console.log(`Generating auction: ${auctionId}, status: ${status}, items: ${numOfItems}`);

              for (let j = 0; j < numOfItems; j++) {
                  const item = items.find(i => i.status == ItemStatus.QUEUE &&
                    i.createDate < startDate
                    && !excludeItems.has(i.id));
                  if (item == undefined) {
                      console.log(`> No item available to assign to auction`);
                      continue outer;
                  }
                  item.status = ItemStatus.IN_AUCTION;
                  excludeItems.add(item.id);

                  let currentPrice = 0;

                  const numOfParticipants = faker.number.int({
                      min: MIN_PARTICIPANT,
                      max: MAX_PARTICIPANT
                  });
                  const participants: Account[] = members.filter(m =>
                    m.createDate < dayjs(startDate).subtract(3, 'day').toDate())
                    .slice(0, numOfParticipants);
                  console.log(`- Item ${item.id}, number of participants: ${numOfParticipants}`);
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
                      const maxVirtualDate = status == AuctionStatus.FINISHED ? endDate.getTime() :
                        Math.min(endDate.getTime(), now.getTime());

                      while (virtualDate.valueOf() < maxVirtualDate) {
                          bidCount++;
                          virtualDate = virtualDate.add(faker.number.int({
                              min: MIN_BID_TIME_INCREMENT,
                              max: MAX_BID_TIME_INCREMENT
                          }), 'second');
                          if (virtualDate.valueOf() > maxVirtualDate)
                              virtualDate = dayjs(new Date(maxVirtualDate));
                          const participant = faker.helpers.arrayElement(participants);
                          lastParticipant = participant;
                          const bidIncrease = item.reservePrice * faker.number.float({
                              min: 0.02,
                              max: 0.08
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
                      console.log(`> Number of bids: ${bidCount}`);

                      if (status == AuctionStatus.FINISHED) {
                          if (faker.number.float() > AUCTION_WIN_CHANCE)
                              item.reservePrice = currentPrice * faker.number.float({min: 1.1, max: 2});
                          console.log(`> Final bid: ${currentPrice}/${item.reservePrice}`);

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
                              item.orderId = transId;
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
                              if (item.ownerId !== undefined) {
                                  transactions.push({
                                      id: transId++,
                                      amount: currentPrice,
                                      type: PaymentType.CONSIGNMENT_REWARD,
                                      status: PaymentStatus.SUCCESS,
                                      accountId: item.ownerId,
                                      createDate: orderDate,
                                      auctionItem: {
                                          itemId: item.id,
                                          auctionId: auctionId,
                                      }
                                  });
                              }

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
                              console.log(`> Winner: ${lastParticipant.id}`);
                          } else {
                              item.status = ItemStatus.UNSOLD;
                              console.log(`> No winner`);
                          }
                      }
                  }

                  auctionItems.push({
                      id: auctionItemId++,
                      itemId: item.id,
                      currentPrice: currentPrice,
                      createDate: createdDate,
                      updateDate: status == AuctionStatus.SCHEDULED ? createdDate :
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
                  imageURLs: auctionItems.map(i => items[i.itemId - 1])
                    .flatMap(i => i.imageURLs)
                    .slice(0, faker.number.int({min: 3, max: 10})),
                  items: auctionItems
              });
          }
    }

    return [transactions, auctionSessions];
}
