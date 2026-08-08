import { test, expect } from '@playwright/test';

test('フッターからプライバシー・安心運営方針を開ける', async ({ page }) => {
  await page.goto('/');

  const trust = page.locator('.footer-trust');
  await expect(trust).toContainText('安心してご利用いただくために');
  await expect(trust).toContainText('架空データのみを使用しています');

  await trust.getByRole('link', { name: /プライバシー・安心運営方針/ }).click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await expect(page.getByRole('heading', { name: 'プライバシー・安心運営方針' })).toBeVisible();
  await expect(page.getByText('実在する同窓会の個人情報や本番用の認証秘密情報は使用しません')).toBeVisible();
});
