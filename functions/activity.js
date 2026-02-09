export async function activity(page, durationMs = 60_000) {
  const start = Date.now();

  while (Date.now() - start < durationMs) {
    await page.evaluate(async () => {
      const distance = 1000;      // total scroll px
      const duration = 2000;      // ms → increase = slower
      const start = window.scrollY;
      const startTime = performance.now();

      function easeInOut(t) {
        return t < 0.5
          ? 2 * t * t
          : 1 - Math.pow(-2 * t + 2, 2) / 2;
      }

      return new Promise(resolve => {
        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          window.scrollTo(0, start + distance * easeInOut(progress));

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }

        requestAnimationFrame(step);
      });
    });


    await page.waitForTimeout(1000);

  }
}
