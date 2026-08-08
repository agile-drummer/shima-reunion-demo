const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('再発行リンクからマイページへ戻れる', async ({ page }) => {
  await page.goto('/organizer/recovery/');
  await page.getByRole('button', { name: '再発行リンクを作る' }).click();
  const href = await page.locator('#demo-recovery-open').getAttribute('href');
  await page.goto(href);
  await page.getByRole('button', { name: '自分のマイページを開く' }).click();
  await expect(page).toHaveURL(/#my-page$/);
  await expect(page.locator('#my-page')).toBeVisible();
  await expect(page.locator('#demo-current-intent')).toContainText('参加したい');
});

test('同じ再発行リンクは二回使えない', async ({ page }) => {
  const url = '/recover/?token=demo-recovery-moko-001';
  await page.goto(url);
  await page.getByRole('button', { name: '自分のマイページを開く' }).click();
  await expect(page).toHaveURL(/#my-page$/);
  await page.goto(url);
  await expect(page.getByRole('button', { name: '自分のマイページを開く' })).toBeDisabled();
  await expect(page.locator('#message')).toContainText('使用済み');
});
