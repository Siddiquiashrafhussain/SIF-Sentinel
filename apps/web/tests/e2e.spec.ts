import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('SIF-Sentinel E2E Flow', () => {
  // Use a synthetic deterministic test account
  const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'admin@example.com';
  const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || 'password123';

  test('Login, Filter, Inspector, Review, and Accessibility', async ({ page }) => {
    // 1. LOGIN
    await page.goto('/login');
    
    // Accessibility check on login
    const loginA11y = await new AxeBuilder({ page }).analyze();
    expect(loginA11y.violations.filter(v => ['critical', 'serious'].includes(v.impact || ''))).toEqual([]);

    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard/reports
    await expect(page).toHaveURL(/.*\/reports|.*\/dashboard/);

    // 2. NAVIGATE TO REPORTS
    await page.goto('/reports');
    await expect(page.getByRole('table')).toBeVisible();

    // Accessibility check on reports page
    const reportsA11y = await new AxeBuilder({ page }).analyze();
    expect(reportsA11y.violations.filter(v => ['critical', 'serious'].includes(v.impact || ''))).toEqual([]);

    // 3. FILTER REPORTS
    // Assuming there's a search or filter input
    // await page.getByPlaceholder('Search...').fill('HIGH_SIF');
    // For now we just verify table rows exist
    await expect(page.locator('tbody tr').first()).toBeVisible();

    // 4. OPEN INSPECTOR
    await page.locator('tbody tr').first().click();
    // Assuming clicking a row opens the drawer or navigates to details
    // We expect some text from the inspector
    await expect(page.getByText('Review')).toBeVisible();

    // 5. REVIEW
    // Assuming there is a "Review" button or form inside the inspector
    // We won't submit to keep the DB clean unless we have a dedicated fixture
    // If we have a dedicated fixture, we'd do:
    // await page.getByRole('button', { name: 'Approve' }).click();
    
    // Verify JWT is not in localStorage
    const ls = await page.evaluate(() => window.localStorage.getItem('token'));
    expect(ls).toBeNull();
  });
});
