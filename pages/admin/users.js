import Head from 'next/head'
import Script from 'next/script'

export default function Users() {
  return (
    <>
      <Head>
        <title>إدارة المستخدمين - نظام صيانة السيارات</title>
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
            <a href="/admin/users" className="active"><i className="fas fa-users"></i> المستخدمين</a>
            <a href="/admin/branches"><i className="fas fa-building"></i> الفروع</a>
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
            <h1><i className="fas fa-users"></i> إدارة المستخدمين</h1>
            <button className="btn btn-primary" onClick={() => { }}><i className="fas fa-plus"></i> إضافة مستخدم</button>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-container">
                <table id="usersTable">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>اسم المستخدم</th>
                      <th>الفرع</th>
                      <th>الدور</th>
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

      <div className="modal-overlay" id="userModal">
        <div className="modal">
          <div className="modal-header">
            <h3 id="modalTitle"><i className="fas fa-user-plus"></i> إضافة مستخدم</h3>
            <button className="close-btn" onClick={() => { }}>&times;</button>
          </div>
          <div className="modal-body">
            <form id="userForm">
              <input type="hidden" id="userId" />
              <div className="form-group">
                <label>الاسم الكامل</label>
                <input type="text" id="userName" required />
              </div>
              <div className="form-group">
                <label>اسم المستخدم</label>
                <input type="text" id="userUsername" required />
              </div>
              <div className="form-group">
                <label>كلمة المرور</label>
                <input type="password" id="userPassword" />
              </div>
              <div className="form-group">
                <label>الفرع</label>
                <select id="userBranch" required></select>
              </div>
              <div className="form-group">
                <label>الدور</label>
                <select id="userRole" required>
                  <option value="employee">موظف</option>
                  <option value="admin">مدير</option>
                </select>
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
      <Script id="users-script" strategy="afterInteractive">{`
        (async function() {
            if (!auth.requireAdmin()) return;
            
            // Wait for DB to be fully initialized
            if (typeof ensureDBInit !== 'undefined') {
                await ensureDBInit();
            } else {
                await new Promise(r => setTimeout(r, 1000));
            }
            
            await loadBranches();
            await loadUsers();
        })();

        async function loadBranches() {
            const branches = await db.getAll('branches');
            document.getElementById('userBranch').innerHTML = branches.map(b => \`<option value="\${b.id}">\${b.name}</option>\`).join('');
        }

        async function loadUsers() {
            const users = await db.getAll('users');
            const branches = await db.getAll('branches');
            const tbody = document.querySelector('#usersTable tbody');

            tbody.innerHTML = users.map(u => {
                const branch = branches.find(b => b.id === u.branch_id);
                return \`<tr>
                    <td>\${u.name}</td>
                    <td>\${u.username}</td>
                    <td>\${branch ? branch.name : '-'}</td>
                    <td><span class="badge \${u.role === 'admin' ? 'badge-info' : 'badge-success'}">\${u.role === 'admin' ? 'مدير' : 'موظف'}</span></td>
                    <td>
                        <button class="btn btn-outline" onclick="editUser(\${u.id})" style="padding: 0.5rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger" onclick="deleteUser(\${u.id})" style="padding: 0.5rem;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>\`;
            }).join('');
        }

        function showAddModal() {
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus"></i> إضافة مستخدم';
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
            document.getElementById('userModal').classList.add('show');
        }

        async function editUser(id) {
            const user = await db.get('users', id);
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-edit"></i> تعديل مستخدم';
            document.getElementById('userId').value = user.id;
            document.getElementById('userName').value = user.name;
            document.getElementById('userUsername').value = user.username;
            document.getElementById('userBranch').value = user.branch_id;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userModal').classList.add('show');
        }

        function closeModal() { document.getElementById('userModal').classList.remove('show'); }

        async function saveUser() {
            const id = document.getElementById('userId').value;
            const userData = {
                name: document.getElementById('userName').value,
                username: document.getElementById('userUsername').value,
                branch_id: parseInt(document.getElementById('userBranch').value),
                role: document.getElementById('userRole').value
            };

            const password = document.getElementById('userPassword').value;
            if (password) userData.password = password;

            if (id) {
                const existing = await db.get('users', parseInt(id));
                if (!password) userData.password = existing.password;
                userData.id = parseInt(id);
                await db.update('users', userData);
                showToast('تم تحديث المستخدم', 'success');
            } else {
                if (!password) { showToast('كلمة المرور مطلوبة', 'warning'); return; }
                userData.password = password;
                await db.add('users', userData);
                showToast('تم إضافة المستخدم', 'success');
            }
            closeModal();
            await loadUsers();
        }

        async function deleteUser(id) {
            if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
            await db.delete('users', id);
            showToast('تم حذف المستخدم', 'success');
            await loadUsers();
        }

        document.querySelector('.page-header .btn-primary').addEventListener('click', showAddModal);
        document.querySelector('.modal-overlay .close-btn').addEventListener('click', closeModal);
        document.querySelectorAll('.modal-footer .btn-outline').forEach(btn => btn.addEventListener('click', closeModal));
        document.querySelectorAll('.modal-footer .btn-success').forEach(btn => btn.addEventListener('click', saveUser));
      `}</Script>
    </>
  )
}
