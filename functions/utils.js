export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(percent) {
  return Math.random() < percent / 100;
}

export async function humanScroll(page) {
  const scrollAmount = random(2000, 3000);
  await page.mouse.wheel(0, scrollAmount);
  await humanDelay(800, 3000);
}

async function humanDelay(min = 500, max = 2500) {
  await new Promise(r => setTimeout(r, random(min, max)));
}

export async function humanLikeMouseMove(page, target) {
  const box = await target.boundingBox();
  if (!box) return;

  const startX = randomBetween(0, page.viewportSize()?.width || 800);
  const startY = randomBetween(0, page.viewportSize()?.height || 600);

  await page.mouse.move(startX, startY);

  const endX = box.x + box.width / 2 + randomBetween(-5, 5);
  const endY = box.y + box.height / 2 + randomBetween(-5, 5);

  const steps = Math.floor(randomBetween(15, 30));

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const x =
      startX + (endX - startX) * progress + randomBetween(-2, 2);
    const y =
      startY + (endY - startY) * progress + randomBetween(-2, 2);

    await page.mouse.move(x, y);
    await page.waitForTimeout(randomBetween(5, 25));
  }
}
