import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { api, ApiError } from '../../services/api';
import { signInWithGoogle } from '../../services/firebase';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../../components/LanguageSelector';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    currentUser,
    setActiveRole, 
    setIsAuthenticated, 
    setCurrentUser, 
    refreshData, 
    isAuthenticated, 
    activeRole,
    isLoading: isSessionLoading
  } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const roleParam = searchParams.get('role');

  // Pre-select role if URL explicitly indicates worker or employer context
  const initialRole: 'worker' | 'contractor' | null = 
    roleParam === 'employer' || roleParam === 'contractor' 
      ? 'contractor' 
      : roleParam === 'worker' || redirectParam?.startsWith('/build-passport')
        ? 'worker'
        : null;

  const [selectedRole, setSelectedRole] = useState<'worker' | 'contractor' | null>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // Existing authenticated users enter their respective portal directly
  React.useEffect(() => {
    if (!isSessionLoading && isAuthenticated) {
      if (activeRole === 'contractor') {
        navigate('/contractor', { replace: true });
      } else if (redirectParam === '/build-passport' || redirectParam?.startsWith('/build-passport')) {
        navigate('/build-passport', { replace: true });
      } else if (currentUser && currentUser.onboarding_completed === false) {
        navigate('/build-passport', { replace: true });
      } else {
        navigate('/worker', { replace: true });
      }
    }
  }, [isAuthenticated, isSessionLoading, activeRole, redirectParam, currentUser, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMessage(t('login.enterCredentials'));
      return;
    }

    setIsLoading(true);

    try {
      const authRes = await api.login({
        email: cleanEmail,
        password,
      });

      // Save token and worker identity
      localStorage.setItem('vouch_auth_token', authRes.token);
      localStorage.setItem('vouch_user_email', authRes.email);
      if (authRes.worker_id) {
        localStorage.setItem('vouch_active_worker_id', authRes.worker_id);
      }

      const isNewOrIncomplete = Boolean(authRes.is_new_user || authRes.onboarding_completed === false);

      setCurrentUser({
        user_id: authRes.user_id,
        name: authRes.name,
        email: authRes.email,
        role: authRes.role,
        worker_id: authRes.worker_id,
        onboarding_completed: !isNewOrIncomplete,
      });
      setActiveRole(authRes.role);
      setIsAuthenticated(true);

      if (isNewOrIncomplete) {
        navigate('/build-passport');
      } else {
        // Hydrate authenticated worker data from backend before entering dashboard
        if (authRes.role !== 'contractor') {
          try {
            await refreshData();
          } catch (fetchErr) {
            console.warn('Dashboard hydration warning after login:', fetchErr);
          }
        }

        if (redirectParam) {
          navigate(redirectParam);
        } else if (authRes.role === 'contractor') {
          navigate('/contractor');
        } else {
          navigate('/worker');
        }
      }
    } catch (err: any) {
      localStorage.removeItem('vouch_auth_token');
      localStorage.removeItem('vouch_active_worker_id');
      localStorage.removeItem('vouch_user_email');
      setIsAuthenticated(false);
      setCurrentUser(null);

      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);

    // CRITICAL: Purge any old/stale session or worker identity before starting
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('vouch_auth_token');
      localStorage.removeItem('vouch_active_worker_id');
      localStorage.removeItem('vouch_user_email');
    }
    setIsAuthenticated(false);
    setCurrentUser(null);

    try {
      // 1. Authenticate with Google identity via Firebase Popup
      const idToken = await signInWithGoogle();

      // 2. Send Firebase ID token to VOUCH backend for verification & user resolution
      const authRes = await api.loginWithGoogle(idToken);

      // 3. Store verified VOUCH session tokens
      localStorage.setItem('vouch_auth_token', authRes.token);
      localStorage.setItem('vouch_user_email', authRes.email);
      if (authRes.worker_id) {
        localStorage.setItem('vouch_active_worker_id', authRes.worker_id);
      }

      const isGoogleNewOrIncomplete = Boolean(authRes.is_new_user || authRes.onboarding_completed === false);

      setCurrentUser({
        user_id: authRes.user_id,
        name: authRes.name,
        email: authRes.email,
        role: authRes.role || 'worker',
        worker_id: authRes.worker_id,
        onboarding_completed: !isGoogleNewOrIncomplete,
      });
      setActiveRole(authRes.role || 'worker');
      setIsAuthenticated(true);

      // 4. Case separation: New/Incomplete User vs Completed Existing User
      if (isGoogleNewOrIncomplete) {
        // CASE 2: NEW GOOGLE USER OR INCOMPLETE ONBOARDING
        // Route directly to the existing onboarding flow to configure trade, experience, work, etc.
        navigate('/build-passport');
      } else {
        // CASE 1: EXISTING VOUCH USER WITH COMPLETED ONBOARDING
        // Load existing worker data and enter dashboard
        if (authRes.role !== 'contractor') {
          try {
            await refreshData();
          } catch (fetchErr) {
            console.warn('Dashboard hydration warning after Google login:', fetchErr);
          }
        }

        if (redirectParam) {
          navigate(redirectParam);
        } else if (authRes.role === 'contractor') {
          navigate('/contractor');
        } else {
          navigate('/worker');
        }
      }
    } catch (err: any) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('vouch_auth_token');
        localStorage.removeItem('vouch_active_worker_id');
        localStorage.removeItem('vouch_user_email');
      }
      setIsAuthenticated(false);
      setCurrentUser(null);

      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err?.message || 'Google sign-in could not be completed. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col justify-between selection:bg-[#162B22] selection:text-white">
      
      {/* Top Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-medium text-[#484F4A] hover:text-[#141715] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#727A75]" />
          <span>{t('login.back')}</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#162B22] flex items-center justify-center text-white shadow-xs group-hover:bg-[#102019] transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#F5F2EB]" strokeWidth={2.2} />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-[#141715]">
              VOUCH
            </span>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Vouch branding, statement, headline, and authentic documentary worker image */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold tracking-wider uppercase text-[#162B22] mb-4">
              <ShieldCheck className="w-4 h-4 text-[#C2672B]" />
              <span>{t('login.badge')}</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[54px] text-[#141715] tracking-tight leading-[1.06] mb-5">
              {t('login.heroTitle1')}<br />
              <span className="text-[#162B22]">{t('login.heroTitle2')}</span>
            </h1>

            <p className="text-base sm:text-lg text-[#484F4A] leading-relaxed mb-8 max-w-xl">
              {t('login.heroDesc')}
            </p>

            {/* Documentary Worker Photography */}
            <div className="rounded-2xl overflow-hidden border border-[#DFD9CE] bg-[#ECE7DE] shadow-xs max-w-xl">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&auto=format&fit=crop&q=80"
                  alt="Real electrician working on-site"
                  className="w-full h-full object-cover filter saturate-[0.95]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141715]/75 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-mono text-[#F5F2EB]/90">
                    FIELD VERIFICATION · INDEPENDENT TRADE CREDENTIALS
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Authentication Form */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E1D8] shadow-xs">
              
              <div className="mb-6">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#121614] tracking-tight mb-2">
                  {t('login.title')}
                </h2>
                <p className="text-sm text-[#4A524D]">
                  {t('login.subtitle')}
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2.5 text-xs text-red-700 animate-fade-in-up">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#737A75] font-semibold block mb-2">
                    {t('login.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login.emailPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E1D8] bg-[#FAF8F5] text-sm text-[#121614] focus:border-[#1E3B2B] focus:bg-white focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none transition-all placeholder:text-[#A1A7A2]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono uppercase text-[#737A75] font-semibold block">
                      {t('login.password')}
                    </label>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E1D8] bg-[#FAF8F5] text-sm text-[#121614] focus:border-[#1E3B2B] focus:bg-white focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none transition-all placeholder:text-[#A1A7A2]"
                  />
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordNotice(!forgotPasswordNotice)}
                    className="text-xs text-[#737A75] hover:text-[#121614] transition-colors cursor-pointer"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>

                {forgotPasswordNotice && (
                  <div className="p-3 rounded-xl bg-[#EBF6EE] border border-[#059669]/20 text-xs text-[#059669] leading-relaxed">
                    If an account exists for this email, password reset instructions have been sent.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#1E3B2B] text-white font-semibold text-sm hover:bg-[#14281D] active:scale-[0.99] transition-all shadow-xs cursor-pointer mt-2 disabled:opacity-60 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{t('login.signingIn')}</span>
                    </>
                  ) : (
                    <span>{t('login.signInBtn')}</span>
                  )}
                </button>
              </form>

              {/* Minimal Google Authentication Option */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-[#ECE8E0] w-full"></div>
                <span className="bg-white px-3 text-xs font-mono uppercase text-[#737A75] relative">or</span>
              </div>

              <button
                type="button"
                id="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
                className="w-full py-3.5 rounded-xl border border-[#DFD9CE] bg-white text-[#121614] font-semibold text-sm hover:bg-[#FAF8F5] active:scale-[0.99] transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2.5 disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#1E3B2B]" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>{t('login.googleSignIn')}</span>
                  </>
                )}
              </button>

              {/* Destination to /signup */}
              <div className="pt-6 mt-6 border-t border-[#ECE8E0] text-sm text-[#4A524D] text-center">
                {t('login.noAccount')}{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-[#1E3B2B] hover:underline inline-flex items-center space-x-1"
                >
                  <span>{t('login.createAccount')}</span>
                  <span className="text-[#C27A38]">→</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-[#DFD9CE] flex flex-col sm:flex-row items-center justify-between text-xs text-[#727A75] gap-3">
        <p>© {new Date().getFullYear()} VOUCH Professional Identity Platform.</p>
        <div className="flex items-center space-x-5">
          <Link to="/" className="hover:text-[#141715] transition-colors">{t('nav.home')}</Link>
          <span>·</span>
          <Link to="/about" className="hover:text-[#141715] transition-colors">{t('nav.about')}</Link>
          <span>·</span>
          <Link to="/build-passport" className="hover:text-[#141715] transition-colors">{t('nav.buildPassport')}</Link>
        </div>
      </footer>

    </div>
  );
};

export default LoginPage;
