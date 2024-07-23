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
import {Bid, BidStatus} from "../model/bid";

export function simulateAuction(members: Account[], items: Item[]): [Transaction[], Bid[], AuctionSession[]] {
    const transactions: Transaction[] = [];
    const bids: Bid[] = [];
    const auctionSessions: AuctionSession[] = [];
    const now = new Date();
    const excludeItems: Set<number> = new Set();
    let transId = 1;
    let bidId = 1;
    let auctionItemId = 1;
    let auctionId = 0;

    for (const auctionSessionTimes of NUMBER_OF_AUCTION.entries()) {
        outer:
          for (let tronTronTronVN = 0; tronTronTronVN < auctionSessionTimes[1]; tronTronTronVN++) {
              auctionId++;
              const status = auctionSessionTimes[0];

              let lastScheduledEndDate: Date = new Date();
              let lastFinishedStartDate: Date = new Date();
              let startDate, endDate: Date;

              switch (status) {
                  case AuctionStatus.SCHEDULED: {
                      startDate = addRandomDays(1, 14, lastScheduledEndDate);
                      endDate = addRandomMinute(MIN_AUCTION_MINUTES, MAX_AUCTION_MINUTES, startDate);
                      lastScheduledEndDate = endDate;
                      break;
                  }
                  case AuctionStatus.PROGRESSING: {
                      startDate = addRandomMinute(-MAX_AUCTION_MINUTES, -MIN_AUCTION_MINUTES, now);
                      endDate = addRandomMinute(MIN_AUCTION_MINUTES, MAX_AUCTION_MINUTES, startDate);
                      break;
                  }
                  case AuctionStatus.FINISHED: {
                      endDate = addRandomDays(-180, -1, lastFinishedStartDate);
                      startDate = addRandomMinute(-MAX_AUCTION_MINUTES, -MIN_AUCTION_MINUTES, endDate);
                      lastFinishedStartDate = startDate;
                      break;
                  }
              }

              const createdDate = addRandomDays(-7, 0, startDate);
              const auctionItems: AuctionItem[] = [];
              const numOfItems = faker.number.int({
                  min: MIN_ITEM_PER_AUCTION,
                  max: MAX_ITEM_PER_AUCTION
              });
              console.log(`Generating auction: ${auctionId}, status: ${status}, items: ${numOfItems}`);

              let participantCounter: Set<number> = new Set();

              for (let j = 0; j < numOfItems; j++) {
                  const item = items.find(i => i.status == ItemStatus.QUEUE &&
                    i.createDate < startDate && !excludeItems.has(i.id));
                  if (item == undefined) {
                      console.log(`> No item available to assign to auction`);
                      continue outer;
                  }
                  item.status = ItemStatus.IN_AUCTION;
                  // do not handle multiple auctions for the same item, im too lazy
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
                  const deposits: Transaction[] = []; // <accountId, deposit>
                  const localBids: Bid[] = [];

                  for (let participant of participants) {
                      participantCounter.add(participant.id);
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
                          auctionItem: null
                      });
                      const deposit = {
                          id: transId++,
                          amount: depositPrice,
                          type: PaymentType.AUCTION_DEPOSIT,
                          status: PaymentStatus.FAILED,
                          accountId: participant.id,
                          createDate: auctionDepositDate,
                          auctionItem: {
                              auctionId: auctionId
                          }
                      };
                      deposits.push(deposit);

                      currentPrice = Math.max(currentPrice, depositPrice);
                  }
                  let bidCount = 0;

                  if (status != AuctionStatus.SCHEDULED) {
                      // bidding
                      let virtualDate = dayjs(startDate);
                      let lastBidder: Account | undefined = undefined;
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
                          lastBidder = participant;
                          const bidIncrease = item.reservePrice * faker.number.float({
                              min: 0.02,
                              max: 0.08
                          });
                          const bidPrice = currentPrice + bidIncrease;
                          localBids.push({
                              accountId: participant.id,
                              amount: bidPrice,
                              auctionItem: {
                                  itemId: item.id,
                                  auctionId: auctionId,
                              },
                              bidId: bidId++,
                              createdDate: virtualDate.toDate(),
                              status: status == AuctionStatus.PROGRESSING ? BidStatus.PENDING : BidStatus.FAILED
                          });
                          currentPrice = Math.max(currentPrice, bidPrice);
                      }
                      console.log(`> Number of bids: ${bidCount}`);

                      if (status == AuctionStatus.FINISHED) {
                          if (faker.number.float() > AUCTION_WIN_CHANCE)
                              item.reservePrice = currentPrice * faker.number.float({min: 1.1, max: 2});
                          console.log(`> Final bid: ${currentPrice}/${item.reservePrice}`);

                          if (currentPrice >= item.reservePrice && lastBidder !== undefined) {
                              item.status = ItemStatus.IN_ORDER;

                              // order
                              const orderDate = virtualDate.add(faker.number.int({
                                  min: 3,
                                  max: 10
                              }), 'minute').toDate()
                              item.orderId = transId;
                              transactions.push({
                                  id: transId++,
                                  amount: currentPrice * 1.045,
                                  type: PaymentType.AUCTION_ORDER,
                                  status: PaymentStatus.PENDING,
                                  accountId: lastBidder.id,
                                  createDate: orderDate,
                                  auctionItem: {
                                      auctionId: auctionId,
                                      itemId: item.id,
                                      soldPrice: currentPrice
                                  },
                                  orderAddress: faker.location.streetAddress({useFullAddress: true})
                              });

                              // set the highest bid to success
                              // set remaining bids to failed
                              localBids.filter(b => b.accountId == lastBidder.id)
                                .forEach(b => b.status = BidStatus.SUCCESS);

                              // set auction deposit of all to success
                              deposits.forEach(d => d.status = PaymentStatus.SUCCESS);
                              console.log(`> Winner: ${lastBidder.id}`);
                          } else {
                              item.status = ItemStatus.QUEUE;
                              console.log(`> No winner`);
                          }
                      }
                  }

                  auctionItems.push({
                      bidCount: bidCount,
                      participantCount: status === AuctionStatus.SCHEDULED ? 0 : participants.length,
                      id: auctionItemId++,
                      itemId: item.id,
                      currentPrice: currentPrice,
                      createDate: createdDate,
                      updateDate: status == AuctionStatus.SCHEDULED ? createdDate :
                        (status == AuctionStatus.PROGRESSING ? new Date() : endDate)
                  });
                  transactions.push(...deposits);
                  bids.push(...localBids);
              }

              auctionSessions.push({
                  id: auctionId,
                  title: "Auction #" + auctionId,
                  description: faker.lorem.lines(),
                  startDate: startDate,
                  endDate: endDate,
                  status: status,
                  createDate: createdDate,
                  updateDate: status == AuctionStatus.SCHEDULED ? createdDate :
                    (status == AuctionStatus.PROGRESSING ? startDate : endDate),
                  imageURLs: auctionItems.map(i => items[i.itemId - 1])
                    .flatMap(i => i.imageURLs)
                    .slice(0, faker.number.int({min: 3, max: 10})),
                  items: auctionItems,
                  participantCount: participantCounter.size
              });
          }
    }

    return [transactions, bids, auctionSessions];
}
