import { humanLikeMouseMove, randomTime, humanType } from "./utils.mjs";

export async function follow(page, username) {
  await page.waitForTimeout(randomTime(1000, 2000));
  const searchButton = page.locator('a').nth(4);
  await page.waitForTimeout(randomTime(1000, 2000));
  await searchButton.click()

  const searchInput = page.locator('input[placeholder="Search"]');
  await page.waitForTimeout(randomTime(1000, 2000));
  await humanType(searchInput, username);

  await page.waitForTimeout(randomTime(1000, 2000));
  const firstUsername = page.locator(`a[href="/${username}/"]`).first()
  await page.waitForTimeout(randomTime(1000, 2000));
  await firstUsername.click();

  const followButton = page.locator('header').getByRole('button', { name: /^Follow$/ });
  await humanLikeMouseMove(page, followButton);

  await page.waitForTimeout(randomTime(1000, 2000));
  await followButton.click();

  const followingButton = page.getByRole('button', { name: 'Following' });
  await followingButton.waitFor({ timeout: 10000 });
}
