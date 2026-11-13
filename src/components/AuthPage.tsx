
import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { UserRole } from '../types';
import {
  Lock,
  Mail,
  User,
  Phone,
  Building,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface AuthPageProps {
  defaultMode: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultMode }) => {
  const { login, register, users, quickLoginAs } = useCampusFind();

  const mode = defaultMode;
  const goHome = () => {
    window.location.href = '/';
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Registration state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regUniversityId, setRegUniversityId] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regContactNumber, setRegContactNumber] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your university email address.');
      return;
    }

    const res = login(email, password);

    if (res.success) {
      goHome();
    } else {
      setErrorMessage(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !regFullName.trim() ||
      !regEmail.trim() ||
      !regUniversityId.trim() ||
      !regDepartment.trim() ||
      !regPassword.trim()
    ) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (!regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const res = register({
      fullName: regFullName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword,
      role: regRole,
      universityId: regUniversityId.trim(),
      departmentOrCollege: regDepartment.trim(),
      contactNumber: regContactNumber.trim() || '+63 900 000 0000',
    });

    if (res.success) {
      setSuccessMessage(
        'Registration successful! Redirecting to your dashboard...'
      );

      setTimeout(() => {
        goHome();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  const inputClass =
    'w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91] transition';

  const labelClass =
    'block text-xs font-semibold text-slate-700 mb-1.5';

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: "url('/assets/lcup.png')",
      }}
    >
      {/* Main Layout */}
      <div className="w-full max-w-6xl min-h-[650px] lg:min-h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT PANEL */}
        <section className="relative bg-[#080D91] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-hidden min-h-[280px] lg:min-h-full">

          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_f30422a8.png"
                alt="LCUP Seal"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  CampusFind
                </h2>
                <p className="text-xs text-blue-100">
                  La Consolacion University Philippines
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 my-10 lg:my-0">
            <p className="text-xs uppercase tracking-[0.25em] text-blue-200 font-semibold mb-5">
              Your Campus. Your Community.
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
              Lost something?
              <br />
              Found something?
            </h1>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-md">
              Report missing belongings, share found items, and help reunite
              lost belongings with their rightful owners around campus.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <div className="w-10 h-1 bg-white rounded-full" />
              <div className="w-3 h-1 bg-white/40 rounded-full" />
              <div className="w-3 h-1 bg-white/40 rounded-full" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-blue-200">
            <span>© {new Date().getFullYear()} CampusFind</span>
            <span>La Consolacion University Philippines</span>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="bg-white flex flex-col justify-center px-6 py-9 sm:px-10 lg:px-12 lg:py-10">

          {/* Header */}
          <div className="mb-7">
            <a
              href="/"
              className="text-xs text-slate-500 hover:text-[#080D91] transition-colors inline-flex items-center gap-1 mb-6"
            >
              ← Back to Home
            </a>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              {mode === 'login'
                ? 'Sign in to access your CampusFind account.'
                : 'Join the CampusFind community at LCUP.'}
            </p>
          </div>

          {/* Notifications */}
          {errorMessage && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <div>
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>
                    Institutional Email Address
                  </label>

                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. maria.santos@lcup.edu.ph"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Password</label>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#080D91] hover:bg-[#060a75] text-white rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-7 pt-6 border-t border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Quick Demo Access
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        quickLoginAs(u.id);
                        goHome();
                      }}
                      className="text-left p-3 rounded-lg border border-slate-200 hover:border-[#080D91] hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-[#080D91] truncate">
                          {u.fullName.split(' ')[0]} {u.fullName.split(' ')[1]?.[0]}.
                        </span>

                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : u.role === 'faculty'
                              ? 'bg-blue-100 text-blue-800'
                              : u.role === 'staff'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 truncate mt-1">
                        {u.departmentOrCollege}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (

            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">

              <div>
                <label className={labelClass}>Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Gabriel A. Mendoza"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Role Category *</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="staff">University Staff</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>University ID Number *</label>
                  <input
                    type="text"
                    value={regUniversityId}
                    onChange={(e) => setRegUniversityId(e.target.value)}
                    placeholder="e.g. 2024-19842"
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>College or Department *</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. College of Computer Studies"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Institutional Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. gabriel.mendoza@lcup.edu.ph"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Contact Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={regContactNumber}
                      onChange={(e) => setRegContactNumber(e.target.value)}
                      placeholder="+63 912 345 6789"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Enter password"
                      minLength={6}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-3 py-3 bg-[#080D91] hover:bg-[#060a75] text-white rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Switch Login / Register */}
          <p className="text-center text-xs text-slate-600 mt-7">
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}{' '}
            <a
              href={mode === 'login' ? '/register' : '/login'}
              className="font-bold text-[#080D91] hover:underline"
            >
              {mode === 'login' ? 'Create Account' : 'Sign In'}
            </a>
          </p>

        </section>
      </div>
    </div>
  );
};
