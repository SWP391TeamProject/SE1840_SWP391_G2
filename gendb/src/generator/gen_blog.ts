import {crawlPosts} from "../crawler/blog_crawler";
import {Account, Role} from "../model/account";
import {BlogCategory} from "../model/blog_category";
import {BlogPost} from "../model/blog_post";
import {faker} from "@faker-js/faker";

export async function genPosts(acc: Record<Role, Account[]>): Promise<[BlogCategory[], BlogPost[]]> {
  const accounts: number[] = [];
  acc[Role.MANAGER].forEach(account => accounts.push(account.id));
  acc[Role.STAFF].forEach(account => accounts.push(account.id));
  const crawledPosts = await crawlPosts();
  const categoryList = new Map<string, number>();
  const categories: BlogCategory[] = [];
  const posts: BlogPost[] = [];
  crawledPosts.sort(function (a, b) {
    return a.date - b.date;
  });
  for (let post of crawledPosts) {
    if (!categoryList.has(post.category)) {
      categoryList.set(post.category, categories.length + 1);
      categories.push({
        id: categories.length + 1,
        name: post.category,
        date: new Date(post.date)
      });
    }
    posts.push({
      id: posts.length + 1,
      authorId: faker.helpers.arrayElement(accounts),
      categoryId: categoryList.get(post.category) ?? 0,
      title: post.title,
      content: post.content,
      date: new Date(post.date)
    });
    const ct = categories[categories.length - 1];
    ct.date = new Date(Math.min(ct.date.valueOf(), post.date.valueOf()));
  }
  return [categories, posts];
}