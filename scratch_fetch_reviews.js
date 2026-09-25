const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'en-US' });
  await page.goto('https://www.google.com/maps/place/?q=place_id:ChIJoey70K_7DDkRxOXC6zCTN0Y', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(5000);

  // Try to accept any consent dialog
  try {
    const consentBtn = page.locator('button:has-text("Accept all")').first();
    if (await consentBtn.isVisible({ timeout: 3000 })) {
      await consentBtn.click();
      await page.waitForTimeout(1500);
    }
  } catch (e) {}

  await page.screenshot({ path: 'scratch_maps_initial.png' });

  const title = await page.title();
  console.log('Page title:', title);

  // Click the Reviews tab
  const reviewsTab = page.locator('button:has-text("Reviews")').first();
  await reviewsTab.click();
  await page.waitForTimeout(3000);

  // Scroll the reviews panel to load more reviews
  const scrollable = page.locator('div[role="main"]').first();
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(600);
  }

  await page.screenshot({ path: 'scratch_maps_reviews.png', fullPage: false });

  // Extract review text blocks
  const reviewData = await page.evaluate(() => {
    const results = [];
    // Google Maps review cards typically have data-review-id attribute
    const cards = document.querySelectorAll('div[data-review-id]');
    cards.forEach(card => {
      const text = card.innerText;
      results.push(text);
    });
    return results;
  });

  console.log('Found', reviewData.length, 'review cards');
  require('fs').writeFileSync('scratch_reviews_raw.json', JSON.stringify(reviewData, null, 2));

  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });
