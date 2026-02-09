function maybeLikeArticle(article, chance = 0.7) {
  // roll the dice 🎲
  if (Math.random() > chance) return;

  const likeButton = article.querySelector(
    'div[role="button"] svg[aria-label="Like"]'
  )?.closest('div[role="button"]');

  if (!likeButton) return;

  // small human-like delay before liking
  setTimeout(() => {
    likeButton.click();
    console.log("❤️ Liked post");
  }, 300 + Math.random() * 700);
}

async function humanAdvanceCarousel(article, maxTimeMs = 15000) {
  const startTime = performance.now();

  const rand = (min, max) =>
    min + Math.random() * (max - min);

  const wait = ms =>
    new Promise(r => setTimeout(r, ms));

  let lastDirection = "next";

  while (performance.now() - startTime < maxTimeMs) {
    const nextBtn = article.querySelector(
      'button[aria-label="Next"]'
    );
    const backBtn = article.querySelector(
      'button[aria-label="Go back"]'
    );

    if (!nextBtn && !backBtn) break;

    // decide direction
    let direction;

    if (nextBtn && backBtn) {
      // bias toward continuing, but allow reversal
      direction =
        Math.random() < 0.65
          ? lastDirection
          : lastDirection === "next"
            ? "back"
            : "next";
    } else {
      direction = nextBtn ? "next" : "back";
    }

    const btn =
      direction === "next" ? nextBtn : backBtn;

    if (!btn) break;

    // human hesitation
    await wait(rand(500, 1200));

    btn.click();
    lastDirection = direction;

    // occasional pause like “looking at image”
    if (Math.random() < 0.25) {
      await wait(rand(1200, 2500));
    }

    // small chance to stop early
    if (Math.random() < 0.15) break;
  }

  console.log("🖼️ Carousel interaction ended");
}



function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function getArticleDelay(article) {
  console.log(article)
  const buttonDiv = article.querySelectorAll('div[role="button"]')[2];
  if (!buttonDiv) return 700; // text-only default

  // video detection
  if (
    buttonDiv.querySelector('video, iframe')
  ) {
    console.log("Video detected in article.");
    return 8000; // stay MUCH longer for video
  }

  // image detection
  if (
    console.log("Image detected in article."),
    buttonDiv.querySelector('img')
  ) {
    return 3000; // medium time for images
  }

  return 700; // fallback
}

async function autoScrollArticles(scrollDuration = 1200) {
  let currentArticle = document.querySelector("article");
  if (!currentArticle) return;

  while (true) {
    const articles = [...document.querySelectorAll("article")];
    const index = articles.indexOf(currentArticle);
    const nextArticle = articles[index + 1];

    if (!nextArticle) break;

    const rect = nextArticle.getBoundingClientRect();
    const targetY =
      window.scrollY +
      rect.top +
      rect.height / 2 -
      window.innerHeight / 2;

    smoothScrollTo(targetY, scrollDuration);

    currentArticle = nextArticle;

    const contentDelay = getArticleDelay(nextArticle);

    // wait for scroll + content-specific reading time
    await new Promise(r =>
      setTimeout(r, scrollDuration + contentDelay)
    );

    // after scroll finishes
    await new Promise(r => setTimeout(r, scrollDuration));

    // ❤️ like ~70% of posts
    maybeLikeArticle(nextArticle, 0.7);

    // 🖼️ advance carousel images (if any)
    await humanAdvanceCarousel(nextArticle, 0.7);

    // wait for reading time
    await new Promise(r => setTimeout(r, contentDelay));

  }
}

autoScrollArticles();
