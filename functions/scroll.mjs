import {
    smoothScrollTo,
    getArticleDelay,
    maybeLikeArticle,
    humanAdvanceCarousel,
    wait,
    getNextUntouchedArticle
} from './utils.mjs';

export async function scroll(page) {
    const scrollDuration = 1200;
    let id = 1;

    while (true) {
        const articleHandle = await getNextUntouchedArticle(page, id);

        if (!articleHandle) {
            // No new articles yet → wait a bit and retry
            await wait(500);
            continue;
        }

        id++;

        const rect = await articleHandle.evaluate(el => {
            const r = el.getBoundingClientRect();
            return { top: r.top, height: r.height };
        });

        const scrollY = await page.evaluate(() => window.scrollY);
        const viewportHeight = await page.evaluate(() => window.innerHeight);

        const targetY =
            scrollY +
            rect.top +
            rect.height / 2 -
            viewportHeight / 2;

        await smoothScrollTo(page, targetY, scrollDuration);

        const contentDelay = await getArticleDelay(articleHandle);

        await wait(scrollDuration + contentDelay);
        await maybeLikeArticle(articleHandle, 0.7);
        await humanAdvanceCarousel(articleHandle);
        await wait(contentDelay);
    }
}
