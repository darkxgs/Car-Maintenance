import Head from 'next/head'
import Script from 'next/script'

export default function Login() {
  return (
    <>
      <Head>
        <title>تسجيل الدخول - نظام صيانة السيارات</title>
      </Head>

      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <i className="fas fa-car-side"></i>
            <h1>نظام صيانة السيارات</h1>
            <p>مرحباً بك، قم بتسجيل الدخول للمتابعة</p>
          </div>

          <form id="loginForm">
            <div className="form-group">
              <label>اسم المستخدم</label>
              <div className="input-wrapper">
                <i className="fas fa-user"></i>
                <input type="text" id="username" placeholder="أدخل اسم المستخدم" required />
              </div>
            </div>

            <div className="form-group">
              <label>كلمة المرور</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input type="password" id="password" placeholder="أدخل كلمة المرور" required />
              </div>
            </div>

            <div id="loginError" className="alert alert-danger" style={{ display: 'none' }}>
              <i className="fas fa-exclamation-circle"></i>
              <span></span>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              <i className="fas fa-sign-in-alt"></i>
              تسجيل الدخول
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray)', fontSize: '0.85rem' }}>
            <p>بيانات تجريبية:</p>
            <p>المدير: admin / admin123</p>
            <p>موظف: employee1 / 123456</p>
          </div>
        </div>
      </div>

      <Script src="/js/database-api.js" strategy="beforeInteractive" />
      <Script src="/js/auth-api.js" strategy="beforeInteractive" />
      <Script id="login-script" strategy="lazyOnload">{`
        // Check if already logged in
        if (auth.isLoggedIn()) {
            window.location.href = '/dashboard';
        }

        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');
            const btn = e.target.querySelector('button');
            
            btn.disabled = true;
            btn.innerHTML = '<span class="loading"></span> جاري التحقق...';
            errorDiv.style.display = 'none';

            try {
                // Wait for database to initialize
                if (typeof ensureDBInit !== 'undefined') {
                    await ensureDBInit();
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
                await auth.login(username, password);
                window.location.href = '/dashboard';
            } catch (error) {
                errorDiv.querySelector('span').textContent = error.message;
                errorDiv.style.display = 'flex';
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
            }
        });
      `}</Script>
    </>
  )
}
