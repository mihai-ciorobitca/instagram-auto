import { chromium } from 'playwright';
import { scroll } from "./functions/scroll.js";
// import { follow } from "./functions/follow.js";
// import { post } from "./functions/post.js"
// import { like } from "./functions/like.js"

async function main(username, captionText) {
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

  await page.goto(`https://www.instagram.com/`, {
    waitUntil: 'domcontentloaded',
  })

  await scroll();

  // await post(page, captionText);
  // await follow(page, username);

  // await page.waitForTimeout(3000);

  // await page.screenshot({ path: `./followed/${username}.png` });

  // await page.close();
  // await context.close();
}

await main("brockman.ben", "Caption");
