import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Lock, Mail, AlertCircle, ArrowRight, Sparkles, Eye, EyeOff, Smartphone } from 'lucide-react';
import { OtpLoginModal } from '../components/auth/OtpLoginModal';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/menu';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both campus email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const result = await login(email, password);
      if (result.success) {
        if (result.user?.role === 'CANTEEN_STAFF') {
          navigate('/staff/orders');
        } else {
          navigate(from === '/login' ? '/menu' : from);
        }
      } else {
        setErrorMsg(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 180px)',
        padding: '2rem 1.25rem'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              backgroundColor: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1rem',
              boxShadow: 'var(--shadow-warm)'
            }}
          >
            <UtensilsCrossed size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            Welcome to CampusBite
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Sign in to pre-order food and track active canteen tokens
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'var(--nonveg-bg)',
              color: 'var(--nonveg-color)',
              border: '1px solid var(--nonveg-border)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem',
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Campus Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                id="email"
                type="email"
                placeholder="student@campusbite.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem' }}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password">
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In with Password'}
            {!loading && <ArrowRight size={18} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0 0.85rem', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <button
            type="button"
            onClick={() => setIsOtpOpen(true)}
            className="btn btn-outline btn-lg"
            style={{
              width: '100%',
              borderColor: '#10b981',
              color: '#047857',
              backgroundColor: '#f0fdf4',
              fontWeight: 700,
              gap: '0.5rem'
            }}
          >
            <Smartphone size={18} color="#059669" /> Verify & Login via Mobile OTP
          </button>
        </form>

        {/* OTP Verification Modal */}
        <OtpLoginModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
        />

        {/* Demo Fast-Fill Shortcut Buttons */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px dashed var(--border)',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Sparkles size={13} color="var(--accent)" /> Quick Demo Logins
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('student@campusbite.edu', 'student123')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.2rem' }}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('faculty@campusbite.edu', 'faculty123')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.2rem' }}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('staff@campusbite.edu', 'staff123')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.2rem', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
            >
              Kitchen Staff
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
