import Head from 'next/head'
import Script from 'next/script'

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>لوحة التحكم - نظام صيانة السيارات</title>
      </Head>

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <i className="fas fa-car-side"></i>
            <div>
              <h2>صيانة السيارات</h2>
              <span>نظام الإدارة</span>
            </div>
          </div>

          <nav className="sidebar-menu">
            <a href="/dashboard" className="active"><i className="fas fa-home"></i> لوحة التحكم</a>
            <a href="/operation"><i className="fas fa-oil-can"></i> تسجيل عملية</a>
            <a href="/reports"><i className="fas fa-chart-bar"></i> التقارير</a>

            <div className="menu-title admin-only">الإدارة</div>
            <a href="/admin/users" className="admin-only"><i className="fas fa-users"></i> المستخدمين</a>
            <a href="/admin/branches" className="admin-only"><i className="fas fa-building"></i> الفروع</a>
            <a href="/admin/cars-database" className="admin-only"><i className="fas fa-database"></i> قاعدة البيانات</a>
          </nav>

          <div className="sidebar-user" suppressHydrationWarning>
            <div className="avatar" suppressHydrationWarning>م</div>
            <div className="user-info" suppressHydrationWarning>
              <h4 suppressHydrationWarning>اسم المستخدم</h4>
              <span suppressHydrationWarning>الفرع</span>
            </div>
            <button className="logout-btn" title="تسجيل الخروج"><i className="fas fa-sign-out-alt"></i></button>
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
            <h1><i className="fas fa-home"></i> لوحة التحكم</h1>
            <div className="breadcrumb">
              <span>الرئيسية</span>
            </div>
          </div>

          <div className="stats-grid" id="statsGrid">
            <div className="stat-card">
              <div className="icon blue"><i className="fas fa-car"></i></div>
              <div className="info">
                <h4 id="totalOperations">0</h4>
                <p>إجمالي العمليات</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon green"><i className="fas fa-check-circle"></i></div>
              <div className="info">
                <h4 id="matchingOps">0</h4>
                <p>عمليات مطابقة</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon orange"><i className="fas fa-exclamation-triangle"></i></div>
              <div className="info">
                <h4 id="mismatchOps">0</h4>
                <p>غير مطابقة</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon purple"><i className="fas fa-tint"></i></div>
              <div className="info">
                <h4 id="totalOil">0</h4>
                <p>لتر زيت مستخدم</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="dashboard-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-chart-line"></i> العمليات خلال الـ 30 يوم الماضية</h3>
              </div>
              <div className="card-body">
                <canvas id="operationsLineChart" style={{ maxHeight: '300px' }}></canvas>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-chart-pie"></i> توزيع العمليات حسب الفروع</h3>
              </div>
              <div className="card-body">
                <canvas id="branchPieChart" style={{ maxHeight: '300px' }}></canvas>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-chart-bar"></i> أنواع الزيوت الأكثر استخداماً</h3>
              </div>
              <div className="card-body">
                <canvas id="oilTypesBarChart" style={{ maxHeight: '300px' }}></canvas>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3><i className="fas fa-tachometer-alt"></i> توزيع اللزوجة</h3>
              </div>
              <div className="card-body">
                <canvas id="viscosityDoughnutChart" style={{ maxHeight: '300px' }}></canvas>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h3><i className="fas fa-bolt"></i> إجراءات سريعة</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="/operation" className="btn btn-primary">
                <i className="fas fa-plus"></i> تسجيل عملية جديدة
              </a>
              <a href="/reports" className="btn btn-outline">
                <i className="fas fa-file-alt"></i> عرض التقارير
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3><i className="fas fa-history"></i> آخر العمليات</h3>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table id="recentOperations">
                  <thead>
                    <tr>
                      <th>التاريخ</th>
                      <th>السيارة</th>
                      <th>الزيت</th>
                      <th>الكمية</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
              <div id="emptyState" className="empty-state" style={{ display: 'none' }}>
                <i className="fas fa-inbox"></i>
                <h3>لا توجد عمليات</h3>
                <p>ابدأ بتسجيل أول عملية صيانة</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" strategy="beforeInteractive" />
      <Script src="/js/database-api.js" strategy="beforeInteractive" />
      <Script src="/js/auth-api.js" strategy="beforeInteractive" />
      <Script src="/js/utils.js" strategy="beforeInteractive" />
      <Script src="/js/chart-utils.js" strategy="beforeInteractive" />
      <Script src="/js/mobile-menu.js" strategy="afterInteractive" />
      <Script id="dashboard-script" strategy="afterInteractive">{`
        // Global chart instances
        let charts = {
          timeline: null,
          branch: null,
          oilTypes: null,
          viscosity: null
        };

        // Protect page and load data
        (async function() {
            if (!auth.requireAuth()) return;

            // Wait for DB to be fully initialized
            if (typeof ensureDBInit !== 'undefined') {
                await ensureDBInit();
            } else {
                await new Promise(r => setTimeout(r, 1000));
            }

            await loadDashboardData();
            
            // Auto-refresh every 30 seconds
            setInterval(loadDashboardData, 30000);
        })();

        async function loadDashboardData() {
            await Promise.all([
                loadStats(),
                loadCharts(),
                loadRecentOperations()
            ]);
        }

        async function loadStats() {
            try {
                const stats = await db.getReportStats();
                document.getElementById('totalOperations').textContent = formatNumber(stats.totalOperations);
                document.getElementById('matchingOps').textContent = formatNumber(stats.matchingOperations);
                document.getElementById('mismatchOps').textContent = formatNumber(stats.mismatchedOperations);
                document.getElementById('totalOil').textContent = formatNumber(stats.totalOilUsed);
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }

        async function loadCharts() {
            try {
                const data = await db.fetchWithAuth('/api/reports/trends?days=30');

                // Destroy existing charts
                if (charts.timeline) charts.timeline.destroy();
                if (charts.branch) charts.branch.destroy();
                if (charts.oilTypes) charts.oilTypes.destroy();
                if (charts.viscosity) charts.viscosity.destroy();

                // Create charts
                charts.timeline = createOperationsLineChart('operationsLineChart', data.timeline);
                charts.branch = createBranchPieChart('branchPieChart', data.branches);
                charts.oilTypes = createOilTypesBarChart('oilTypesBarChart', data.oilTypes);
                charts.viscosity = createViscosityDoughnutChart('viscosityDoughnutChart', data.viscosity);

            } catch (error) {
                console.error('Error loading charts:', error);
            }
        }

        async function loadRecentOperations() {
            try {
                const operations = await db.getAll('operations');
                const tbody = document.querySelector('#recentOperations tbody');
                const emptyState = document.getElementById('emptyState');

                if (operations.length === 0) {
                    document.querySelector('#recentOperations').style.display = 'none';
                    emptyState.style.display = 'block';
                    return;
                }

                const recent = operations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 10);

                tbody.innerHTML = recent.map(op => \`
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
            } catch (error) {
                console.error('Error loading recent operations:', error);
            }
        }
      `}</Script>
    </>
  )
}
