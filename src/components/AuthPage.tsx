import React, { useState } from 'react';
import { useCampusFind } from '../context/CampusFindContext';
import { UserRole } from '../types';
import { Lock, Mail, User, Phone, Building, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthPageProps {
  defaultMode: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultMode }) => {
  const { login, register, users, quickLoginAs } = useCampusFind();

  const mode = defaultMode;
  const goHome = () => { window.location.href = '/'; };
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

    if (!regFullName.trim() || !regEmail.trim() || !regUniversityId.trim() || !regDepartment.trim()) {
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
      password: regPassword || 'password123',
      role: regRole,
      universityId: regUniversityId.trim(),
      departmentOrCollege: regDepartment.trim(),
      contactNumber: regContactNumber.trim() || '+63 900 000 0000',
    });

    if (res.success) {
      setSuccessMessage('Registration successful! Redirecting to your dashboard...');
      setTimeout(() => {
        goHome();
      }, 700);
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  return (
  <div
  className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 py-10"
  style={{
    backgroundImage: "url('/assets/lcup.png')",
  }}
>
  
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#080D91] text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/image_f30422a8.png"
              alt="LCUP Seal"
              className="w-10 h-10 object-contain drop-shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                CampusFind Portal
              </h2>
              <p className="text-xs text-blue-100">La Consolacion University Philippines</p>
            </div>
          </div>
          <a href="/" className="text-xs text-white/80 hover:text-white underline underline-offset-4">Back to Home</a>
        </div>

        <div className="px-6 pt-6 pb-2">
          <h1 className="text-xl font-bold text-slate-900">{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h1>
          <p className="text-sm text-slate-500 mt-1">{mode === 'login' ? 'Sign in to access the CampusFind portal.' : 'Register to use the LCUP CampusFind portal.'}</p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. maria.santos@lcup.edu.ph"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#080D91] hover:bg-[#060a75] text-white rounded-lg font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Fast 1-Click Demo Accounts */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Or 1-Click Sign In as Demo Persona:
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
                      className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#080D91] hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-[#080D91] truncate">
                          {u.fullName.split(' ')[0]} {u.fullName.split(' ')[1]?.[0]}.
                        </span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'faculty'
                            ? 'bg-blue-100 text-blue-800'
                            : u.role === 'staff'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{u.departmentOrCollege}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Gabriel A. Mendoza"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role Category *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91] bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="staff">University Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    University ID Number *
                  </label>
                  <input
                    type="text"
                    value={regUniversityId}
                    onChange={(e) => setRegUniversityId(e.target.value)}
                    placeholder="e.g. 2024-19842"
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College or Department *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    placeholder="e.g. College of Computer Studies"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. gabriel.mendoza@lcup.edu.ph"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={regContactNumber}
                      onChange={(e) => setRegContactNumber(e.target.value)}
                      placeholder="+63 912 345 6789"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 chars"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#080D91]/20 focus:border-[#080D91]"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#080D91] hover:bg-[#060a75] text-white rounded-lg font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-600 mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <a href={mode === 'login' ? '/register' : '/login'} className="font-bold text-[#080D91] hover:underline">
              {mode === 'login' ? 'Create Account' : 'Sign In'}
            </a>
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-5">© {new Date().getFullYear()} La Consolacion University Philippines</p>
    </div>
  );
};
