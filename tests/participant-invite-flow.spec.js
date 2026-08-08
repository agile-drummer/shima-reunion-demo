const { test, expect } = require('@playwright/test');

const INVITE_KEY='atsumare-demo-participant-invite';
const ANSWER_KEY='atsumare-shimachu-demo';
const CURRENT_KEY='atsumare-shimachu-demo-current-id';

test.beforeEach(async({page})=>{
  await page.goto('/');
  await page.evaluate(([invite,answer,current])=>{localStorage.removeItem(invite);localStorage.removeItem(answer);localStorage.removeItem(current)},[INVITE_KEY,ANSWER_KEY,CURRENT_KEY]);
});

test('幹事の個別リンク発行から開封・初回回答・回答済み反映までつながる',async({page})=>{
  await page.goto('/organizer/participant-invites/');
  await expect(page.locator('#progress')).toHaveText('未連絡');
  await expect(page.locator('#uncontacted')).toHaveText('1');

  await page.getByRole('button',{name:'回答リンクを作る'}).click();
  await expect(page.locator('#progress')).toHaveText('招待済');
  await expect(page.locator('#invited')).toHaveText('1');
  const inviteUrl=await page.locator('#openInvite').getAttribute('href');

  await page.locator('#openInvite').click();
  await expect(page).toHaveURL(/\/respond\/\?token=/);
  await page.getByRole('button',{name:'自分の回答ページを開く'}).click();
  await expect(page).toHaveURL(/\/#my-page$/);
  await expect(page.locator('#my-page')).toBeVisible();
  await expect(page.locator('#demo-current-intent')).toHaveText('未回答');

  await page.getByRole('button',{name:/参加したい/}).click();
  await expect(page.locator('#demo-current-intent')).toContainText('参加したい');

  await page.goto('/organizer/participant-invites/');
  await expect(page.locator('#progress')).toHaveText('回答済');
  await expect(page.locator('#answered')).toHaveText('1');

  await page.goto(inviteUrl);
  await page.getByRole('button',{name:'自分の回答ページを開く'}).click();
  await expect(page.locator('#message')).toContainText('使用済み');
});

test('回答招待URLには架空tokenだけを載せ、個人属性を含めない',async({page})=>{
  await page.goto('/organizer/participant-invites/');
  await page.getByRole('button',{name:'回答リンクを作る'}).click();
  const href=await page.locator('#openInvite').getAttribute('href');
  expect(href).toContain('/respond/?token=');
  expect(href).not.toContain('モコ');
  expect(href).not.toContain('3組');
  expect(href).not.toContain('demo-invite-moko');
});
