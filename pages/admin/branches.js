import Head from 'next/head'
import Script from 'next/script'

export default function Branches() {
  return (
    <>
      <Head>
        <title>إدارة الفروع - نظام صيانة السيارات</title>
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
            <a href="/reports"><i className="fas fa-chart-bar"></i> التقارير</a>
            <div className="menu-title">الإدارة</div>
            <a href="/admin/users"><i className="fas fa-users"></i> المستخدمين</a>
            <a href="/admin/branches" className="active"><i className="fas fa-building"></i> الفروع</a>
            <a href="/admin/cars-database"><i className="fas fa-database"></i> قاعدة البيانات</a>
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
            <h1><i className="fas fa-building"></i> إدارة الفروع</h1>
            <button className="btn btn-primary" onClick={() => { }}><i className="fas fa-plus"></i> إضافة فرع</button>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-container">
                <table id="branchesTable">
                  <thead>
                    <tr>
                      <th>اسم الفرع</th>
                      <th>الموقع</th>
                      <th>عدد الموظفين</th>
                      <th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="modal-overlay" id="branchModal">
        <div className="modal">
          <div className="modal-header">
            <h3 id="modalTitle"><i className="fas fa-building"></i> إضافة فرع</h3>
            <button className="close-btn" onClick={() => { }}>&times;</button>
          </div>
          <div className="modal-body">
            <form id="branchForm">
              <input type="hidden" id="branchId" />
              <div className="form-group">
                <label>اسم الفرع</label>
                <input type="text" id="branchName" required />
              </div>
              <div className="form-group">
                <label>الموقع</label>
                <input type="text" id="branchLocation" required />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={() => { }}><i className="fas fa-save"></i> حفظ</button>
            <button className="btn btn-outline" onClick={() => { }}>إلغاء</button>
          </div>
        </div>
      </div>

      <Script src="/js/database-api.js" strategy="beforeInteractive" />
      <Script src="/js/auth-api.js" strategy="beforeInteractive" />
      <Script src="/js/utils.js" strategy="beforeInteractive" />
      <Script id="branches-script" strategy="afterInteractive">{`
        (async function() {
            if (!auth.requireAdmin()) return;
            
            // Wait for DB to be fully initialized
            if (typeof ensureDBInit !== 'undefined') {
                await ensureDBInit();
            } else {
                await new Promise(r => setTimeout(r, 1000));
            }
            
            await loadBranches();
        })();

        async function loadBranches() {
            const branches = await db.getAll('branches');
            const users = await db.getAll('users');
            const tbody = document.querySelector('#branchesTable tbody');

            tbody.innerHTML = branches.map(b => {
                const employeeCount = users.filter(u => u.branch_id === b.id).length;
                return \`<tr>
                    <td>\${b.name}</td>
                    <td>\${b.location}</td>
                    <td>\${employeeCount}</td>
                    <td>
                        <button class="btn btn-outline" onclick="editBranch(\${b.id})" style="padding: 0.5rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger" onclick="deleteBranch(\${b.id})" style="padding: 0.5rem;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>\`;
            }).join('');
        }

        function showAddModal() {
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-building"></i> إضافة فرع';
            document.getElementById('branchForm').reset();
            document.getElementById('branchId').value = '';
            document.getElementById('branchModal').classList.add('show');
        }

        async function editBranch(id) {
            const branch = await db.get('branches', id);
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> تعديل فرع';
            document.getElementById('branchId').value = branch.id;
            document.getElementById('branchName').value = branch.name;
            document.getElementById('branchLocation').value = branch.location;
            document.getElementById('branchModal').classList.add('show');
        }

        function closeModal() { document.getElementById('branchModal').classList.remove('show'); }

        async function saveBranch() {
            const id = document.getElementById('branchId').value;
            const branchData = {
                name: document.getElementById('branchName').value,
                location: document.getElementById('branchLocation').value
            };

            if (id) {
                branchData.id = parseInt(id);
                await db.update('branches', branchData);
                showToast('تم تحديث الفرع', 'success');
            } else {
                await db.add('branches', branchData);
                showToast('تم إضافة الفرع', 'success');
            }
            closeModal();
            await loadBranches();
        }

        async function deleteBranch(id) {
            if (!confirm('هل أنت متأكد من حذف هذا الفرع؟')) return;
            await db.delete('branches', id);
            showToast('تم حذف الفرع', 'success');
            await loadBranches();
        }

        document.querySelector('.page-header .btn-primary').addEventListener('click', showAddModal);
        document.querySelector('.modal-overlay .close-btn').addEventListener('click', closeModal);
        document.querySelectorAll('.modal-footer .btn-outline').forEach(btn => btn.addEventListener('click', closeModal));
        document.querySelectorAll('.modal-footer .btn-success').forEach(btn => btn.addEventListener('click', saveBranch));
      `}</Script>
    </>
  )
}
