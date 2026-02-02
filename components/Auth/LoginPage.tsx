
import React, { useState } from 'react';
import { Activity, Mail, Lock, User, ArrowRight, ShieldCheck, Github, Chrome, AlertCircle } from 'lucide-react';
import { auth } from '../../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Verification state
  const [showVerificationScreen, setShowVerificationScreen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user && !result.user.emailVerified) {
        setVerificationEmail(result.user.email || '');
        setShowVerificationScreen(true);
        await signOut(auth);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || "Google Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user.emailVerified) {
          setVerificationEmail(user.email || email);
          setShowVerificationScreen(true);
          await signOut(auth); 
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (name) {
          await updateProfile(user, { displayName: name });
        }
        
        await sendEmailVerification(user);
        
        setVerificationEmail(user.email || email);
        setShowVerificationScreen(true);
        await signOut(auth);
      }
    } catch (err: any) {
      console.error("Auth Error Code:", err.code);
      if (isLogin) {
        // Handle standard credential errors including the new 'invalid-credential'
        if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(err.code)) {
          setError("Email or password is incorrect");
        } else {
          setError(err.message || "Login failed");
        }
      } else {
        if (err.code === 'auth/email-already-in-use') {
          setError("User already exists. Please sign in");
        } else if (err.code === 'auth/weak-password') {
          setError("Password should be at least 6 characters");
        } else {
          setError(err.message || "Registration failed");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
        
        <div className="relative w-full max-w-[480px] glass-v2 rounded-[4rem] p-12 shadow-2xl border-white/10 animate-in fade-in zoom-in-95 duration-700 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <Mail className="text-emerald-400" size={32} />
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tighter mb-4">Verify Identity</h2>
          <p className="text-gray-400 font-medium leading-relaxed mb-10">
            We have sent you a verification email to <span className="text-white font-bold">{verificationEmail}</span>. Please verify it and log in.
          </p>
          
          <button 
            onClick={() => {
              setShowVerificationScreen(false);
              setIsLogin(true);
              setError(null);
            }}
            className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-xs transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            Return to Login
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative w-full max-w-[480px] glass-v2 rounded-[4rem] p-12 shadow-2xl border-white/10 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-6">
            <Activity className="text-black" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">LUMINA</h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Neural Task Interface v2.6</p>
        </div>

        <div className="flex p-1 bg-white/[0.03] rounded-2xl mb-6 border border-white/5">
          <button 
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Login
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="group relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" size={18} />
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-14 py-4 text-sm font-semibold outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600"
              />
            </div>
          )}

          <div className="group relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" size={18} />
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-14 py-4 text-sm font-semibold outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600"
            />
          </div>

          <div className="group relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-400 transition-colors" size={18} />
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secure Password"
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-14 py-4 text-sm font-semibold outline-none focus:border-purple-500/50 transition-all text-white placeholder:text-gray-600"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full relative group mt-4 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-xs transition-all overflow-hidden flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Access Interface' : 'Initialize System'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full text-gray-700">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Sync with</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              title="Continue with Google"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white hover:bg-white/10 transition-all group disabled:opacity-50"
            >
              <Chrome size={20} className="text-gray-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Continue with Google</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-emerald-500" />
            End-to-End Encrypted Data
          </div>
        </div>
      </div>
    </div>
  );
};
