import Head from 'next/head';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 - الصفحة غير موجودة</title>
            </Head>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'var(--bg-secondary)',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    fontSize: '6rem',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                    marginBottom: '1rem'
                }}>
                    404
                </div>
                <h1 style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                }}>
                    الصفحة غير موجودة
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '2rem'
                }}>
                    عذراً، الصفحة التي تبحث عنها غير موجودة
                </p>
                <a
                    href="/dashboard"
                    style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-dark)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary)'}
                >
                    <i className="fas fa-home" style={{ marginLeft: '0.5rem' }}></i>
                    العودة للرئيسية
                </a>
            </div>
        </>
    );
}
