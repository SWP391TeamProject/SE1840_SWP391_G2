import puppeteer from 'puppeteer';
import {CrawledItem} from "../model/crawled_item";

const fs = require('fs');

export async function scrapeItemDetails(category: string, categoryId: number): Promise<CrawledItem[]> {
    if (fs.existsSync(`./cache/item_details.${category}.json`))
        return JSON.parse(fs.readFileSync(`./cache/item_details.${category}.json`, 'utf8'));

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const itemIds = JSON.parse(fs.readFileSync(`./cache/item_ids.${category}.json`, 'utf8'));
    const itemDetails: CrawledItem[] = [];

    fs.readdir('./cache', (err: any, files: string[]) => {
        if (err) {
            console.error('Error reading cache directory:', err);
            return;
        }

        const prefix = `item_detail.${category}.`;
        const suffix = '.json';
        const prefixLength = prefix.length;
        const suffixLength = suffix.length;

        const detailFiles = files.filter(file => file.startsWith(prefix) && file.endsWith(suffix));

        detailFiles.forEach(file => {
            const id = file.substring(prefixLength, file.length - suffixLength);

            if (!itemIds.includes(id)) {
                console.log(`File with non-existent ID: ${file}`);
                process.exit(1);
            }
        });
    });

    let i = 0;
    for (const id of itemIds) {
        i++;
        if (fs.existsSync(`./cache/item_detail.${category}.${id}.json`)) {
            console.log(`Skipping page ${id} ${((i / itemIds.length) * 100).toFixed(2)}%`);
            itemDetails.push(JSON.parse(fs.readFileSync(`./cache/item_detail.${category}.${id}.json`)))
            continue
        }
        const url = `https://www.jewelry-auctioned.com/products/${id}`;
        console.log(`Visiting item ${url} of category ${category} ${((i / itemIds.length) * 100).toFixed(2)}%`);
        try {
            await page.goto(url, {waitUntil: 'networkidle0', timeout: 120000});

            await page.waitForSelector("body > div.min-h-screen.font-sans.antialiased.bg-gray-50 > div > main > div > div > div.flex.flex-col.gap-4.w-full > div.flex.flex-col-reverse.md\\:flex-row.gap-4 > div.w-full.md\\:w-2\\/3.space-y-4.flex.flex-col > div.hidden.md\\:flex.flex-col > div:nth-child(2) > div.bg-white.rounded-b-md > div > div", {timeout: 5000});

            const description = await page.$eval("body > div.min-h-screen.font-sans.antialiased.bg-gray-50 > div > main > div > div > div.flex.flex-col.gap-4.w-full > div.flex.flex-col-reverse.md\\:flex-row.gap-4 > div.w-full.md\\:w-2\\/3.space-y-4.flex.flex-col > div.hidden.md\\:flex.flex-col > div:nth-child(2) > div.bg-white.rounded-b-md > div > div", el => el.innerHTML);
            const name = await page.title();

            const imageUrls = await page.$$eval("body > div.min-h-screen.font-sans.antialiased.bg-gray-50 > div > main > div > div > div.flex.flex-col.gap-4.w-full > div.flex.flex-col-reverse.md\\:flex-row.gap-4 > div.w-full.md\\:w-2\\/3.space-y-4.flex.flex-col > div.w-full.flex.items-center.justify-center.gallery.hidden.md\\:flex > div > div:nth-child(2) > div > div", elements => {
                return elements.map(element => {
                    const style = element.style.backgroundImage;
                    return style.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                });
            });

            const details: CrawledItem = {
                categoryId,
                name,
                description,
                imageUrls
            };

            fs.writeFile(`./cache/item_detail.${category}.${id}.json`, JSON.stringify(details), (err: any) => {
                if (err) throw err;
            });

            itemDetails.push(details);

            console.log(`Scraped details for item ${id}`);
        } catch (e) {
            console.log(e);
        }
    }

    fs.writeFile(`./cache/item_details.${category}.json`, JSON.stringify(itemDetails), (err: any) => {
        if (err) throw err;
    });

    await browser.close();

    return itemDetails;
}