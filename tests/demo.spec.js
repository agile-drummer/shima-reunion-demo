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

test('participant can answer, change response in my page, and see latest state after reload',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'ちょっと答えてみる'}).click();
  await page.locator('#school').selectOption({label:'どんぐり小'});
  await page.locator('#class-teacher').selectOption({label:'1組｜フクロウ先生'});
  await page.locator('#name-query').fill('モ');
  await page.getByRole('button',{name:'わたしを探す'}).click();
  await page.locator('#candidate-list .candidate').first().click();
  await page.locator('input[name="intent"][value="参加したい"]').check();
  await page.locator('#privacy-agreement').check();
  await page.getByRole('button',{name:'この気持ちを送る'}).click();

  await expect(page.locator('#my-page')).toBeVisible();
  await expect(page.locator('#demo-current-intent')).toContainText('参加したい');
  await page.getByRole('button',{name:/今回はむずかしそう/}).click();
  await expect(page.locator('#demo-update-message')).toContainText('幹事への個別連絡は不要です');
  await expect(page.locator('#demo-current-intent')).toContainText('むずかしそう');

  await page.reload();
  await expect(page.locator('#my-page')).toBeVisible();
  await expect(page.locator('#demo-current-intent')).toContainText('むずかしそう');
  const rows=await page.evaluate(()=>JSON.parse(localStorage.getItem('atsumare-shimachu-demo')||'[]'));
  expect(rows.filter(row=>row.id===rows.at(-1).id)).toHaveLength(1);
});

test('LINE button opens internal LINE-style screen',async({page})=>{
  await page.locator('.demo-tools').scrollIntoViewIfNeeded();
  await page.locator('.demo-tools .demo-line-button').click();
  await expect(page).toHaveURL(/\/line\/?$/);
  await expect(page.getByRole('navigation',{name:'リッチメニュー'})).toBeVisible();
});

test('organizer dashboard defaults to production-like supporter view',async({page})=>{
  await page.goto('/organizer/');
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
  await expect(page.getByText('サポーター',{exact:true}).first()).toBeVisible();
  await expect(page.locator('#previewBanner')).toContainText('氏名はマスキング');
  await expect(page.locator('.class-bar')).toHaveCount(4);
  await expect(page.locator('#listTitle')).toHaveText('3組');
  await expect(page.locator('#visibleCount')).toHaveText('25');
  const trackBox=await page.locator('.track').first().boundingBox();
  expect(trackBox.height).toBeGreaterThan(trackBox.width);
  await expect(page.locator('.person h3').first()).toContainText('＊');
});

test('class chart updates list and all summary numbers',async({page})=>{
  await page.goto('/organizer/');
  await page.getByRole('button',{name:/2組/}).click();
  await expect(page.locator('#listTitle')).toHaveText('2組');
  await expect(page.locator('#visibleCount')).toHaveText('25');
  await expect(page.locator('#resultCount')).toContainText('計25人');
  await expect(page.locator('.person')).toHaveCount(25);
});

test('response and gender conditions update figures and roster together',async({page})=>{
  await page.goto('/organizer/');
  await page.getByRole('button',{name:'回答済み'}).click();
  await expect(page.locator('#answeredCount')).toHaveText('0');
  const unanswered=Number(await page.locator('#unansweredCount').textContent());
  await expect(page.locator('.person')).toHaveCount(unanswered);
  await page.getByRole('button',{name:/女性/}).click();
  await expect(page.locator('.people-columns section').nth(1).locator('.person')).toHaveCount(0);
});

test('participant Menu matches production structure and member login opens supporter view',async({page})=>{
  const labels=(await page.locator('#site-nav > a').allTextContents()).map(x=>x.replace(/\s+/g,' ').trim());
  expect(labels).toEqual(['参加してみる？','幹事からのご挨拶','お問い合わせ LINE','メンバーログイン 🔐']);
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Menu'}).click();
  await page.getByRole('link',{name:/メンバーログイン/}).click();
  await expect(page).toHaveURL(/\/organizer\/?$/);
  await expect(page.locator('#roleBadge')).toHaveText('サポーター');
  await expect(page.locator('#listTitle')).toHaveText('3組');
});

test('pages have no uncaught errors',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/','/line/','/organizer/']){await page.goto(path);await page.waitForTimeout(150)}
  expect(errors).toEqual([]);
});