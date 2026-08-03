const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('mobile menu opens, navigates, and closes', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'));

  const menu = page.getByRole('button', { name: 'Menu' });
  const nav = page.locator('#site-nav');

  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(nav).toHaveClass(/open/);
  await expect(page.getByRole('link', { name: '公式LINE・お問い合わせ' })).toBeVisible();
  await expect(page.getByRole('link', { name: '運営メンバーデモ' })).toBeVisible();

  await page.getByRole('link', { name: '同窓会について' }).click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#about')).toBeInViewport();
});

test('footer LINE guide is always visible', async ({ page }) => {
  await page.locator('#line-contact').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: '幹事へのご連絡はこちら' })).toBeVisible();
  await expect(page.getByRole('button', { name: /公式LINEを友だち追加/ })).toBeVisible();
});

test('participant can submit interest and see LINE follow-up', async ({ page }) => {
  await page.getByRole('button', { name: 'ちょっと答えてみる' }).click();
  await page.getByRole('button', { name: 'わたしを探す' }).click();
  await page.locator('.candidate').first().click();
  await page.getByLabel('🙌 行きたい！').check();
  await page.locator('#privacy-agreement').check();
  await page.getByRole('button', { name: 'この気持ちを送る' }).click();

  await expect(page.getByRole('heading', { name: 'ありがとう！ 🎉' })).toBeVisible();
  await expect(page.getByText('「参加したい」として受け付けました。')).toBeVisible();
  await expect(page.getByText('公式LINEデモ')).toBeVisible();

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('atsumare-shimachu-demo') || '[]'));
  expect(stored.length).toBeGreaterThan(0);
});

test('LINE demo changes to friend-added state', async ({ page }) => {
  await page.locator('#line-contact').scrollIntoViewIfNeeded();
  const button = page.getByRole('button', { name: /公式LINEを友だち追加/ }).first();
  await button.click();
  await expect(page.getByRole('button', { name: /友だち追加済み/ }).first()).toBeDisabled();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('atsumare-shimachu-line-friend'))).toBe('1');
});

test('organizer demo page opens', async ({ page }) => {
  await page.goto('/organizer/');
  await expect(page).toHaveTitle(/運営|幹事|デモ/);
  await expect(page.locator('body')).not.toBeEmpty();
});

test('public page has no uncaught JavaScript errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});
