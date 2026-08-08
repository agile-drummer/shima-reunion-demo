const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/organizer/');
  await page.evaluate(() => localStorage.removeItem('atsumare-response-change-history'));
  await page.reload();
});

test('supporter sees unconfirmed response changes and recent three-item summary', async ({ page }) => {
  await expect(page.locator('#roleBadge')).toHaveText('サポーター');
  await expect(page.locator('#responseChangeSummaryCard')).toBeVisible();
  await expect(page.locator('#responseChangeSummaryCount')).toHaveText('1');
  await expect(page.locator('#responseChangeSummaryList')).toContainText('参加したい → 今回は欠席予定');
  await expect(page.locator('#responseChangeSummaryList .change-mini')).toHaveCount(2);
  await expect(page.locator('#responseChangeSummaryList')).toContainText('＊');
});

test('member preview hides response change summary', async ({ page }) => {
  await page.getByRole('button', { name: '一般' }).click();
  await expect(page.locator('#roleBadge')).toHaveText('メンバー');
  await expect(page.locator('#responseChangeSummaryCard')).toBeHidden();
});

test('summary links to full response change history', async ({ page }) => {
  await page.getByRole('link', { name: /すべての変更を確認/ }).click();
  await expect(page).toHaveURL(/\/organizer\/audit\/?$/);
  await expect(page.getByRole('heading', { name: '運営履歴' })).toBeVisible();
});
