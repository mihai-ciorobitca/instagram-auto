export function randomTime(minMs = 300, maxMs = 1200) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

export async function humanType(locator, text, minDelay = 200, maxDelay = 250) {
  for (const char of text) {
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await locator.type(char, { delay });
  }
}

export async function humanLikeMouseMove(page, target) {
  const box = await target.boundingBox();
  if (!box) return;

  const startX = randomTime(0, page.viewportSize()?.width || 800);
  const startY = randomTime(0, page.viewportSize()?.height || 600);

  await page.mouse.move(startX, startY);

  const endX = box.x + box.width / 2 + randomTime(-5, 5);
  const endY = box.y + box.height / 2 + randomTime(-5, 5);

  const steps = Math.floor(randomTime(15, 30));

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const x =
      startX + (endX - startX) * progress + randomTime(-2, 2);
    const y =
      startY + (endY - startY) * progress + randomTime(-2, 2);

    await page.mouse.move(x, y);
    await page.waitForTimeout(randomTime(5, 25));
  }
}

export async function maybeLikeArticle(article, chance = 0.7) {
  if (Math.random() > chance) return;

  const likeButton = await article.$(
    'div[role="button"] svg[aria-label="Like"]'
  );

  if (!likeButton) return;

  const button = await likeButton.evaluateHandle(
    svg => svg.closest('div[role="button"]')
  );

  if (!button) return;

  await wait(randomTime(300, 1000));
  await button.click();

  console.log("❤️ Liked post");
}

export async function humanAdvanceCarousel(article, maxTimeMs = 15000) {
  const startTime = Date.now();
  let lastDirection = "next";

  while (Date.now() - startTime < maxTimeMs) {
    const nextBtn = await article.$('button[aria-label="Next"]');
    const backBtn = await article.$('button[aria-label="Go back"]');

    if (!nextBtn && !backBtn) break;

    let direction;

    if (nextBtn && backBtn) {
      direction =
        Math.random() < 0.65
          ? lastDirection
          : lastDirection === "next"
            ? "back"
            : "next";
    } else {
      direction = nextBtn ? "next" : "back";
    }

    const btn = direction === "next" ? nextBtn : backBtn;
    if (!btn) break;

    await wait(randomTime(500, 1200));
    await btn.click();

    lastDirection = direction;

    if (Math.random() < 0.25) {
      await wait(randomTime(1200, 2500));
    }

    if (Math.random() < 0.15) break;
  }

  console.log("🖼️ Carousel interaction ended");
}

export async function getArticleDelay(article) {
  const buttons = await article.$$('div[role="button"]');
  const buttonDiv = buttons[2];

  if (!buttonDiv) return 700;

  if (await buttonDiv.$('video, iframe')) {
    console.log("🎥 Video detected in article.");
    return 8000;
  }

  if (await buttonDiv.$('img')) {
    console.log("🖼️ Image detected in article.");
    return 3000;
  }

  return 700;
}

export async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function smoothScrollTo(page, targetY, duration = 1200) {
  const startY = await page.evaluate(() => window.scrollY);
  const distance = targetY - startY;
  const steps = Math.floor(duration / 50);

  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const eased =
      progress < 0.5
        ? 4 * progress ** 3
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    await page.evaluate(
      y => window.scrollTo(0, y),
      startY + distance * eased
    );

    await wait(50);
  }
}

export async function getNextUntouchedArticle(page, id) {
    return await page.evaluateHandle((id) => {
        const article = Array.from(document.querySelectorAll('article'))
            .find(el => !el.dataset.pwId);

        if (!article) return null;

        article.dataset.pwId = String(id);
        return article;
    }, id);
}

