// Devices Table Sorting, Filtering and Pagination
(function () {
  let currentSort = { column: null, direction: 'asc' };
  let currentPage = 1;
  let itemsPerPage = 25;
  let filteredRows = [];

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function () {
    initializeFilters();
    initializeSorting();
    initializePagination();

    // Initial filter to set up filteredRows
    filterTable();

    // Set up search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        currentPage = 1;
        filterTable();
      });
    }

    // Set up filter dropdowns
    const brandFilter = document.getElementById('brandFilter');
    const protocolFilter = document.getElementById('protocolFilter');
    const deviceTypeFilter = document.getElementById('deviceTypeFilter');

    if (brandFilter) brandFilter.addEventListener('change', function () {
      currentPage = 1;
      filterTable();
    });
    if (protocolFilter) protocolFilter.addEventListener('change', function () {
      currentPage = 1;
      filterTable();
    });
    if (deviceTypeFilter) deviceTypeFilter.addEventListener('change', function () {
      currentPage = 1;
      filterTable();
    });

    const regionFilter = document.getElementById('regionFilter');
    if (regionFilter) regionFilter.addEventListener('change', function () {
      currentPage = 1;
      filterTable();
    });

    // Set up items per page selector
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    if (itemsPerPageSelect) {
      itemsPerPageSelect.addEventListener('change', function () {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        applyPagination();
      });
    }
  });

  // Initialize filter options
  function initializeFilters() {
    const table = document.getElementById('devicesTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    const protocols = new Set();
    const deviceTypes = new Set();
    const regions = new Set();

    rows.forEach(row => {
      const protocol = row.dataset.protocol;
      const deviceType = row.dataset.deviceType;
      const rowRegions = row.dataset.regions || '';

      if (protocol) protocols.add(protocol);
      if (deviceType) deviceTypes.add(deviceType);

      // Parse regions (comma-separated, lowercase)
      if (rowRegions) {
        rowRegions.split(',').forEach(region => {
          const trimmed = region.trim();
          if (trimmed) regions.add(trimmed);
        });
      }
    });

    // Populate protocol filter
    const protocolFilter = document.getElementById('protocolFilter');
    if (protocolFilter) {
      Array.from(protocols).sort().forEach(protocol => {
        const option = document.createElement('option');
        option.value = protocol;
        option.textContent = protocol;
        protocolFilter.appendChild(option);
      });
    }

    // Populate device type filter
    const deviceTypeFilter = document.getElementById('deviceTypeFilter');
    if (deviceTypeFilter) {
      Array.from(deviceTypes).sort().forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        deviceTypeFilter.appendChild(option);
      });
    }

    // Populate region filter
    const regionFilterEl = document.getElementById('regionFilter');
    if (regionFilterEl) {
      Array.from(regions).sort().forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionFilterEl.appendChild(option);
      });
    }
  }

  // Initialize sorting
  function initializeSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');

    sortableHeaders.forEach(header => {
      header.addEventListener('click', function () {
        const column = this.dataset.sort;
        sortTable(column);
      });
    });
  }

  // Initialize pagination controls
  function initializePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (currentPage > 1) {
          currentPage--;
          applyPagination();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          applyPagination();
        }
      });
    }
  }

  // Sort table by column
  function sortTable(column) {
    const table = document.getElementById('devicesTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Determine sort direction
    if (currentSort.column === column) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = column;
      currentSort.direction = 'asc';
    }

    // Get column index
    const headers = Array.from(table.querySelectorAll('th'));
    const columnIndex = headers.findIndex(h => h.dataset.sort === column);

    if (columnIndex === -1) return;

    // Sort rows
    rows.sort((a, b) => {
      let aValue = a.cells[columnIndex].textContent.trim();
      let bValue = b.cells[columnIndex].textContent.trim();

      // Handle empty values
      if (!aValue) return 1;
      if (!bValue) return -1;

      if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));

    // Update sort indicators
    updateSortIndicators();

    // Re-apply filter and pagination after sort
    currentPage = 1;
    filterTable();
  }

  // Update sort indicator icons
  function updateSortIndicators() {
    const sortableHeaders = document.querySelectorAll('.sortable');

    sortableHeaders.forEach(header => {
      header.classList.remove('sort-asc', 'sort-desc');

      if (header.dataset.sort === currentSort.column) {
        header.classList.add(`sort-${currentSort.direction}`);
      }
    });
  }

  // Filter table based on search and filters
  function filterTable() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const brandFilter = document.getElementById('brandFilter')?.value || '';
    const protocolFilter = document.getElementById('protocolFilter')?.value || '';
    const deviceTypeFilter = document.getElementById('deviceTypeFilter')?.value || '';
    const regionFilter = document.getElementById('regionFilter')?.value || '';

    const table = document.getElementById('devicesTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    filteredRows = [];

    rows.forEach(row => {
      const searchData = row.dataset.search || '';
      const brand = row.dataset.brand || '';
      const protocol = row.dataset.protocol || '';
      const deviceType = row.dataset.deviceType || '';
      const rowRegions = row.dataset.regions || '';

      const matchesSearch = searchTerm === '' || searchData.includes(searchTerm);
      const matchesBrand = brandFilter === '' || brand === brandFilter;
      const matchesProtocol = protocolFilter === '' || protocol === protocolFilter;
      const matchesDeviceType = deviceTypeFilter === '' || deviceType === deviceTypeFilter;
      // Region filter: check if any of the row's regions contain the filter value
      const matchesRegion = regionFilter === '' || rowRegions.split(',').some(r => r.trim() === regionFilter);

      if (matchesSearch && matchesBrand && matchesProtocol && matchesDeviceType && matchesRegion) {
        filteredRows.push(row);
      }
    });

    applyPagination();
  }

  // Apply pagination to filtered rows
  function applyPagination() {
    const table = document.getElementById('devicesTable');
    if (!table) return;

    const allRows = table.querySelectorAll('tbody tr');
    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

    // Ensure current page is valid
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    }
    if (currentPage < 1) {
      currentPage = 1;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Hide all rows first
    allRows.forEach(row => {
      row.style.display = 'none';
    });

    // Show only the rows for the current page
    filteredRows.forEach((row, index) => {
      if (index >= startIndex && index < endIndex) {
        row.style.display = '';
      }
    });

    updatePaginationControls(totalPages);
    updateDeviceCount();
  }

  // Update pagination controls
  function updatePaginationControls(totalPages) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const paginationContainer = document.querySelector('.pagination-controls');

    if (prevBtn) {
      prevBtn.disabled = currentPage <= 1;
    }

    if (nextBtn) {
      nextBtn.disabled = currentPage >= totalPages;
    }

    if (pageInfo) {
      if (totalPages === 0) {
        pageInfo.textContent = 'Page 0 of 0';
      } else {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
      }
    }

    // Hide pagination if only one page
    if (paginationContainer) {
      paginationContainer.style.display = totalPages <= 1 ? 'none' : 'flex';
    }

    // Update page numbers
    updatePageNumbers(totalPages);
  }

  // Update page number buttons
  function updatePageNumbers(totalPages) {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    if (!pageNumbersContainer) return;

    pageNumbersContainer.innerHTML = '';

    // Calculate which page numbers to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Adjust to always show 5 pages if possible
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }

    // First page and ellipsis
    if (startPage > 1) {
      pageNumbersContainer.appendChild(createPageButton(1));
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbersContainer.appendChild(createPageButton(i));
    }

    // Last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        pageNumbersContainer.appendChild(ellipsis);
      }
      pageNumbersContainer.appendChild(createPageButton(totalPages));
    }
  }

  // Create a page number button
  function createPageButton(pageNum) {
    const button = document.createElement('button');
    button.className = 'page-number' + (pageNum === currentPage ? ' active' : '');
    button.textContent = pageNum;
    button.addEventListener('click', function () {
      currentPage = pageNum;
      applyPagination();
    });
    return button;
  }

  // Update device count display
  function updateDeviceCount() {
    const table = document.getElementById('devicesTable');
    if (!table) return;

    const totalRows = table.querySelectorAll('tbody tr').length;
    const visibleOnPage = document.querySelectorAll('#devicesTable tbody tr:not([style*="display: none"])').length;

    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');
    const filteredCountEl = document.getElementById('filteredCount');

    if (visibleCountEl) visibleCountEl.textContent = visibleOnPage;
    if (totalCountEl) totalCountEl.textContent = totalRows;
    if (filteredCountEl) filteredCountEl.textContent = filteredRows.length;
  }
})();
