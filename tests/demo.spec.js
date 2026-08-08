const { test, expect } = require('@playwright/test');
test.beforeEach(async({page})=>{await page.goto('/');await page.evaluate(()=>localStorage.clear());await page.reload()});

test('public page shows warm percentage-only response summary',async({page})=>{
  await expect(page.locator('#response-summary')).toBeVisible();
  await expect(page.locator('#response-summary')).toContainText('88%');
  await expect(page.locator('#response-summary')).not.toContainText('人が回答済み');
  const summaryAfterButton = await page.locator('#open-interest-search + #response-summary').count();
  expect(summaryAfterButton).toBe(1);
  await expect(page.locator('.response-bar-label')).toHaveCSS('white-space','nowrap');
  await expect(page.locator('.response-legend')).toHaveCSS('white-space','nowrap');
});

test('mobile Menu opens once and closes after navigation',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  const menu=page.getByRole('button',{name:'Menu'});
  const nav=page.locator('#site-nav');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded','true');
  await expect(nav).toHaveClass(/open/);
  await nav.getByRole('link',{name:'参加してみる？'}).click();
  await expect(menu).toHaveAttribute('aria-expanded','false');
  await expect(nav).not.toHaveClass(/open/);
});

test('participant roster exposes four classes and excludes deceased demo member',async({page})=>{
  await page.getByRole('button',{name:'ちょっと答えてみる'}).click();
  await expect(page.locator('#class-teacher option')).toHaveCount(5);
  await expect(page.locator('#class-teacher')).toContainText('4組｜イルカ先生');
  await page.locator('#school').selectOption({label:'しおかぜ小'});
  await page.locator('#class-teacher').selectOption({label:'1組｜フクロウ先生'});
  await page.locator('#name-query').fill('リン');
  await page.getByRole('button',{name:'わたしを探す'}).click();
  await expect(page.getByText('候補が見つかりませんでした')).toBeVisible();
});

test('LINE button opens internal LINE-style screen',async({page})=>{
  await page.locator('.demo-tools').scrollIntoViewIfNeeded();
  await page.locator('.demo-tools .demo-line-button').click();
  await expect(page).toHaveURL(/\/line\/?$/);
  await expect(page.getByRole('navigation',{name:'リッチメニュー'})).toBeVisible();
});

test('supporter starts with assigned class and has no applications',async({page})=>{
  await page.goto('/line/');await page.getByLabel(/サポーター/).check();
  await page.getByRole('link',{name:/メンバーログイン/}).click();
  await expect(page.getByText('サポーター',{exact:true}).first()).toBeVisible();
  await expect(page.getByRole('button',{name:'1組'})).toHaveClass(/active/);
  await expect(page.locator('#applications')).toHaveClass(/hidden/);
});

test('organizer sees IDs applications and deceased controls',async({page})=>{
  await page.goto('/line/');await page.getByRole('link',{name:/メンバーログイン/}).click();
  await expect(page.locator('#applications')).not.toHaveClass(/hidden/);
  await expect(page.locator('.id-badge').first()).toContainText('D001');
  await expect(page.locator('[data-deceased]').first()).toBeVisible();
  await page.locator('[data-deceased]').first().click();
  await expect(page.locator('.person.deceased').first()).toContainText('逝去（回答対象外）');
  await expect(page.locator('#eligibleCount')).toContainText('97');
});

test('organizer has four classes of 25 and assignee labels are accessible only',async({page})=>{
  await page.goto('/line/');await page.getByRole('link',{name:/メンバーログイン/}).click();
  await page.getByRole('button',{name:'4組'}).click();
  await expect(page.getByText('25人を表示')).toBeVisible();
  await expect(page.locator('.person')).toHaveCount(25);
  await expect(page.locator('.controls strong')).toHaveCount(0);
  await expect(page.locator('select[aria-label*="担当"]').first()).toBeVisible();
});

test('member role is read-only and deceased people are hidden',async({page})=>{
  await page.goto('/line/');await page.getByLabel(/一般メンバー/).check();
  await page.getByRole('link',{name:/メンバーログイン/}).click();
  await expect(page.getByText('このロールでは閲覧のみです').first()).toBeVisible();
  await expect(page.locator('select[data-id]')).toHaveCount(0);
  await expect(page.locator('.person.deceased')).toHaveCount(0);
});

test('pages have no uncaught errors',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/','/line/','/organizer/']){await page.goto(path);await page.waitForTimeout(150)}
  expect(errors).toEqual([]);
});
