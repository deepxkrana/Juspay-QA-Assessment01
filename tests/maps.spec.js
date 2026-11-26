import {test, expect} from '@playwright/test'
test('Open goole maps and search for howrah brideg',async({page})=>{
  await page.goto('https://www.google.com/maps/');
  console.log('https://www.google.com/maps/')
  await expect(page).toHaveURL(/google\.com\/maps/);
  const haveURl=await expect(page).toHaveURL(/google\.com\/maps/);
  console.log(haveURl);
  const searchBox = page.getByRole('combobox');
  const suggestion = page
    .getByRole('grid', { name: 'Suggestions' })
    .getByRole('gridcell', { name: /^Howrah Bridge\b/ })
    .first();

  let suggestionFound = false;
  for (const character of 'howrah bridge') {
    await searchBox.pressSequentially(character);
    try {
      await suggestion.waitFor({ state: 'visible', timeout: 1000 });
      suggestionFound = true;
    } catch (error) {
      if (!(error instanceof Error) || error.name !== 'TimeoutError') {
        throw error;
      }
    }

    if (suggestionFound) break;
  }

  if (!suggestionFound) await expect(suggestion).toBeVisible();
  await suggestion.click();
})