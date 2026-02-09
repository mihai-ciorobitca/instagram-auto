export async function reels(page) {
    await page.goto("https://www.instagram.com/reels/", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
    });

    await page.waitForTimeout(5000);
    await page.click("body");

    let iteration = 0;

    while (true) {
        iteration++;

        await page.waitForSelector("video", { timeout: 10000 });

        const info = await page.evaluate(() => {
            const video = document.querySelector("video");

            if (!video) {
                return { hasVideo: false };
            }

            const duration = video.duration;

            if (!duration || isNaN(duration) || duration === Infinity) {
                return {
                    hasVideo: true,
                    hasDuration: false,
                    paused: video.paused,
                    currentTime: video.currentTime,
                };
            }

            const min = duration * 0.5;
            const max = duration * 1.0;
            const watchSeconds = Math.random() * (max - min) + min;

            return {
                hasVideo: true,
                hasDuration: true,
                duration,
                watchSeconds,
                watchMs: watchSeconds * 1000,
                paused: video.paused,
                currentTime: video.currentTime,
            };
        });

        console.log(`\n🔁 Reel #${iteration}`);

        if (!info.hasVideo) {
            console.log("❌ No video found, fallback wait 3s");
            await page.waitForTimeout(3000);
            continue;
        }

        if (!info.hasDuration) {
            const fallback =
                Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;

            console.log(
                `⚠️ Duration unavailable | paused=${info.paused} | ` +
                `currentTime=${info.currentTime?.toFixed(2)}s | ` +
                `waiting ${fallback}ms`
            );

            await page.waitForTimeout(fallback);
        } else {
            console.log(
                `🎞 Duration: ${info.duration.toFixed(2)}s | ` +
                `Watching: ${info.watchSeconds.toFixed(2)}s | ` +
                `paused=${info.paused}`
            );

            await page.waitForTimeout(info.watchMs);
        }

        console.log("⬇️ Next reel");
        await page.keyboard.press("ArrowDown");

        // Small human-like buffer
        const buffer =
            Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
        await page.waitForTimeout(buffer);
    }
}
