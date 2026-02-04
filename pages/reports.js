import Head from 'next/head'
import Script from 'next/script'

export default function Reports() {
  return (
    <>
      <Head>
        <title>التقارير - نظام صيانة السيارات</title>
      </Head>

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <i className="fas fa-car-side"></i>
            <div>
              <h2>صيانة السيارات</h2><span>نظام الإدارة</span>
            </div>
          </div>
          <nav className="sidebar-menu">
            <a href="/dashboard"><i className="fas fa-home"></i> لوحة التحكم</a>
            <a href="/operation"><i className="fas fa-oil-can"></i> تسجيل عملية</a>
            <a href="/reports" className="active"><i className="fas fa-chart-bar"></i> التقارير</a>
            <div className="menu-title admin-only">الإدارة</div>
            <a href="/admin/users" className="admin-only"><i className="fas fa-users"></i> المستخدمين</a>
            <a href="/admin/branches" className="admin-only"><i className="fas fa-building"></i> الفروع</a>
            <a href="/admin/cars-database" className="admin-only"><i className="fas fa-database"></i> قاعدة البيانات</a>
          </nav>
          <div className="sidebar-user" suppressHydrationWarning>
            <div className="avatar" suppressHydrationWarning>م</div>
            <div className="user-info" suppressHydrationWarning>
              <h4 suppressHydrationWarning>اسم المستخدم</h4><span suppressHydrationWarning>الفرع</span>
            </div>
            <button className="logout-btn"><i className="fas fa-sign-out-alt"></i></button>
          </div>
        </aside>

        {/* Mobile Menu Bar */}
        <div className="mobile-menu-bar">
          <div className="mobile-menu-header">
            <i className="fas fa-car-side"></i>
            <span>صيانة السيارات</span>
          </div>
          <button className="mobile-menu-toggle" id="mobileMenuToggle">
            <i className="fas fa-bars"></i>
          </button>
          <div className="mobile-menu-dropdown" id="mobileMenuDropdown">
            <a href="/dashboard"><i className="fas fa-home"></i> لوحة التحكم</a>
            <a href="/operation"><i className="fas fa-oil-can"></i> تسجيل عملية</a>
            <a href="/reports"><i className="fas fa-chart-bar"></i> التقارير</a>
            <div className="mobile-menu-divider"></div>
            <span className="mobile-menu-title">الإدارة</span>
            <a href="/admin/users" className="admin-only"><i className="fas fa-users"></i> المستخدمين</a>
            <a href="/admin/branches" className="admin-only"><i className="fas fa-building"></i> الفروع</a>
            <a href="/admin/cars-database" className="admin-only"><i className="fas fa-database"></i> قاعدة البيانات</a>
          </div>
        </div>

        <main className="main-content">
          <div className="page-header">
            <div>
              <h1><i className="fas fa-chart-bar"></i> التقارير</h1>
              <div className="breadcrumb"><a href="/dashboard">الرئيسية</a> / <span>التقارير</span></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-success" id="exportExcelBtn">
                <i className="fas fa-file-excel"></i> تصدير Excel
              </button>
              <button className="btn btn-outline" id="exportCsvBtn">
                <i className="fas fa-file-csv"></i> تصدير CSV
              </button>
            </div>
          </div>

          {/* Filter Action Bar with Search */}
          <div className="filter-action-bar">
            <div className="left">
              <div className="search-bar">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="بحث في جميع الحقول (السيارة، الزيت، المحرك...)"
                />
                <i className="fas fa-search"></i>
              </div>
            </div>
            <div className="right">
              <select id="itemsPerPage" className="items-per-page">
                <option value="10">10 في الصفحة</option>
                <option value="25" selected>25 في الصفحة</option>
                <option value="50">50 في الصفحة</option>
                <option value="100">100 في الصفحة</option>
              </select>
              <button className="btn btn-outline" id="resetFilters">
                <i className="fas fa-redo"></i> إعادة تعيين
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          <div id="activeFilters" className="active-filters" style={{ display: 'none' }}></div>

          <div className="report-filters">
            <div className="filter-group">
              <label>الفرع</label>
              <select id="branchFilter">
                <option value="">جميع الفروع</option>
              </select>
            </div>
            <div className="filter-group">
              <label>الحالة</label>
              <select id="matchingFilter">
                <option value="">الكل</option>
                <option value="1">مطابقة</option>
                <option value="0">غير مطابقة</option>
              </select>
            </div>
            <div className="filter-group">
              <label>من تاريخ</label>
              <input type="date" id="startDate" />
            </div>
            <div className="filter-group">
              <label>إلى تاريخ</label>
              <input type="date" id="endDate" />
            </div>
          </div>

          {/* Operations Table with Sortable Headers */}
          <div className="card report-card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <h3><i className="fas fa-list"></i> جميع العمليات</h3>
            </div>
            <div className="card-body">
              <div className="table-container" id="operationsTableContainer">
                <table id="operationsTable">
                  <thead>
                    <tr>
                      <th data-sortable="created_at">التاريخ</th>
                      <th data-sortable="car_brand">السيارة</th>
                      <th data-sortable="oil_used">الزيت</th>
                      <th data-sortable="oil_quantity">الكمية</th>
                      <th data-sortable="is_matching">الحالة</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
              <div id="noResults" className="empty-state" style={{ display: 'none' }}>
                <i className="fas fa-search"></i>
                <h3>لا توجد نتائج</h3>
                <p>جرب تعديل معايير البحث أو الفلترة</p>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div id="paginationContainer"></div>
        </main>
      </div>

      <Script src="/js/database-api.js" strategy="beforeInteractive" />
      <Script src="/js/auth-api.js" strategy="beforeInteractive" />
      <Script src="/js/utils.js" strategy="beforeInteractive" />
      <Script src="/js/ui-components.js" strategy="beforeInteractive" />
      <Script src="/js/filter-utils.js" strategy="beforeInteractive" />
      <Script src="/js/mobile-menu.js" strategy="afterInteractive" />
      <Script id="reports-script" strategy="afterInteractive">{`
        let filterManager;
        let branches = [];

        (async function() {
            if (!auth.requireAuth()) return;
            
            // Wait for DB initialization
            if (typeof ensureDBInit !== 'undefined') {
                await ensureDBInit();
            } else {
                await new Promise(r => setTimeout(r, 1000));
            }
            
            // Initialize filter manager
            filterManager = new FilterManager('reportFilters');
            filterManager.loadFromURL();
            
            await loadBranches();
            initializeFilters();
            await loadOperations();
        })();

        async function loadBranches() {
            branches = await db.getAll('branches');
            const select = document.getElementById('branchFilter');
            branches.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.id;
                opt.textContent = b.name;
                select.appendChild(opt);
            });
        }

        function initializeFilters() {
            // Restore filter values from FilterManager
            const filters = filterManager.getAllFilters();
            
            document.getElementById('searchInput').value = filters.search || '';
            document.getElementById('branchFilter').value = filters.branchId || '';
            document.getElementById('matchingFilter').value = filters.isMatching !== null ? filters.isMatching : '';
            document.getElementById('startDate').value = filters.startDate || '';
            document.getElementById('endDate').value = filters.endDate || '';
            document.getElementById('itemsPerPage').value = filters.limit || 25;

            // Search with debounce
            document.getElementById('searchInput').addEventListener('input', (e) => {
                filterManager.debounce('search', () => {
                    filterManager.setFilter('search', e.target.value);
                    loadOperations();
                }, 300);
            });

            // Other filters - apply immediately
            document.getElementById('branchFilter').addEventListener('change', (e) => {
                filterManager.setFilter('branchId', e.target.value ? parseInt(e.target.value) : null);
                loadOperations();
            });

            document.getElementById('matchingFilter').addEventListener('change', (e) => {
                filterManager.setFilter('isMatching', e.target.value !== '' ? parseInt(e.target.value) : null);
                loadOperations();
            });

            document.getElementById('startDate').addEventListener('change', (e) => {
                filterManager.setFilter('startDate', e.target.value || null);
                loadOperations();
            });

            document.getElementById('endDate').addEventListener('change', (e) => {
                filterManager.setFilter('endDate', e.target.value || null);
                loadOperations();
            });

            document.getElementById('itemsPerPage').addEventListener('change', (e) => {
                filterManager.setFilter('limit', parseInt(e.target.value));
                loadOperations();
            });

            // Reset filters
            document.getElementById('resetFilters').addEventListener('click', () => {
                filterManager.resetFilters();
                initializeFilters();
                loadOperations();
            });

            // Initialize sortable headers
            initSortableHeaders('operationsTable', filterManager, (column, order) => {
                loadOperations();
            });
        }

        async function loadOperations() {
            const container = document.getElementById('operationsTableContainer');
            const tbody = document.querySelector('#operationsTable tbody');
            const noResults = document.getElementById('noResults');
            const paginationContainer = document.getElementById('paginationContainer');

            try {
                // Show loading state
                container.classList.add('table-loading');

                // Get paginated operations
                const response = await db.getOperationsPaginated(filterManager.getCleanFilters());
                
                // Update URL
                filterManager.syncToURL();

                // Display active filters
                displayActiveFilters();

                if (!response || !response.data || response.data.length === 0) {
                    tbody.innerHTML = '';
                    document.getElementById('operationsTable').style.display = 'none';
                    noResults.style.display = 'block';
                    paginationContainer.innerHTML = '';
                } else {
                    document.getElementById('operationsTable').style.display = 'table';
                    noResults.style.display = 'none';

                    // Populate table
                    tbody.innerHTML = response.data.map(op => \`
                        <tr>
                            <td>\${formatDate(op.created_at)}</td>
                            <td>\${op.car_brand} \${op.car_model} \${op.car_year}</td>
                            <td>\${op.oil_used} (\${op.oil_viscosity})</td>
                            <td>\${op.oil_quantity} لتر</td>
                            <td>
                                <span class="badge \${op.is_matching ? 'badge-success' : 'badge-warning'}">
                                    \${op.is_matching ? 'مطابق' : 'غير مطابق'}
                                </span>
                            </td>
                        </tr>
                    \`).join('');

                    // Create pagination
                    const pagination = new PaginationHelper(
                        response.pagination.total,
                        response.pagination.page,
                        response.pagination.limit
                    );

                    const paginationControls = createPaginationControls(pagination, (newPage) => {
                        filterManager.setFilter('page', newPage);
                        loadOperations();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });

                    paginationContainer.innerHTML = '';
                    paginationContainer.appendChild(paginationControls);
                }

            } catch (error) {
                console.error('Error loading operations:', error);
                toast.error('فشل تحميل العمليات');
            } finally {
                container.classList.remove('table-loading');
            }
        }

        function displayActiveFilters() {
            const container = document.getElementById('activeFilters');
            const filters = filterManager.getCleanFilters();
            const chips = [];

            if (filters.search) {
                chips.push(\`
                    <div class="filter-chip">
                        <span>البحث: \${filters.search}</span>
                        <i class="fas fa-times" onclick="removeFilter('search')"></i>
                    </div>
                \`);
            }

            if (filters.branchId) {
                const branch = branches.find(b => b.id === filters.branchId);
                chips.push(\`
                    <div class="filter-chip">
                        <span>الفرع: \${branch ? branch.name : filters.branchId}</span>
                        <i class="fas fa-times" onclick="removeFilter('branchId')"></i>
                    </div>
                \`);
            }

            if (filters.isMatching !== null && filters.isMatching !== undefined) {
                chips.push(\`
                    <div class="filter-chip">
                        <span>الحالة: \${filters.isMatching ? 'مطابق' : 'غير مطابق'}</span>
                        <i class="fas fa-times" onclick="removeFilter('isMatching')"></i>
                    </div>
                \`);
            }

            if (filters.startDate || filters.endDate) {
                const dateText = filters.startDate && filters.endDate 
                    ? \`\${filters.startDate} - \${filters.endDate}\`
                    : filters.startDate || filters.endDate;
                chips.push(\`
                    <div class="filter-chip">
                        <span>التاريخ: \${dateText}</span>
                        <i class="fas fa-times" onclick="removeFilter('date')"></i>
                    </div>
                \`);
            }

            if (chips.length > 0) {
                container.innerHTML = chips.join('');
                container.style.display = 'flex';
            } else {
                container.style.display = 'none';
            }
        }

        function removeFilter(filterType) {
            if (filterType === 'search') {
                filterManager.setFilter('search', '');
                document.getElementById('searchInput').value = '';
            } else if (filterType === 'branchId') {
                filterManager.setFilter('branchId', null);
                document.getElementById('branchFilter').value = '';
            } else if (filterType === 'isMatching') {
                filterManager.setFilter('isMatching', null);
                document.getElementById('matchingFilter').value = '';
            } else if (filterType === 'date') {
                filterManager.setFilters({ startDate: null, endDate: null });
                document.getElementById('startDate').value = '';
                document.getElementById('endDate').value = '';
            }
            loadOperations();
        }

        function exportData(format) {
            const filters = filterManager.getCleanFilters();
            const params = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (key !== 'page' && key !== 'limit') {
                    params.append(key, value);
                }
            });
            
            params.append('format', format);
            
            // Trigger download
            window.location.href = '/api/reports/export?' + params.toString();
        }

        document.getElementById('exportExcelBtn').addEventListener('click', () => exportData('xlsx'));
        document.getElementById('exportCsvBtn').addEventListener('click', () => exportData('csv'));
      `}</Script>
    </>
  )
}
