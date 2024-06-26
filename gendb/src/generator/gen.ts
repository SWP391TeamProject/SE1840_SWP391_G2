import fs from "fs";
import {genAccount} from "./gen_account";
import {genItems, prepareItemAndCategory} from "./gen_item";
import {Account, Role} from "../model/account";
import {genConsignment} from "./gen_consignment";
import {simulateAuction} from "./auction_simulator";
import {PaymentType} from "../model/transaction";
import {genNotification} from "./gen_notification";
import {genPosts} from "./gen_blog";

/*
1. account, citizen_card
2. item, item_category -> attachment
3. consignment_detail -> attachment -> consignment
4. payment, bid, deposit, order
5. auction_item,auction_session
---------------------
1. tạo account, citizen card, trừ balance
2. từ các item đã cào, 1 lần pick 1-3 cái tạo consignment detail -> consignment,
   assign user bất kỳ và staff bất kỳ, kèm attachment
3. tạo item đối với consignment đã xong, kèm attachment, assign item vào item category
4. từ item, tạo auction item, assign vào auction session
5. từ auction item tạo deposit, bid cho các ng tham gia, có win thì thêm order
6. assign item vào nhiều auction session nếu ch win
7. update lại balance
*/

export async function generate() {
    // tạo account, trừ balance
    console.log("Generating account...");
    const accountList = genAccount();

    const roleToAccounts = accountList.reduce((map, account) => {
        if (!map[account.role]) {
            map[account.role] = [];
        }
        map[account.role].push(account);
        return map;
    }, {} as Record<Role, Account[]>);

    // tạo category
    console.log("Generating category...");
    const categoryAndRawItems = await prepareItemAndCategory(accountList[0].createDate);
    console.log("Available crawled items:", categoryAndRawItems[1].length);

    // tạo consignment và consignment details
    console.log("Generating consignment...");
    const consignmentList = genConsignment(roleToAccounts, categoryAndRawItems[1]);

    // tạo item
    console.log("Generating items...");
    const items = genItems(consignmentList);

    // tạo auction session, auction item va transaction
    console.log("Simulating auction...");
    const transAndAuction = simulateAuction(accountList.filter(a => a.role == Role.MEMBER), items);

    for (const transaction of transAndAuction[0]) {
        switch (transaction.type) {
            case PaymentType.DEPOSIT:
                break;
            case PaymentType.WITHDRAW:
                accountList[transaction.accountId-1].balance -= transaction.amount;
                break;
            case PaymentType.AUCTION_DEPOSIT:
                accountList[transaction.accountId-1].balance -= transaction.amount;
                break;
            case PaymentType.AUCTION_DEPOSIT_REFUND:
                accountList[transaction.accountId-1].balance += transaction.amount;
                break;
            case PaymentType.AUCTION_ORDER:
                accountList[transaction.accountId-1].balance -= transaction.amount;
                break;
            case PaymentType.CONSIGNMENT_REWARD:
                accountList[transaction.accountId-1].balance += transaction.amount;
                break;
        }
        accountList[transaction.accountId-1].balance += transaction.amount;
    }

    // tạo noti
    const [noti, notiCount] = genNotification(accountList);

    // tạo blog
    const [blogCategory, blogPost] = await genPosts(roleToAccounts);

    fs.writeFile(`./output/account.json`, JSON.stringify(accountList), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${accountList.length} accounts!`);

    fs.writeFile(`./output/item_category.json`, JSON.stringify(categoryAndRawItems[0]), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${categoryAndRawItems[0].length} item categories!`);

    fs.writeFile(`./output/consignment.json`, JSON.stringify(consignmentList), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${consignmentList.length} consignments!`);

    fs.writeFile(`./output/item.json`, JSON.stringify(items), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${items.length} items!`);

    fs.writeFile(`./output/transaction.json`, JSON.stringify(transAndAuction[0]), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${transAndAuction[0].length} transactions!`);

    fs.writeFile(`./output/auction_session.json`, JSON.stringify(transAndAuction[1]), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${transAndAuction[1].length} auction sessions!`);

    fs.writeFile(`./output/notification.json`, JSON.stringify(noti), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${notiCount} notifications!`);

    fs.writeFile(`./output/blog_category.json`, JSON.stringify(blogCategory), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${blogCategory.length} blog categories!`);

    fs.writeFile(`./output/blog_post.json`, JSON.stringify(blogPost), (err) => {
        if (err) throw err;
    });
    console.log(`Generated ${blogPost.length} blog posts!`);
}
