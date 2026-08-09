import { expect, test } from '@playwright/test';

test('home page has expected heading', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Polyomino Solver' })).toBeVisible();
});

test('delete mode removes a piece from the list', async ({ page }) => {
	await page.goto('/');

	const pieceInputs = page.locator('input[aria-label^="piece"]');
	const initialCount = await pieceInputs.count();

	await page.getByRole('button', { name: 'enable delete mode' }).click();
	await page.getByRole('button', { name: 'delete piece 0' }).click();

	await expect(pieceInputs).toHaveCount(initialCount - 1);
});
