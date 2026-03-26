import Head from 'next/head'
import Script from 'next/script'

export default function Login() {
  return (
    <>
      <Head>
        <title>تسجيل الدخول - نظام صيانة السيارات</title>
      </Head>

      <div className="login-page" style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(30, 41, 59, 0.8) 0%, transparent 40%)'
      }}>
        <div className="login-card" style={{ 
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '5px solid #f59e0b', 
          padding: '3rem 2.5rem', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div className="login-logo" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <i className="fas fa-car-side" style={{ 
              color: '#f59e0b',
              fontSize: '4.5rem',
              marginBottom: '1rem',
              display: 'inline-block',
              filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.3))'
            }}></i>
            <h1 style={{ 
              color: '#f8fafc',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>نظام صيانة السيارات</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>مرحباً بك، قم بتسجيل الدخول للمتابعة</p>
          </div>

          <form id="loginForm">
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 600 }}>اسم المستخدم</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <i className="fas fa-user" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }}></i>
                <input type="text" id="username" placeholder="أدخل اسم المستخدم" required style={{ width: '100%', padding: '0.875rem 2.5rem 0.875rem 1rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', background: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', transition: 'all 0.3s' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 600 }}>كلمة المرور</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <i className="fas fa-lock" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b' }}></i>
                <input type="password" id="password" placeholder="أدخل كلمة المرور" required style={{ width: '100%', padding: '0.875rem 2.5rem 0.875rem 1rem', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.5rem', background: 'rgba(15, 23, 42, 0.5)', color: '#f8fafc', transition: 'all 0.3s' }} />
              </div>
            </div>

            <div id="loginError" className="alert alert-danger" style={{ display: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-exclamation-circle"></i>
              <span></span>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ width: '100%', color: '#ffffff', background: '#f59e0b', border: 'none', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)', padding: '1rem', fontSize: '1.1rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
              <i className="fas fa-sign-in-alt" style={{ marginLeft: '0.5rem' }}></i>
              تسجيل الدخول
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.25rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '0.75rem', border: '1px dashed rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.85rem' }}>
            <p style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '0.5rem' }}><i className="fas fa-info-circle"></i> بيانات تجريبية</p>
            <p style={{ marginBottom: '0.25rem' }}>المدير: <strong style={{color: '#f8fafc'}}>admin</strong> / <strong style={{color: '#f8fafc'}}>admin123</strong></p>
            <p>موظف: <strong style={{color: '#f8fafc'}}>employee1</strong> / <strong style={{color: '#f8fafc'}}>123456</strong></p>
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
