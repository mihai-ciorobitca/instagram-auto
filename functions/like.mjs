export async function like(page) {
    const likeButton = page.locator('svg[aria-label="Like"]').first();
    if (await likeButton.count() > 0) {
        await likeButton.click();
        await humanDelay(1000, 3000);
    }
}



