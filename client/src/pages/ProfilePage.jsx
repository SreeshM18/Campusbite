import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatFullDateTime } from '../utils/formatters';
import {
  User,
  Mail,
  Shield,
  Lock,
  Calendar,
  LogOut,
  Edit2,
  Check,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ChefHat,
  GraduationCap,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  // Name Editing State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');

  // Password Changing State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  if (!user) return null;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || nameInput.trim().length < 2) {
      setNameError('Name must be at least 2 characters long.');
      return;
    }

    try {
      setNameLoading(true);
      setNameError('');
      setNameSuccess('');
      const res = await updateProfile({ name: nameInput.trim() });
      if (res.success) {
        setNameSuccess('Name updated successfully!');
        setIsEditingName(false);
        setTimeout(() => setNameSuccess(''), 3500);
      } else {
        setNameError(res.error || 'Failed to update name.');
      }
    } catch (err) {
      setNameError(err.message || 'Server error while updating name.');
    } finally {
      setNameLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordSuccess('Password updated successfully! Your account is secure.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 4500);
      } else {
        setPasswordError(res.error || 'Failed to change password.');
      }
    } catch (err) {
      setPasswordError(err.message || 'Server error while updating password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Role metadata
  const isStaff = user.role === 'CANTEEN_STAFF';
  const isFaculty = user.role === 'FACULTY';
  const roleLabel = isStaff ? 'Canteen Staff' : isFaculty ? 'Faculty / Employee' : 'Student';
  const RoleIcon = isStaff ? ChefHat : isFaculty ? Briefcase : GraduationCap;
  const roleColor = isStaff ? '#e65100' : isFaculty ? '#2563eb' : '#16a34a';

  return (
    <div style={{ maxWidth: '840px', margin: '2rem auto', padding: '0 1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Profile Header Hero */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #cbd5e1',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Avatar with Initials */}
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              fontSize: '1.75rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(230, 81, 0, 0.2)'
            }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {user.name}
              </h1>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.15rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: isStaff ? '#fff7ed' : isFaculty ? '#eff6ff' : '#f0fdf4',
                  color: roleColor,
                  border: `1px solid ${isStaff ? '#ffedd5' : isFaculty ? '#dbeafe' : '#dcfce7'}`
                }}
              >
                <RoleIcon size={13} />
                <span>{roleLabel}</span>
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={13} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        {/* Quick Staff Jump (if staff) or Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isStaff && (
            <Link to="/staff/orders" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
              <ChefHat size={15} />
              <span>Kitchen Dashboard</span>
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444', gap: '0.35rem' }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Global Success / Alert Feedback */}
      {nameSuccess && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{nameSuccess}</span>
        </div>
      )}

      {/* 2. Personal Information Section */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #cbd5e1'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--color-brand-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Personal Information
            </h2>
          </div>

          {!isEditingName && (
            <button
              type="button"
              onClick={() => {
                setNameInput(user.name);
                setIsEditingName(true);
                setNameError('');
              }}
              className="btn btn-ghost btn-sm"
              style={{ color: '#2563eb', gap: '0.35rem' }}
            >
              <Edit2 size={14} />
              <span>Edit Name</span>
            </button>
          )}
        </div>

        {isEditingName ? (
          <form onSubmit={handleUpdateName} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="input"
                style={{ maxWidth: '400px' }}
                required
                autoFocus
              />
              {nameError && (
                <span style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.25rem', display: 'block' }}>
                  {nameError}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="submit"
                disabled={nameLoading}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <Check size={14} />
                <span>{nameLoading ? 'Saving...' : 'Save Name'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                disabled={nameLoading}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Full Name
              </span>
              <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>{user.name}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Campus Email (Read-Only)
              </span>
              <span style={{ fontSize: '0.95rem', color: '#334155' }}>{user.email}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Account Created
              </span>
              <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                {user.createdAt ? formatFullDateTime(user.createdAt) : 'Active Member'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Security & Password Management Section */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #cbd5e1'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
          <Shield size={18} color="var(--color-brand-primary)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Security & Password
          </h2>
        </div>

        {passwordSuccess && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem',
              marginBottom: '1.25rem'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem',
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle size={18} />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', maxWidth: '440px' }}>
          
          {/* Current Password */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
              Current Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input"
                style={{ paddingRight: '2.5rem' }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                aria-label="Toggle password visibility"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
              New Password (min 8 characters) *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                style={{ paddingRight: '2.5rem' }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                aria-label="Toggle password visibility"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
              Confirm New Password *
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="btn btn-primary"
            style={{ marginTop: '0.5rem', alignSelf: 'flex-start', minWidth: '160px' }}
          >
            {passwordLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

    </div>
  );
};
