import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.describe('Home Page', () => {
    // Skip: Home page has dynamic/animated content that causes flaky screenshots
    test.skip('full page screenshot', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await page.addStyleTag({
        content: `*, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }`
      });

      await expect(page).toHaveScreenshot('home-page.png', {
        fullPage: true,
        animations: 'disabled',
        maxDiffPixelRatio: 0.02,
      });
    });
  });

  test.describe('Certified Products Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/certified-products/');
      await page.waitForSelector('#devicesTable tbody tr');
      await page.waitForLoadState('networkidle');
    });

    test('full page - default state', async ({ page }) => {
      await expect(page).toHaveScreenshot('certified-products-default.png', {
        fullPage: true,
      });
    });

    test('filters section', async ({ page }) => {
      const filtersSection = page.locator('.devices-filters');
      await expect(filtersSection).toHaveScreenshot('filters-section.png');
    });

    test('table header', async ({ page }) => {
      const tableHeader = page.locator('#devicesTable thead');
      await expect(tableHeader).toHaveScreenshot('table-header.png');
    });

    test('pagination controls', async ({ page }) => {
      const pagination = page.locator('.pagination-wrapper');
      await expect(pagination).toHaveScreenshot('pagination-controls.png');
    });

    test('FAQ section - collapsed', async ({ page }) => {
      const faqSection = page.locator('.faq-section');
      await expect(faqSection).toHaveScreenshot('faq-collapsed.png');
    });

    test('FAQ section - expanded', async ({ page }) => {
      // Expand first FAQ item
      await page.locator('.faq-item').first().locator('.faq-question').click();
      await page.waitForTimeout(300); // Wait for animation

      const faqSection = page.locator('.faq-section');
      await expect(faqSection).toHaveScreenshot('faq-expanded.png');
    });

    test('with search filter active', async ({ page }) => {
      await page.fill('#searchInput', 'apollo');
      await page.waitForTimeout(100);

      // Screenshot the filters and results area
      const filtersSection = page.locator('.devices-filters');
      await expect(filtersSection).toHaveScreenshot('filters-with-search.png');
    });

    test('with brand filter active', async ({ page }) => {
      const brandSelect = page.locator('#brandFilter');
      const options = await brandSelect.locator('option').all();

      if (options.length > 1) {
        await brandSelect.selectOption(await options[1].getAttribute('value') || '');
        await page.waitForTimeout(100);

        const filtersSection = page.locator('.devices-filters');
        await expect(filtersSection).toHaveScreenshot('filters-with-brand.png');
      }
    });

    test('clear filters button visible', async ({ page }) => {
      await page.fill('#searchInput', 'test');
      await page.waitForTimeout(100);

      const clearButton = page.locator('#clearFilters');
      await expect(clearButton).toHaveScreenshot('clear-filters-button.png');
    });

    test('table rows', async ({ page }) => {
      // Get first few visible rows
      const tableBody = page.locator('#devicesTable tbody');
      await expect(tableBody).toHaveScreenshot('table-body.png', {
        maxDiffPixels: 500, // Allow some variation in content
      });
    });

    test('sorted by brand ascending', async ({ page }) => {
      await page.locator('th[data-sort="brand"]').click();
      await page.waitForTimeout(100);

      const tableHeader = page.locator('#devicesTable thead');
      await expect(tableHeader).toHaveScreenshot('table-header-sorted-asc.png');
    });

    test('sorted by brand descending', async ({ page }) => {
      await page.locator('th[data-sort="brand"]').click();
      await page.waitForTimeout(100);
      await page.locator('th[data-sort="brand"]').click();
      await page.waitForTimeout(100);

      const tableHeader = page.locator('#devicesTable thead');
      await expect(tableHeader).toHaveScreenshot('table-header-sorted-desc.png');
    });
  });

  test.describe('Responsive Design', () => {
    test('mobile viewport - certified products', async ({ page, browserName }) => {
      // Only run on mobile projects
      test.skip(browserName !== 'chromium' && !page.viewportSize()?.width || (page.viewportSize()?.width || 0) > 500, 'Mobile only test');

      await page.goto('/certified-products/');
      await page.waitForSelector('#devicesTable tbody tr');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('mobile-certified-products.png', {
        fullPage: true,
      });
    });

    test('tablet viewport - certified products', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/certified-products/');
      await page.waitForSelector('#devicesTable tbody tr');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('tablet-certified-products.png', {
        fullPage: true,
      });
    });
  });

  test.describe('Interactive States', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/certified-products/');
      await page.waitForSelector('#devicesTable tbody tr');
    });

    test('search input focused', async ({ page }) => {
      const searchInput = page.locator('#searchInput');
      await searchInput.focus();

      await expect(searchInput).toHaveScreenshot('search-input-focused.png');
    });

    test('brand filter dropdown', async ({ page }) => {
      const brandSelect = page.locator('#brandFilter');
      await brandSelect.focus();

      await expect(brandSelect).toHaveScreenshot('brand-filter-focused.png');
    });

    test('pagination button hover', async ({ page }) => {
      const nextButton = page.locator('#nextPage');
      await nextButton.hover();

      await expect(nextButton).toHaveScreenshot('pagination-button-hover.png');
    });

    test('table row hover', async ({ page }) => {
      const firstRow = page.locator('#devicesTable tbody tr:not([style*="display: none"])').first();
      await firstRow.hover();

      await expect(firstRow).toHaveScreenshot('table-row-hover.png');
    });

    test('FAQ question hover', async ({ page }) => {
      const firstQuestion = page.locator('.faq-question').first();
      await firstQuestion.hover();

      await expect(firstQuestion).toHaveScreenshot('faq-question-hover.png');
    });
  });

  test.describe('Component Isolation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/certified-products/');
      await page.waitForSelector('#devicesTable tbody tr');
    });

    test('region badge', async ({ page }) => {
      const regionBadge = page.locator('.region-badge').first();

      if (await regionBadge.count() > 0) {
        await expect(regionBadge).toHaveScreenshot('region-badge.png');
      }
    });

    test('remark icon', async ({ page }) => {
      const remarkIcon = page.locator('.remark-icon').first();

      if (await remarkIcon.count() > 0) {
        await expect(remarkIcon).toHaveScreenshot('remark-icon.png');
      }
    });

    test('remark tooltip visible', async ({ page }) => {
      const remarkIcon = page.locator('.remark-icon').first();

      if (await remarkIcon.count() > 0) {
        await remarkIcon.hover();
        await page.waitForTimeout(300);

        // Screenshot a larger area to capture the tooltip
        const remarkCell = page.locator('.remark-cell').first();
        await expect(remarkCell).toHaveScreenshot('remark-with-tooltip.png', {
          maxDiffPixels: 200,
        });
      }
    });

    test('page number button', async ({ page }) => {
      const pageNumber = page.locator('.page-number').first();

      if (await pageNumber.count() > 0) {
        await expect(pageNumber).toHaveScreenshot('page-number-button.png');
      }
    });

    test('page number button active', async ({ page }) => {
      const activePageNumber = page.locator('.page-number.active').first();

      if (await activePageNumber.count() > 0) {
        await expect(activePageNumber).toHaveScreenshot('page-number-active.png');
      }
    });
  });
});
