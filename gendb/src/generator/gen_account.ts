import {faker} from '@faker-js/faker';
import {addRandomYears} from '../utils/utils';
import {CitizenCard} from "../model/citizen_card";
import {Account, Role} from "../model/account";
import {
    ACCOUNT_AGE_MAX,
    ACCOUNT_AGE_MIN,
    HAS_CITIZEN_CARD,
    NUMBER_OF_ACCOUNT,
    NUMBER_OF_ADMIN,
    NUMBER_OF_MANAGER,
    NUMBER_OF_STAFF,
    OLDEST_ACCOUNT_CREATE_YEAR
} from "../config";

export function genAccount(): Account[] {
    const accounts: Account[] = [];

    for(let i = 0; i < NUMBER_OF_ACCOUNT; i++) {
        let role: Role;
        if (i < NUMBER_OF_ADMIN) {
            role = Role.ADMIN;
        } else if (i >= NUMBER_OF_ADMIN && i < NUMBER_OF_ADMIN + NUMBER_OF_MANAGER) {
            role = Role.MANAGER;
        } else if (i >= NUMBER_OF_ADMIN + NUMBER_OF_MANAGER && i < NUMBER_OF_ADMIN + NUMBER_OF_MANAGER + NUMBER_OF_STAFF) {
            role = Role.STAFF;
        } else {
            role = Role.MEMBER;
        }
        const accountCreateDate = addRandomYears(-OLDEST_ACCOUNT_CREATE_YEAR, 0);
        const sex = faker.person.sexType()
        const fullName = faker.person.fullName({sex: sex})

        const citizenCard: CitizenCard | null = faker.number.float() < HAS_CITIZEN_CARD ? null : {
            cardId: faker.string.numeric({
                length: 12,
                allowLeadingZeros: true
            }),
            birthday: addRandomYears(-ACCOUNT_AGE_MAX, -ACCOUNT_AGE_MIN),
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
            status: role == Role.MEMBER ? (faker.number.float() < 0.2 ? "DISABLED" : "ACTIVE") : "ACTIVE",
            balance: 0, // generate later
            citizenCard: citizenCard,
            createDate: accountCreateDate,
            updateDate: accountCreateDate
        };

        accounts.push(account);
    }

    return accounts;
}
