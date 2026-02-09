export async function scroll(page, {
  minScroll = 300,
  maxScroll = 1200,
  minPause = 500,
  maxPause = 3000,
  iterations = 30
} = {}) {
  for (let i = 0; i < iterations; i++) {
    // Random scroll distance
    const scrollBy = Math.floor(
      Math.random() * (maxScroll - minScroll) + minScroll
    );

    await page.evaluate((y) => {
      window.scrollBy({
        top: y,
        left: 0,
        behavior: 'smooth',
      });
    }, scrollBy);

    // Occasionally do a tiny adjustment scroll (very human)
    if (Math.random() < 0.3) {
      await page.waitForTimeout(300 + Math.random() * 400);
      await page.evaluate(() => {
        window.scrollBy({ top: -100, behavior: 'smooth' });
      });
    }

    // Random pause like reading a post
    const pause = Math.floor(
      Math.random() * (maxPause - minPause) + minPause
    );
    await page.waitForTimeout(pause);
  }
}
