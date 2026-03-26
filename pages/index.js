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
        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(79, 70, 229, 0.15) 0%, transparent 40%)'
      }}>
        <div className="login-card glass-panel" style={{ 
          borderTop: '5px solid var(--primary)', 
          padding: '3rem 2.5rem', 
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '420px',
          borderRadius: 'var(--radius-xl)'
        }}>
          <div className="login-logo" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <i className="fas fa-car-side" style={{ 
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '4.5rem',
              marginBottom: '1rem',
              display: 'inline-block'
            }}></i>
            <h1 style={{ 
              background: 'var(--gradient-dark)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '0.5rem'
            }}>نظام صيانة السيارات</h1>
            <p style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>مرحباً بك، قم بتسجيل الدخول للمتابعة</p>
          </div>

          <form id="loginForm">
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-light)', fontWeight: 600 }}>اسم المستخدم</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <i className="fas fa-user" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}></i>
                <input type="text" id="username" placeholder="أدخل اسم المستخدم" required style={{ width: '100%', padding: '0.875rem 2.5rem 0.875rem 1rem', border: '2px solid transparent', borderBottom: '2px solid var(--gray-light)', borderRadius: 'var(--radius-sm)', background: 'var(--light)', transition: 'var(--transition)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--dark-light)', fontWeight: 600 }}>كلمة المرور</label>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <i className="fas fa-lock" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}></i>
                <input type="password" id="password" placeholder="أدخل كلمة المرور" required style={{ width: '100%', padding: '0.875rem 2.5rem 0.875rem 1rem', border: '2px solid transparent', borderBottom: '2px solid var(--gray-light)', borderRadius: 'var(--radius-sm)', background: 'var(--light)', transition: 'var(--transition)' }} />
              </div>
            </div>

            <div id="loginError" className="alert alert-danger" style={{ display: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-exclamation-circle"></i>
              <span></span>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ width: '100%', WebkitTextFillColor: 'var(--white)', background: 'var(--gradient-primary)', border: 'none', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)', padding: '1rem', fontSize: '1.1rem' }}>
              <i className="fas fa-sign-in-alt" style={{ marginLeft: '0.5rem' }}></i>
              تسجيل الدخول
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem', background: 'rgba(248, 250, 252, 0.5)', borderRadius: 'var(--radius)', border: '1px dashed var(--gray-light)', color: 'var(--gray)', fontSize: '0.85rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--dark-light)', marginBottom: '0.5rem' }}><i className="fas fa-info-circle"></i> بيانات تجريبية</p>
            <p style={{ marginBottom: '0.25rem' }}>المدير: <strong>admin</strong> / <strong>admin123</strong></p>
            <p>موظف: <strong>employee1</strong> / <strong>123456</strong></p>
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
