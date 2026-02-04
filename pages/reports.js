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

        <main className="main-content">
          <div className="page-header">
            <div>
              <h1><i className="fas fa-chart-bar"></i> التقارير</h1>
              <div className="breadcrumb"><a href="/dashboard">الرئيسية</a> / <span>التقارير</span></div>
            </div>
            <div style={{display: 'flex', gap: '0.75rem'}}>
              <button className="btn btn-success" onClick={() => {}}>
                <i className="fas fa-file-pdf"></i> تصدير التقرير
              </button>
              <button className="btn btn-outline" onClick={() => {}}>
                <i className="fas fa-list"></i> تصدير العمليات
              </button>
            </div>
          </div>

          <div className="report-filters">
            <div className="filter-group">
              <label>الفرع</label>
              <select id="branchFilter">
                <option value="">جميع الفروع</option>
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
            <div className="filter-group" style={{display: 'flex', alignItems: 'flex-end'}}>
              <button className="btn btn-primary" onClick={() => {}}><i className="fas fa-filter"></i> تطبيق</button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="icon blue"><i className="fas fa-car"></i></div>
              <div className="info">
                <h4 id="totalOps">0</h4>
                <p>إجمالي العمليات</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon green"><i className="fas fa-check"></i></div>
              <div className="info">
                <h4 id="matchOps">0</h4>
                <p>مطابقة</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon orange"><i className="fas fa-exclamation"></i></div>
              <div className="info">
                <h4 id="mismatchOps">0</h4>
                <p>غير مطابقة</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon purple"><i className="fas fa-tint"></i></div>
              <div className="info">
                <h4 id="totalOil">0</h4>
                <p>لتر زيت</p>
              </div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem'}}>
            <div className="card report-card">
              <div className="card-header">
                <h3><i className="fas fa-building"></i> السيارات لكل فرع</h3>
              </div>
              <div className="card-body" style={{padding: 0}}>
                <div id="branchStats"></div>
              </div>
            </div>

            <div className="card report-card">
              <div className="card-header">
                <h3><i className="fas fa-oil-can"></i> أنواع الزيوت المستخدمة</h3>
              </div>
              <div className="card-body" style={{padding: 0}}>
                <div id="oilStats"></div>
              </div>
            </div>

            <div className="card report-card">
              <div className="card-header">
                <h3><i className="fas fa-thermometer-half"></i> لزوجة الزيوت</h3>
              </div>
              <div className="card-body" style={{padding: 0}}>
                <div id="viscosityStats"></div>
              </div>
            </div>

            <div className="card report-card">
              <div className="card-header">
                <h3><i className="fas fa-filter"></i> استهلاك الفلاتر</h3>
              </div>
              <div className="card-body" style={{padding: 0}}>
                <div id="filterStats"></div>
              </div>
            </div>
          </div>

          <div className="card report-card" style={{marginTop: '1.5rem'}}>
            <div className="card-header">
              <h3><i className="fas fa-exclamation-triangle" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}></i> العمليات غير المطابقة</h3>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table id="mismatchTable">
                  <thead>
                    <tr>
                      <th>التاريخ</th>
                      <th>السيارة</th>
                      <th>الزيت</th>
                      <th>السبب</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
              <div id="noMismatch" className="empty-state" style={{display: 'none'}}>
                <i className="fas fa-check-circle" style={{color: 'var(--success)'}}></i>
                <h3>ممتاز! لا توجد عمليات غير مطابقة</h3>
                <p>جميع العمليات تتوافق مع المعايير المقترحة</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <button className="mobile-menu-btn"><i className="fas fa-bars"></i></button>

      <Script src="/js/database-api.js" strategy="beforeInteractive" />
      <Script src="/js/auth-api.js" strategy="beforeInteractive" />
      <Script src="/js/utils.js" strategy="beforeInteractive" />
      <Script src="/js/pdf-export.js" strategy="beforeInteractive" />
      <Script id="reports-script" strategy="afterInteractive">{`
        (async function() {
            if (!auth.requireAuth()) return;
            
            // Wait for DB to be fully initialized
            if (typeof ensureDBInit !== 'undefined') {
                await ensureDBInit();
            } else {
                await new Promise(r => setTimeout(r, 1000));
            }
            
            await loadBranches();
            await loadReports();
        })();

        async function loadBranches() {
            const branches = await db.getAll('branches');
            const select = document.getElementById('branchFilter');
            branches.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.id;
                opt.textContent = b.name;
                select.appendChild(opt);
            });
        }

        async function applyFilters() {
            await loadReports();
        }

        async function loadReports() {
            const branchId = document.getElementById('branchFilter').value || null;
            const startDate = document.getElementById('startDate').value || null;
            const endDate = document.getElementById('endDate').value || null;

            const stats = await db.getReportStats(branchId ? parseInt(branchId) : null, startDate, endDate);

            document.getElementById('totalOps').textContent = formatNumber(stats.totalOperations);
            document.getElementById('matchOps').textContent = formatNumber(stats.matchingOperations);
            document.getElementById('mismatchOps').textContent = formatNumber(stats.mismatchedOperations);
            document.getElementById('totalOil').textContent = formatNumber(stats.totalOilUsed);

            const branchCounts = await db.getCarCountByBranch();
            document.getElementById('branchStats').innerHTML = Object.entries(branchCounts).map(([name, count]) => \`
                <div class="data-list-item">
                    <div class="label"><i class="fas fa-store"></i> \${name}</div>
                    <div class="value">\${count} عملية</div>
                </div>\`).join('') || '<p style="padding: 1.5rem; color: var(--gray); text-align: center;">لا توجد بيانات</p>';

            document.getElementById('oilStats').innerHTML = Object.entries(stats.oilTypes).map(([type, count]) => \`
                <div class="data-list-item">
                    <div class="label"><i class="fas fa-tint"></i> \${type}</div>
                    <div class="value">\${count} مرة</div>
                </div>\`).join('') || '<p style="padding: 1.5rem; color: var(--gray); text-align: center;">لا توجد بيانات</p>';

            document.getElementById('viscosityStats').innerHTML = Object.entries(stats.viscosities).map(([visc, count]) => \`
                <div class="data-list-item">
                    <div class="label"><i class="fas fa-thermometer-half"></i> \${visc}</div>
                    <div class="value">\${count} مرة</div>
                </div>\`).join('') || '<p style="padding: 1.5rem; color: var(--gray); text-align: center;">لا توجد بيانات</p>';

            document.getElementById('filterStats').innerHTML = \`
                <div class="data-list-item">
                    <div class="label"><i class="fas fa-filter"></i> فلتر الزيت</div>
                    <div class="value">\${stats.filters.oil}</div>
                </div>
                <div class="data-list-item">
                    <div class="label"><i class="fas fa-wind"></i> فلتر الهواء</div>
                    <div class="value">\${stats.filters.air}</div>
                </div>
                <div class="data-list-item">
                    <div class="label"><i class="fas fa-snowflake"></i> فلتر التبريد</div>
                    <div class="value">\${stats.filters.cooling}</div>
                </div>\`;

            const mismatched = await db.getMismatchedOperations();
            const tbody = document.querySelector('#mismatchTable tbody');

            if (mismatched.length === 0) {
                document.getElementById('mismatchTable').style.display = 'none';
                document.getElementById('noMismatch').style.display = 'block';
            } else {
                tbody.innerHTML = mismatched.map(op => \`
                    <tr>
                        <td>\${formatDate(op.created_at)}</td>
                        <td>\${op.car_brand} \${op.car_model} \${op.car_year}</td>
                        <td>\${op.oil_used} (\${op.oil_viscosity})</td>
                        <td>\${op.mismatch_reason || '-'}</td>
                    </tr>\`).join('');
            }
        }

        document.querySelector('.page-header .btn-success').addEventListener('click', exportReportToPDF);
        document.querySelector('.page-header .btn-outline').addEventListener('click', exportOperationsToPDF);
        document.querySelector('.report-filters .btn-primary').addEventListener('click', applyFilters);
      `}</Script>
    </>
  )
}
