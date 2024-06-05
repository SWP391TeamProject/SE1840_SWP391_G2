import puppeteer from 'puppeteer';

const fs = require('fs');

export async function scrapeItems(category: string) {
    if (fs.existsSync(`./cache/item_ids.${category}.json`))
        return

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const maxPages = 10;
    const baseUrl = `https://www.jewelry-auctioned.com/auctions/${category}?sortby=ja.auctions_newest&page=`;
    const allIds: Set<number> = new Set<number>();

    for (let i = 1; i <= maxPages; i++) {
        if (fs.existsSync(`./cache/item_ids.${category}.${i}.json`)) {
            console.log(`Skipping page ${i}/${maxPages} of category ${category}`);
            for (let n of JSON.parse(fs.readFileSync(`./cache/item_ids.${category}.${i}.json`)) as number[])
                allIds.add(n)
            continue
        }

        const url = `${baseUrl}${i}`;
        console.log(`Visiting page: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });

        page.on('error', err=> {
            console.log('error happen at the page: ', err);
        });

        page.on('pageerror', pageerr=> {
            console.log('pageerror occurred: ', pageerr);
        })

        const ids = await page.evaluate(() => {
            const elements = document.querySelectorAll('[x-data]');
            const ids: any = [];

            elements.forEach(element => {
                const xDataValue = element.getAttribute('x-data');
                if (xDataValue) {
                    const match = /"id"\s*:\s*(\d+)/.exec(xDataValue);
                    if (match) {
                        ids.push(match[1]);
                    }
                }
            });

            return ids;
        });

        fs.writeFile(`./cache/item_ids.${category}.${i}.json`, JSON.stringify(ids), (err: any) => {
            if (err) throw err;
        });

        console.log(`Page ${i} has ${ids.length} IDs`);

        for (let n of ids)
            allIds.add(n);

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await browser.close();

    console.log(`Total ${allIds.size} IDs`);

    fs.writeFile(`./cache/item_ids.${category}.json`, JSON.stringify(Array.from(allIds)), (err: any) => {
        if (err) throw err;
    });
}
