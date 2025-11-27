import { test, expect } from '@playwright/test';

test.describe('Certified Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/certified-products/');
    // Wait for the table to be populated
    await page.waitForSelector('#devicesTable tbody tr');
  });

  test.describe('Page Load', () => {
    test('should display the page title', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Certified Works with Home Assistant Products');
    });

    test('should display the devices table', async ({ page }) => {
      await expect(page.locator('#devicesTable')).toBeVisible();
    });

    test('should display filter controls', async ({ page }) => {
      await expect(page.locator('#searchInput')).toBeVisible();
      await expect(page.locator('#brandFilter')).toBeVisible();
      await expect(page.locator('#protocolFilter')).toBeVisible();
      await expect(page.locator('#deviceTypeFilter')).toBeVisible();
      await expect(page.locator('#regionFilter')).toBeVisible();
    });

    test('should display pagination controls', async ({ page }) => {
      await expect(page.locator('#prevPage')).toBeVisible();
      await expect(page.locator('#nextPage')).toBeVisible();
      await expect(page.locator('#itemsPerPage')).toBeVisible();
    });

    test('should display device count', async ({ page }) => {
      await expect(page.locator('#visibleCount')).toBeVisible();
      await expect(page.locator('#totalCount')).toBeVisible();
      await expect(page.locator('#filteredCount')).toBeVisible();
    });

    test('should display FAQ section', async ({ page }) => {
      await expect(page.locator('.faq-section h2')).toContainText('Frequently Asked Questions');
      await expect(page.locator('.faq-item')).toHaveCount(5);
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter devices when searching', async ({ page }) => {
      const initialCount = await page.locator('#filteredCount').textContent();

      await page.fill('#searchInput', 'apollo');
      await page.waitForTimeout(100); // Allow for debounce

      const filteredCount = await page.locator('#filteredCount').textContent();
      expect(Number(filteredCount)).toBeLessThan(Number(initialCount));
    });

    test('should show clear button when search is active', async ({ page }) => {
      await expect(page.locator('#clearFilters')).toBeHidden();

      await page.fill('#searchInput', 'test');
      await page.waitForTimeout(100);

      await expect(page.locator('#clearFilters')).toBeVisible();
    });

    test('should be case insensitive', async ({ page }) => {
      await page.fill('#searchInput', 'APOLLO');
      await page.waitForTimeout(100);

      const upperCount = await page.locator('#filteredCount').textContent();

      await page.fill('#searchInput', 'apollo');
      await page.waitForTimeout(100);

      const lowerCount = await page.locator('#filteredCount').textContent();

      expect(upperCount).toBe(lowerCount);
    });

    test('should show no results for invalid search', async ({ page }) => {
      await page.fill('#searchInput', 'xyznonexistent123');
      await page.waitForTimeout(100);

      const filteredCount = await page.locator('#filteredCount').textContent();
      expect(filteredCount).toBe('0');
    });
  });

  test.describe('Filter Dropdowns', () => {
    test('should filter by brand', async ({ page }) => {
      const initialCount = await page.locator('#filteredCount').textContent();

      // Get first brand option that's not "All Brands"
      const brandSelect = page.locator('#brandFilter');
      const options = await brandSelect.locator('option').all();

      if (options.length > 1) {
        const firstBrandValue = await options[1].getAttribute('value');
        await brandSelect.selectOption(firstBrandValue!);
        await page.waitForTimeout(100);

        const filteredCount = await page.locator('#filteredCount').textContent();
        expect(Number(filteredCount)).toBeLessThanOrEqual(Number(initialCount));
      }
    });

    test('should filter by protocol', async ({ page }) => {
      const protocolSelect = page.locator('#protocolFilter');
      const options = await protocolSelect.locator('option').all();

      if (options.length > 1) {
        const firstProtocolValue = await options[1].getAttribute('value');
        await protocolSelect.selectOption(firstProtocolValue!);
        await page.waitForTimeout(100);

        // All visible rows should have the selected protocol
        const visibleRows = page.locator('#devicesTable tbody tr:not([style*="display: none"])');
        const count = await visibleRows.count();

        if (count > 0) {
          const firstRowProtocol = await visibleRows.first().getAttribute('data-protocol');
          expect(firstRowProtocol).toBe(firstProtocolValue);
        }
      }
    });

    test('should filter by device type', async ({ page }) => {
      const deviceTypeSelect = page.locator('#deviceTypeFilter');
      const options = await deviceTypeSelect.locator('option').all();

      if (options.length > 1) {
        const firstTypeValue = await options[1].getAttribute('value');
        await deviceTypeSelect.selectOption(firstTypeValue!);
        await page.waitForTimeout(100);

        // All visible rows should have the selected device type
        const visibleRows = page.locator('#devicesTable tbody tr:not([style*="display: none"])');
        const count = await visibleRows.count();

        if (count > 0) {
          const firstRowType = await visibleRows.first().getAttribute('data-device-type');
          expect(firstRowType).toBe(firstTypeValue);
        }
      }
    });

    test('should filter by region', async ({ page }) => {
      const regionSelect = page.locator('#regionFilter');
      const options = await regionSelect.locator('option').all();

      if (options.length > 1) {
        const firstRegionValue = await options[1].getAttribute('value');
        await regionSelect.selectOption(firstRegionValue!);
        await page.waitForTimeout(100);

        // All visible rows should contain the selected region
        const visibleRows = page.locator('#devicesTable tbody tr:not([style*="display: none"])');
        const count = await visibleRows.count();

        if (count > 0) {
          const firstRowRegions = await visibleRows.first().getAttribute('data-regions');
          expect(firstRowRegions).toContain(firstRegionValue);
        }
      }
    });

    test('should show counts in filter options', async ({ page }) => {
      const brandSelect = page.locator('#brandFilter');
      const firstOption = brandSelect.locator('option').first();
      const optionText = await firstOption.textContent();

      // Should have format "All Brands (X)"
      expect(optionText).toMatch(/All Brands \(\d+\)/);
    });

    test('should combine multiple filters', async ({ page }) => {
      const brandSelect = page.locator('#brandFilter');
      const brandOptions = await brandSelect.locator('option').all();

      const protocolSelect = page.locator('#protocolFilter');
      const protocolOptions = await protocolSelect.locator('option').all();

      if (brandOptions.length > 1 && protocolOptions.length > 1) {
        await brandSelect.selectOption(await brandOptions[1].getAttribute('value') || '');
        await page.waitForTimeout(100);

        const afterBrandCount = await page.locator('#filteredCount').textContent();

        await protocolSelect.selectOption(await protocolOptions[1].getAttribute('value') || '');
        await page.waitForTimeout(100);

        const afterBothCount = await page.locator('#filteredCount').textContent();

        expect(Number(afterBothCount)).toBeLessThanOrEqual(Number(afterBrandCount));
      }
    });
  });

  test.describe('Clear Filters', () => {
    test('should clear all filters when clicking clear button', async ({ page }) => {
      const initialCount = await page.locator('#filteredCount').textContent();

      // Apply some filters
      await page.fill('#searchInput', 'test');
      await page.waitForTimeout(100);

      // Click clear button
      await page.click('#clearFilters');
      await page.waitForTimeout(100);

      // Should return to initial state
      const afterClearCount = await page.locator('#filteredCount').textContent();
      expect(afterClearCount).toBe(initialCount);

      // Search input should be cleared
      const searchValue = await page.locator('#searchInput').inputValue();
      expect(searchValue).toBe('');
    });

    test('should hide clear button after clearing', async ({ page }) => {
      await page.fill('#searchInput', 'test');
      await page.waitForTimeout(100);

      await expect(page.locator('#clearFilters')).toBeVisible();

      await page.click('#clearFilters');
      await page.waitForTimeout(100);

      await expect(page.locator('#clearFilters')).toBeHidden();
    });
  });

  test.describe('Pagination', () => {
    test('should show correct number of items per page', async ({ page }) => {
      await page.selectOption('#itemsPerPage', '10');
      await page.waitForTimeout(100);

      const visibleRows = page.locator('#devicesTable tbody tr:not([style*="display: none"])');
      const count = await visibleRows.count();

      expect(count).toBeLessThanOrEqual(10);
    });

    test('should navigate to next page', async ({ page }) => {
      // Set to 10 items per page to ensure multiple pages
      await page.selectOption('#itemsPerPage', '10');
      await page.waitForTimeout(100);

      const totalCount = await page.locator('#totalCount').textContent();

      if (Number(totalCount) > 10) {
        const pageInfoBefore = await page.locator('#pageInfo').textContent();

        await page.click('#nextPage');
        await page.waitForTimeout(100);

        const pageInfoAfter = await page.locator('#pageInfo').textContent();
        expect(pageInfoAfter).not.toBe(pageInfoBefore);
      }
    });

    test('should navigate to previous page', async ({ page }) => {
      await page.selectOption('#itemsPerPage', '10');
      await page.waitForTimeout(100);

      const totalCount = await page.locator('#totalCount').textContent();

      if (Number(totalCount) > 10) {
        // Go to page 2 first
        await page.click('#nextPage');
        await page.waitForTimeout(100);

        const pageInfoOnPage2 = await page.locator('#pageInfo').textContent();

        // Go back to page 1
        await page.click('#prevPage');
        await page.waitForTimeout(100);

        const pageInfoOnPage1 = await page.locator('#pageInfo').textContent();
        expect(pageInfoOnPage1).not.toBe(pageInfoOnPage2);
      }
    });

    test('should disable prev button on first page', async ({ page }) => {
      await expect(page.locator('#prevPage')).toBeDisabled();
    });

    test('should update items per page', async ({ page }) => {
      await page.selectOption('#itemsPerPage', '50');
      await page.waitForTimeout(100);

      const visibleRows = page.locator('#devicesTable tbody tr:not([style*="display: none"])');
      const count = await visibleRows.count();

      expect(count).toBeLessThanOrEqual(50);
    });
  });

  test.describe('Table Sorting', () => {
    test('should sort by brand when clicking header', async ({ page }) => {
      const brandHeader = page.locator('th[data-sort="brand"]');

      // Get first brand before sorting
      const firstBrandBefore = await page.locator('#devicesTable tbody tr:not([style*="display: none"]) td:first-child').first().textContent();

      // Click to sort
      await brandHeader.click();
      await page.waitForTimeout(100);

      // Header should have sort class
      await expect(brandHeader).toHaveClass(/sort-asc|sort-desc/);
    });

    test('should toggle sort direction on repeated clicks', async ({ page }) => {
      const brandHeader = page.locator('th[data-sort="brand"]');

      // First click - ascending
      await brandHeader.click();
      await page.waitForTimeout(100);

      const sortClassAfterFirst = await brandHeader.getAttribute('class');

      // Second click - descending
      await brandHeader.click();
      await page.waitForTimeout(100);

      const sortClassAfterSecond = await brandHeader.getAttribute('class');

      expect(sortClassAfterFirst).not.toBe(sortClassAfterSecond);
    });
  });

  test.describe('FAQ Accordion', () => {
    test('should expand FAQ item on click', async ({ page }) => {
      const firstFaq = page.locator('.faq-item').first();

      // Should be closed initially
      await expect(firstFaq).not.toHaveAttribute('open');

      // Click to open
      await firstFaq.locator('.faq-question').click();

      // Should now be open
      await expect(firstFaq).toHaveAttribute('open');
    });

    test('should collapse FAQ item on second click', async ({ page }) => {
      const firstFaq = page.locator('.faq-item').first();

      // Open
      await firstFaq.locator('.faq-question').click();
      await expect(firstFaq).toHaveAttribute('open');

      // Close
      await firstFaq.locator('.faq-question').click();
      await expect(firstFaq).not.toHaveAttribute('open');
    });

    test('should display answer content when expanded', async ({ page }) => {
      const firstFaq = page.locator('.faq-item').first();
      const answer = firstFaq.locator('.faq-answer');

      // Open FAQ
      await firstFaq.locator('.faq-question').click();

      // Answer should be visible
      await expect(answer).toBeVisible();
    });
  });

  test.describe('Remark Tooltip', () => {
    test('should show tooltip on hover', async ({ page }) => {
      const remarkIcon = page.locator('.remark-icon').first();

      if (await remarkIcon.count() > 0) {
        const tooltip = remarkIcon.locator('.remark-tooltip');

        // Tooltip should be hidden initially
        await expect(tooltip).toHaveCSS('opacity', '0');

        // Hover over icon
        await remarkIcon.hover();

        // Tooltip should be visible (opacity: 1)
        await expect(tooltip).toHaveCSS('opacity', '1');
      }
    });
  });
});
