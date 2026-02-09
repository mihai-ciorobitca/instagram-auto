export async function comment(page) {
  const commentBtn = page.locator('svg[aria-label="Comment"]').first();
  if (await commentBtn.count() === 0) return;

  await commentBtn.click();
  await humanDelay(1500, 3000);

  const input = page.locator('textarea[aria-label="Add a comment…"]');
  if (await input.count() === 0) return;

  await input.click();
  await humanDelay(500, 1200);

  const text = comments[random(0, comments.length - 1)];
  await page.keyboard.type(text, { delay: random(50, 120) });
  await humanDelay(800, 1500);

  await page.keyboard.press('Enter');
  console.log('💬 Commented:', text);
  await humanDelay(2000, 4000);
}