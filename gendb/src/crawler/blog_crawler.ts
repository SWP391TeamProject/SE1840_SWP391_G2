import puppeteer, {Page} from 'puppeteer';
import axios from 'axios';
import {parseStringPromise} from 'xml2js';

const fs = require('fs');

export interface CrawledPost {
  title: string;
  content: string;
  date: number;
  category: string;
}

async function fetchRSSFeed(page: number): Promise<string> {
  const url = `https://www.fortunaauction.com/feed/?paged=${page}`;
  const response = await axios.get(url);
  return response.data;
}

async function extractPostsFromRSS(rssData: string): Promise<string[]> {
  const parsedData = await parseStringPromise(rssData);
  const items = parsedData.rss.channel[0].item;
  return items.map((item: any) => item.link[0]);
}

async function fetchPostDetails(page: Page, url: string): Promise<CrawledPost> {
  await page.goto(url, {waitUntil: 'networkidle2'});

  return await page.evaluate(() => {
    const category = (document.querySelector("article a[rel='category tag']") as HTMLElement)?.innerText;
    const title = (document.querySelector("article h1.post-title") as HTMLElement)?.innerText;
    const content = (document.querySelector("article .post-content .entry-content") as HTMLElement)?.innerHTML;
    const date = Date.parse((document.querySelector("meta[property='article:published_time']") as HTMLMetaElement)?.content);

    return {
      category,
      title,
      content,
      date: date.valueOf()
    };
  });
}

export async function crawlPosts(): Promise<CrawledPost[]> {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  const result: CrawledPost[] = [];

  const postLinks = [];

  if (fs.existsSync(`./cache/post.links.json`)) {
    postLinks.push(...JSON.parse(fs.readFileSync(`./cache/post.links.json`)));
  } else {
    for (let i = 1; i <= 10; i++) {
      console.log(`Visiting feed: ${i}/10`);
      const rssData = await fetchRSSFeed(i);
      postLinks.push(...await extractPostsFromRSS(rssData));
    }
    fs.writeFile(`./cache/post.links.json`, JSON.stringify(postLinks), (err: any) => {
      if (err) throw err;
    });
  }

  let postId = 0;
  for (const link of postLinks) {
    postId++;
    let postDetails;
    if (fs.existsSync(`./cache/post.${postId}.json`)) {
      postDetails = JSON.parse(fs.readFileSync(`./cache/post.${postId}.json`));
    } else {
      console.log(`Visiting post: ${link} (${postId}/${postLinks.length})`);
      postDetails = await fetchPostDetails(page, link);
      fs.writeFile(`./cache/post.${postId}.json`, JSON.stringify(postDetails), (err: any) => {
        if (err) throw err;
      });
    }

    result.push(postDetails);
  }

  await browser.close();

  return result;
}
