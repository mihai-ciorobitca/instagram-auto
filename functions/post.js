import { randomTime, humanType } from "./utils.js"

export async function post(page, captionText, imageName="post") {
    await page.waitForTimeout(randomTime(1000, 2000));
    const createButton = page.locator('a').nth(7);
    await page.waitForTimeout(randomTime(1000, 2000));
    await createButton.click()

    await page.waitForTimeout(randomTime(1000, 2000));
    const postButton = page.locator('a').nth(8);
    await page.waitForTimeout(randomTime(1000, 2000));
    await postButton.click()

    await page.waitForTimeout(randomTime(1000, 2000));
    await page.setInputFiles("input[type='file']", `posts/${imageName}.png`);
    await page.waitForTimeout(randomTime(1000, 2000));

    const nextButton = page.getByRole('button', { name: 'Next' })
    await page.waitForTimeout(randomTime(1000, 2000));
    nextButton.click();
    await page.waitForTimeout(randomTime(1000, 2000));
    nextButton.click();

    const caption = page.locator('[contenteditable="true"]').first();
    await caption.click();
    await humanType(caption, captionText);

    const shareButton = page.getByRole('button', { name: 'Share' })
    await page.waitForTimeout(randomTime(1000, 2000));
    shareButton.click();

    await page.getByText('Your post has been shared.').waitFor();
    await page.waitForTimeout(randomTime(2000, 3000));
    await page.screenshot({ path: `posted/${imageName}-success.png`, fullPage: false });
}
