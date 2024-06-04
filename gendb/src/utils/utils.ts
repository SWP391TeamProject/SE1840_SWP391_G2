import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
const currentDate = new Date();

export function addRandomDays(dayOffsetMin: number, dayOffsetMax: number, date?: Date) {
    let newDate = dayjs(date);
    newDate = newDate.add(
        faker.number.int({ min: dayOffsetMin, max: dayOffsetMax }),
        "day"
    );
    newDate = newDate.hour(faker.number.int({ min: 0, max: 23 }))
    newDate = newDate.minute(faker.number.int({ min: 0, max: 59 }))
    newDate = newDate.second(faker.number.int({ min: 0, max: 59 }))
    return newDate.toDate();
}

export function addRandomYears(yearOffsetMin: number, yearOffsetMax: number, date?: Date) {
    return addRandomDays(yearOffsetMin * 365, yearOffsetMax * 365, date);
}

export function addRandomHours(hourOffsetMin: number, hourOffsetMax: number, date?: Date) {
    let newDate = dayjs(date);
    newDate = newDate.add(
        faker.number.int({ min: hourOffsetMin, max: hourOffsetMax }),
        "hour"
    );
    return newDate.toDate();
}