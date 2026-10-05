import { test, expect } from '@playwright/test';

test('has title and redirects to cfp', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/.*cfp/);
  await expect(page.locator('#cfp-title')).toContainText('Submissão de Proposta (Call for Papers)');
});
