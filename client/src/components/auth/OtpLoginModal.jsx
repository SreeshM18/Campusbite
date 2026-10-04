import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Smartphone, CheckCircle2, ArrowRight, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OtpLoginModal = ({ isOpen, onClose, defaultPhone = '', onSuccess }) => {
  const [step, setStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [phone, setPhone] = useState(defaultPhone || '');
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' | 'FACULTY'
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('9071');
  const [countdown, setCountdown] = useState(30);
  const [showSmsBanner, setShowSmsBanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setStep('PHONE');
      setOtp(['', '', '', '']);
      setErrorMsg('');
      setShowSmsBanner(false);
    }
  }, [isOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Handle sending OTP
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    // Generate random 4-digit code (default or random like 9071)
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);

    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
      setCountdown(30);
      setShowSmsBanner(true);
      setTimeout(() => {
        inputRefs[0]?.current?.focus();
      }, 150);
    }, 600);
  };

  // Handle OTP typing & box traversal
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, '').slice(0, 4).split('');
      const newOtp = ['', '', '', ''];
      digits.forEach((d, idx) => {
        newOtp[idx] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 3);
      inputRefs[nextIdx]?.current?.focus();
      if (digits.length === 4) {
        verifyCode(newOtp.join(''));
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance
    if (digit && index < 3) {
      inputRefs[index + 1]?.current?.focus();
    }

    // Auto verify when all 4 filled
    if (digit && index === 3 && newOtp.every((d) => d !== '')) {
      verifyCode(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  // Verify and login
  const verifyCode = async (enteredCode) => {
    setLoading(true);
    setErrorMsg('');

    // Simulate OTP verification verification delay
    setTimeout(async () => {
      if (enteredCode === generatedOtp || enteredCode === '9071' || enteredCode === '1234') {
        try {
          // Trigger confetti
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });

          const email = `${phone.replace(/\D/g, '')}@campusbite.edu`;
          const result = await login(email, 'otp_verified_session');

          setLoading(false);
          onClose();
          if (onSuccess) {
            onSuccess(result.user);
          } else {
            navigate('/menu');
          }
        } catch {
          // Fallback login succeed in demo
          setLoading(false);
          onClose();
          navigate('/menu');
        }
      } else {
        setLoading(false);
        setErrorMsg('Invalid OTP. Please enter the 4-digit code shown in the SMS banner.');
      }
    }, 700);
  };

  // Quick auto-fill from SMS banner
  const handleAutoFillFromSms = () => {
    const digits = generatedOtp.split('');
    setOtp(digits);
    verifyCode(generatedOtp);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      {/* Interactive SMS Notification Banner */}
      {showSmsBanner && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleAutoFillFromSms();
          }}
          style={{
            position: 'fixed',
            top: 'calc(1rem + env(safe-area-inset-top, 0px))',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 2rem)',
            maxWidth: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '0.85rem 1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            cursor: 'pointer',
            zIndex: 10000,
            animation: 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          title="Click to auto-fill OTP"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}
          >
            <MessageSquare size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em' }}>
                MESSAGES • CAMPUSBITE
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>now</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#334155', margin: 0, lineHeight: 1.3 }}>
              <strong style={{ color: '#0f172a' }}>{generatedOtp}</strong> is your login OTP. Tap to auto-fill securely.
            </p>
          </div>
        </div>
      )}

      {/* Main Bottom Sheet / Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#fffdfa',
          borderRadius: '28px 28px 0 0',
          padding: '1.75rem 1.5rem calc(1.75rem + env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '90dvh',
          overflowY: 'auto'
        }}
      >
        {/* Close Handle Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            cursor: 'pointer'
          }}
          aria-label="Close OTP login"
        >
          <X size={18} />
        </button>

        {/* Hero Illustration & Badge */}
        <div style={{ textAlign: 'center', paddingTop: '0.5rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
              border: '2px solid #ffedd5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              boxShadow: '0 8px 16px -4px rgba(249, 115, 22, 0.2)'
            }}
          >
            <Lock size={30} color="#ea580c" strokeWidth={2.4} />
          </div>

          {/* Glowing Verification Dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '0.75rem' }}>
            <span style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 800 }}>★</span>
            <span style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 800 }}>★</span>
            <span style={{ color: step === 'OTP' ? '#10b981' : '#cbd5e1', fontSize: '1.1rem', fontWeight: 800 }}>★</span>
            <span style={{ color: step === 'OTP' ? '#10b981' : '#cbd5e1', fontSize: '1.1rem', fontWeight: 800 }}>★</span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
            {step === 'PHONE' ? 'Quick OTP Sign In' : 'Verify number securely'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            Your details are safe with us <ShieldCheck size={14} color="#10b981" />
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.65rem 0.85rem',
              borderRadius: '12px',
              fontSize: '0.82rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Enter Phone Number */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Enter Campus Mobile Number
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '0 0.85rem',
                  height: '52px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRight: '1.5px solid #f1f5f9', paddingRight: '0.75rem', marginRight: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>🇮🇳</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={13}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    letterSpacing: '0.04em'
                  }}
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Role Segmented Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Campus Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  style={{
                    height: '42px',
                    borderRadius: '12px',
                    border: role === 'STUDENT' ? '2px solid var(--brand-primary)' : '1px solid #e2e8f0',
                    backgroundColor: role === 'STUDENT' ? 'var(--brand-primary-light)' : '#ffffff',
                    color: role === 'STUDENT' ? 'var(--brand-primary)' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('FACULTY')}
                  style={{
                    height: '42px',
                    borderRadius: '12px',
                    border: role === 'FACULTY' ? '2px solid var(--brand-primary)' : '1px solid #e2e8f0',
                    backgroundColor: role === 'FACULTY' ? 'var(--brand-primary-light)' : '#ffffff',
                    color: role === 'FACULTY' ? 'var(--brand-primary)' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  🏛️ Faculty
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{
                minHeight: '50px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '14px',
                boxShadow: 'var(--shadow-warm)'
              }}
            >
              {loading ? 'Sending SMS OTP...' : 'Get Instant OTP'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        {/* STEP 2: 4-Box OTP Verification */}
        {step === 'OTP' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.2rem' }}>
                Enter 4-digit OTP sent to{' '}
                <strong style={{ color: '#0f172a' }}>+91 {phone.replace(/\D/g, '').slice(-10)}</strong>
              </div>
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#10b981',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Edit Mobile Number
              </button>
            </div>

            {/* 4-Box Inputs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e.target)}
                  style={{
                    width: '60px',
                    height: '64px',
                    borderRadius: '16px',
                    border: digit ? '2px solid #10b981' : '1.5px solid #cbd5e1',
                    backgroundColor: digit ? '#f0fdf4' : '#ffffff',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    color: '#0f172a',
                    boxShadow: digit ? '0 0 0 3px rgba(16, 185, 129, 0.15)' : 'none',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Resend Timer */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              {countdown > 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Resend OTP in{' '}
                  <strong style={{ color: '#ea580c', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                    00 Min {String(countdown).padStart(2, '0')} Sec
                  </strong>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Resend OTP via SMS
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={loading || otp.some((d) => d === '')}
              onClick={() => verifyCode(otp.join(''))}
              className="btn btn-primary btn-block"
              style={{
                minHeight: '50px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '14px',
                boxShadow: 'var(--shadow-warm)'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        )}

        {/* Footer Brand */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            fontSize: '0.75rem',
            color: '#94a3b8'
          }}
        >
          <span>Powered by</span>
          <strong style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Sparkles size={11} color="var(--brand-primary)" /> CampusBite FastPass
          </strong>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
