import { useState, FormEvent, ChangeEvent } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { AiOutlineWarning } from 'react-icons/ai';
import { IoMdCheckmark } from 'react-icons/io';
import Simplypeople from './assets/simplypeope.png';
import Simplylogo from './assets/logosimply.png';

const API = import.meta.env.VITE_API_URL;
interface LoginForm { email: string; password: string; }
interface FieldErrors { email?: string; password?: string; }
interface StaffResponse { id: number; name: string; email: string; role: 'superAdmin' | 'admin' | 'staff'; }
interface LoginApiResponse { success: boolean; message?: string; accessToken: string; staff: StaffResponse; }

const Spinner = () => (
  <span className="block w-[17px] h-[17px] border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
);

const inputClass = (hasError: boolean) =>
  [
    'w-full h-12 border rounded-[4px] text-[13.5px] text-gray-900 font-sans bg-white outline-none transition-all duration-150 placeholder:text-gray-400 pl-[10px] pr-3',
    hasError
      ? 'border-red-400 input-ring-error'
      : 'border-gray-300 focus:border-brand focus:input-ring-brand',
  ].join(' ');

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalErr, setGlobalErr] = useState('');
  const [fieldErr, setFieldErr] = useState<FieldErrors>({});

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!form.email.trim()) errors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email.';
    if (!form.password) errors.password = 'Password is required.';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    return errors;
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (fieldErr[name as keyof FieldErrors]) setFieldErr(prev => ({ ...prev, [name]: '' }));
    if (globalErr) setGlobalErr('');
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) { setFieldErr(errors); return; }

    setLoading(true);
    setGlobalErr('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data: LoginApiResponse = await res.json();
      if (!res.ok) { setGlobalErr(data.message ?? 'Invalid email or password.'); return; }

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('ta_token', data.accessToken);
      storage.setItem('ta_user', JSON.stringify(data.staff));
      alert(`Welcome back, ${data.staff.name}! (Role: ${data.staff.role})`);
    } catch {
      setGlobalErr('Cannot reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCFCFC]">
      <aside className="hidden lg:flex flex-col w-[45%] min-h-screen bg-[#F0EEFF] border-r border-[#DDD6FE] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(107,33,168,0.07) 0%, transparent 70%)' }} />
        <div className="relative z-10 pt-6 pl-11">
          <img src={Simplylogo} alt="Logo" className="w-[198px] h-[97px] object-contain" />
        </div>
        <div className="flex flex-1 items-center justify-center px-[45px] relative z-10">
          <img src={Simplypeople} alt="People" className="w-full max-w-[626px] h-[417px] object-cover rounded-[20px] shadow-lg" />
        </div>
        <div className="text-center px-[45px] pb-8 relative z-10">
          <p className="font-lora font-bold text-[20px] text-[#61227D] leading-snug">Team Achieve</p>
          <p className="mt-1 text-[13px] text-[#5E5E5E] leading-relaxed">Your perfect solution for funding your desires</p>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center min-h-screen bg-[#FCFCFC]">
        <div className="w-full flex justify-center" style={{ paddingTop: 0 }}>
          <div className="w-full animate-fadeUp max-w-[620px] px-8">
            <div className="flex flex-col items-center gap-2 mb-8 lg:hidden">
              <img src={Simplylogo} alt="Logo" className="w-[160px] object-contain" />
            </div>
            <div className="mb-6">
              <h1 className="font-lora font-bold text-gray-900 text-[32px] leading-[48px]">Welcome Back</h1>
              <p className="text-gray-500 mt-1 text-[13.5px] leading-6 max-w-[360px]">Enter your email address and password to access your account.</p>
            </div>

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">

              {globalErr && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 font-medium p-2.5 rounded animate-shake text-[13px]">
                  <AiOutlineWarning className="shrink-0 mt-px" />{globalErr}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="font-medium text-gray-800 text-[13.5px]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={onChange}
                  disabled={loading}
                  className={inputClass(!!fieldErr.email)}
                />
                {fieldErr.email && <span className="text-red-500 text-[11.5px]">{fieldErr.email}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="font-medium text-gray-800 text-[13.5px]">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={onChange}
                    disabled={loading}
                    className={`${inputClass(!!fieldErr.password)} !pr-12`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPwd(v => !v)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                    className="absolute right-0 top-0 h-full w-12 flex items-center justify-center rounded-r bg-[#C6C6C6] text-gray-700 hover:bg-[#B3B3B3] transition-colors duration-150"
                  >
                    {showPwd ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
                  </button>
                </div>
                {fieldErr.password && <span className="text-red-500 text-[11.5px]">{fieldErr.password}</span>}
              </div>

              <div className="flex items-center justify-between -mt-1.5 text-[13px] text-gray-500">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    role="checkbox"
                    aria-checked={remember}
                    tabIndex={0}
                    onClick={() => setRemember(v => !v)}
                    onKeyDown={e => e.key === ' ' && setRemember(v => !v)}
                    className={`border flex items-center justify-center w-[15px] h-[15px] rounded-[3px] transition-all duration-150 ${remember ? 'bg-brand border-brand' : 'bg-white border-gray-300'}`}
                  >
                    {remember && <IoMdCheckmark size={12} color="white" />}
                  </div>
                  Remember me
                </label>
                <button type="button" className="font-medium text-brand hover:opacity-70">Forgot Password?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 text-white font-semibold bg-[#61227D] hover:bg-brand-dark active:scale-[0.988] transition-all duration-200 shadow-btn hover:shadow-btn-hover disabled:opacity-70 disabled:cursor-not-allowed h-12 rounded-[4px] text-[14.5px]"
              >
                {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
              </button>

              <p className="text-center text-gray-500 text-[13px] mt-[-4px]">
                Don't have an account?{' '}
                <button type="button" className="font-semibold text-brand hover:opacity-70">Sign up</button>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}