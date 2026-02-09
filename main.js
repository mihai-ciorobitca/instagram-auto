import { chromium } from 'playwright';
import { reels } from "./functions/reels.js";
import { follow } from "./functions/follow.js";
import { post } from "./functions/post.js"
import { like } from "./functions/like.js"
import { scroll } from "./functions/scroll.js"

async function main() {
  const context = await chromium.launchPersistentContext(
    './ig-profile',
    {
      headless: false,
      slowMo: 50,
      // proxy: {
      //   server: 'http://ip:port',
      //   username: 'proxyUser',
      //   password: 'proxyPass',
      // },
      args: ['--start-maximized'],
      viewport: null,
    }
  );

  const page = await context.newPage();

  // await page.goto(`https://www.instagram.com/`, {
  //   waitUntil: 'domcontentloaded',
  // })

  // await post(page, "Hello world!", "post2.png");
  // await follow(page, "chef_catalin_scarlatescu");
  // await scroll(page);
  await reels(page);
}

await main();
