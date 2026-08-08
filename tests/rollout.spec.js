import { test, expect } from '@playwright/test';

test('organizer dashboard links to Phase 1 rollout tools and hides them for member role', async ({ page }) => {
  await page.goto('/organizer/');
  const card = page.locator('#rolloutQuickLinks');
  await expect(card).toBeVisible();
  await expect(card.getByRole('link', { name: /Rollout Dashboard/ })).toHaveAttribute('href', 'rollout-dashboard/');
  await expect(card.getByRole('link', { name: /実機E2E/ })).toHaveAttribute('href', 'rollout/');
  await expect(card.getByRole('link', { name: /LINE通知 readiness/ })).toHaveAttribute('href', 'notification-readiness/');
  await page.getByRole('button', { name: '一般' }).click();
  await expect(card).toBeHidden();
});

test('rollout dashboard exposes staged rollout decision without production secrets', async ({ page }) => {
  await page.goto('/organizer/rollout-dashboard/');
  await expect(page.getByRole('heading', { name: '一次打診 Rollout Dashboard' })).toBeVisible();
  await expect(page.getByText('少人数テストを継続')).toBeVisible();
  await expect(page.getByText('未連絡')).toBeVisible();
  await expect(page.getByText('回答済')).toBeVisible();
});

test('notification readiness demo never renders token or LINE user id', async ({ page }) => {
  await page.goto('/organizer/notification-readiness/');
  await expect(page.getByText('設定済み（デモ）')).toBeVisible();
  const body = await page.locator('body').innerText();
  expect(body).not.toContain('LINE_MESSAGING_CHANNEL_ACCESS_TOKEN=');
  expect(body).not.toMatch(/U[a-f0-9]{20,}/i);
});

test('device E2E demo shows four fictional organizers and A-D scenarios', async ({ page }) => {
  await page.goto('/organizer/rollout/');
  await expect(page.getByText('3 / 4 人が全シナリオPASS')).toBeVisible();
  await expect(page.getByText(/A: LINE Login/)).toBeVisible();
  await expect(page.getByText(/D: マイページ再発行/)).toBeVisible();
});
