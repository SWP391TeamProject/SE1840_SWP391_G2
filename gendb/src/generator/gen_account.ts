import {faker, tr} from '@faker-js/faker';
import {addRandomYears} from '../utils/utils';
import {CitizenCard} from "../model/citizen_card";
import {Account, Role} from "../model/account";
import {PaymentType, Transaction} from "../model/transaction";

export function genAccount(): Account[] {
    const accounts: Account[] = [];

    for(let i = 0; i < 1000; i++) {
        let role: Role;
        if (i === 0) {
            role = Role.ADMIN;
        } else if (i >= 1 && i <= 3) {
            role = Role.MANAGER;
        } else if (i >= 4 && i <= 8) {
            role = Role.STAFF;
        } else {
            role = Role.MEMBER;
        }
        const accountCreateDate = addRandomYears(-3, 0);
        const sex = faker.person.sexType()
        const fullName = faker.person.fullName({sex: sex})

        const citizenCard: CitizenCard | null = faker.number.float() < 0.5 ? null : {
            cardId: faker.string.numeric({
                length: 12,
                allowLeadingZeros: true
            }),
            birthday: addRandomYears(-50, -20),
            address: faker.location.streetAddress(true),
            city: faker.location.city(),
            fullName: fullName,
            gender: sex === "male",
            createDate: accountCreateDate,
            updateDate: accountCreateDate
        }

        const account: Account = {
            id: i + 1,
            nickname: faker.number.float() < 0.2 ? faker.person.fullName() : fullName,
            role: role,
            email: faker.internet.email(),
            phone: "0" + faker.string.numeric(9),
            password: faker.internet.password({ length: 20 }),
            status: faker.helpers.arrayElement(["ACTIVE", "DISABLED"]),
            balance: 0, // generate later
            citizenCard: citizenCard,
            createDate: accountCreateDate,
            updateDate: accountCreateDate
        };

        accounts.push(account);
    }

    return accounts;
}

export function updateBalance(accountList: Account[], transactions: Transaction[]) {
    for (const transaction of transactions) {
        switch (transaction.type) {
            case PaymentType.DEPOSIT:
                accountList[transaction.accountId-1].balance += transaction.amount;
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
        }
    }
}
