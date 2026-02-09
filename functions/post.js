import { randomBetween } from "../utils/randomBetween.js"

export async function post(page, captionText) {
    await page.goto(`https://www.instagram.com/`, {
        waitUntil: 'domcontentloaded',
    });

    await page.waitForTimeout(randomBetween(200, 600));
    const createButton = page.locator('a').nth(7);
    await page.waitForTimeout(randomBetween(200, 600));
    await createButton.click()

    await page.waitForTimeout(randomBetween(1000, 1500));
    const postButton = page.locator('a').nth(8);
    await page.waitForTimeout(randomBetween(200, 600));
    await postButton.click()

    await page.waitForTimeout(randomBetween(200, 600));
    await page.setInputFiles("input[type='file']", "posts/post.png");
    await page.waitForTimeout(randomBetween(200, 600));

    const nextButton = page.getByRole('button', { name: 'Next' })
    await page.waitForTimeout(randomBetween(2000, 6000));
    nextButton.click();
    await page.waitForTimeout(randomBetween(2000, 6000));
    nextButton.click();

    const caption = page.locator('[contenteditable="true"]').first();
    await caption.click();
    await caption.type(captionText, { delay: 1000 });

    const shareButton = page.getByRole('button', { name: 'Share' })
    await page.waitForTimeout(randomBetween(2000, 6000));
    shareButton.click();

    await page.getByText('Your post has been shared.').waitFor();
    await page.waitForTimeout(randomBetween(2000, 6000));
    await page.screenshot({ path: 'posted/post-success.png', fullPage: false });
}
