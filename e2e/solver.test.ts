import { expect, test } from '@playwright/test';

test('solver produces correct output', async ({ page }) => {
	// Navigate to the app
	await page.goto('/');

	// Set up polyomino pieces and board size
	await page.getByLabel('boardx').fill('5');
	await page.getByLabel('boardy').fill('6');
	await page.getByRole('button', { name: 'cell-0' }).click();
	await page.getByRole('button', { name: 'cell-29' }).click();

	await page.getByLabel('piece2').fill('1');
	await page.getByLabel('piece3').fill('1');
	await page.getByLabel('piece7').fill('2');
	await page.getByLabel('piece8').fill('2');
	await page.getByLabel('piece9').fill('2');
	await page.getByLabel('piece10').fill('2');
	await page.getByLabel('piece13').fill('1');

	// start solve
	await page.getByRole('button', { name: 'START' }).click();

	// check solution count
	await expect(page.getByTitle('Solution')).toHaveCount(6);

	// check solver status
	await expect(page.getByRole('button', { name: 'START' })).toBeVisible();
});
