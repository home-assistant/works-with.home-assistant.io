// Devices Table Sorting and Filtering
(function() {
  let currentSort = { column: null, direction: 'asc' };

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeSorting();
    updateDeviceCount();

    // Set up search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', filterTable);
    }

    // Set up filter dropdowns
    const brandFilter = document.getElementById('brandFilter');
    const protocolFilter = document.getElementById('protocolFilter');
    const deviceTypeFilter = document.getElementById('deviceTypeFilter');

    if (brandFilter) brandFilter.addEventListener('change', filterTable);
    if (protocolFilter) protocolFilter.addEventListener('change', filterTable);
    if (deviceTypeFilter) deviceTypeFilter.addEventListener('change', filterTable);
  });

  // Initialize filter options
  function initializeFilters() {
    const table = document.getElementById('devicesTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    const protocols = new Set();
    const deviceTypes = new Set();

    rows.forEach(row => {
      const protocol = row.dataset.protocol;
      const deviceType = row.dataset.deviceType;

      if (protocol) protocols.add(protocol);
      if (deviceType) deviceTypes.add(deviceType);
    });

    // Populate protocol filter
    const protocolFilter = document.getElementById('protocolFilter');
    if (protocolFilter) {
      protocols.forEach(protocol => {
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
  }

  // Initialize sorting
  function initializeSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');

    sortableHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const column = this.dataset.sort;
        sortTable(column);
      });
    });
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

      // Handle dates
      if (column === 'certificationDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

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
  }

  // Update sort indicator icons
  function updateSortIndicators() {
    const sortableHeaders = document.querySelectorAll('.sortable');

    sortableHeaders.forEach(header => {
      const icon = header.querySelector('.sort-icon');
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

    const table = document.getElementById('devicesTable');
    if (!table) return;

    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
      const searchData = row.dataset.search || '';
      const brand = row.dataset.brand || '';
      const protocol = row.dataset.protocol || '';
      const deviceType = row.dataset.deviceType || '';

      const matchesSearch = searchTerm === '' || searchData.includes(searchTerm);
      const matchesBrand = brandFilter === '' || brand === brandFilter;
      const matchesProtocol = protocolFilter === '' || protocol === protocolFilter;
      const matchesDeviceType = deviceTypeFilter === '' || deviceType === deviceTypeFilter;

      if (matchesSearch && matchesBrand && matchesProtocol && matchesDeviceType) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    updateDeviceCount(visibleCount);
  }

  // Update device count display
  function updateDeviceCount(visibleCount) {
    const table = document.getElementById('devicesTable');
    if (!table) return;

    const totalRows = table.querySelectorAll('tbody tr').length;
    const visible = visibleCount !== undefined ? visibleCount : totalRows;

    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');

    if (visibleCountEl) visibleCountEl.textContent = visible;
    if (totalCountEl) totalCountEl.textContent = totalRows;
  }
})();
