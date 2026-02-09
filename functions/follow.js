import { humanLikeMouseMove } from "./utils.js";
import { randomBetween } from "../utils/randomBetween.js"

export async function follow(page, username) {
  await page.goto(`https://www.instagram.com/`, {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForTimeout(randomBetween(200, 600));
  const searchButton = page.locator('a').nth(4);
  await page.waitForTimeout(randomBetween(200, 600));
  await searchButton.click()

  await page.waitForTimeout(randomBetween(200, 600));
  await page.keyboard.type(username, { delay: 1000 });
  await page.waitForTimeout(randomBetween(200, 600));
  const firstUsername = page.locator(`a[href="/${username}/"]`).first()
  await page.waitForTimeout(randomBetween(1000, 1500));
  await firstUsername.click();


  const followButton = page.locator('header').getByRole('button', { name: /^Follow$/ });

  await humanLikeMouseMove(page, followButton);

  await page.waitForTimeout(randomBetween(200, 600));
  await followButton.click();

  const followingButton = page.getByRole('button', { name: 'Following' });
  await followingButton.waitFor({ timeout: 15000 });
}
