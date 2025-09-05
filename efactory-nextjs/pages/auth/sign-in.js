import React, { useState, useRef, useEffect } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import Link from 'next/link';
import { loginRequest } from '@/lib/api/auth';
import { setAuthToken } from '@/lib/auth/storage';
import { useRouter } from 'next/router';

export async function getStaticProps() {
    return {
        props: {
            isAuthRoute: true,
        },
    };
}

export default function Signin() {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [dclUser, setDclUser] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const usernameRef = useRef(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (usernameRef.current) {
            try { usernameRef.current.focus(); } catch {}
        }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await loginRequest(email, password, { dcl_user: dclUser, force_logout: false });
            if (remember && typeof window !== 'undefined') {
                window.localStorage.setItem('rememberUsername', email);
            } else if (typeof window !== 'undefined') {
                window.localStorage.removeItem('rememberUsername');
            }
            setAuthToken({
                api_token: res.data.api_token,
                available_accounts: res.data.available_accounts,
                admin_roles: res.data.admin_roles,
                user_data: res.data.user_data,
            });
            const isAdmin = Array.isArray(res.data.user_data?.roles) && res.data.user_data.roles.includes('ADM');
            if (isAdmin && Array.isArray(res.data.available_accounts) && res.data.available_accounts.length) {
                // For admin users, call global API BEFORE customer selection (like legacy)
                console.log('🔧 Admin user detected - calling global API before customer selection');
                try {
                    const { getJson } = await import('@/lib/api/http');
                    const globalResponse = await getJson('/api/global?admin=1');
                    if (globalResponse && globalResponse.data) {
                        console.log('✅ Admin global API data loaded:', globalResponse.data);
                        console.log('📊 Admin sub_warehouses loaded:', Object.keys(globalResponse.data.sub_warehouses || {}).length, 'warehouses');
                        window.localStorage.setItem('globalApiData', JSON.stringify(globalResponse.data));
                    }
                } catch (error) {
                    console.error('❌ Failed to load admin global API data:', error);
                }
                router.replace('/admin/login-user');
            } else {
                router.replace('/');
            }
        } catch (err) {
            const message = (err && err.error_message) || 'Login failed';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="brand-dcl">
            {/* Background grid lines (fixed, subtle) */}
            <div className="animated-grid-bg fixed inset-0 -z-[1] pointer-events-none" />

            {/* Super-light animated curved lines */}
            <div className="fx-lines fixed inset-0 -z-[1] pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none">
                    <path className="is-glow" d="M-10 180 C 260 120, 420 260, 700 210 C 980 160, 1180 260, 1460 180" />
                    <path className="is-dashed" d="M-10 320 C 240 260, 480 380, 760 340 C 1040 300, 1240 380, 1460 320" />
                    <path className="is-dashed" d="M-10 520 C 180 470, 520 600, 860 540 C 1160 488, 1320 580, 1460 520" />
                </svg>
            </div>

            <div className='sm:mb-8 mb-6 text-center'>
                <div className='uppercase tracking-[0.18em] text-[12px] text-font-color-100 mb-2'>
                    DCL Logistics
                </div>
                <div className='sm:text-[40px]/[48px] text-[30px]/[36px] font-medium mb-1'>
                    eFactory Portal
                </div>
                <div className='brand-underline mx-auto mb-2' />
                {process.env.NEXT_PUBLIC_APP_VERSION ? (
                    <span className='text-font-color-100 inline-block'>
                        Version {process.env.NEXT_PUBLIC_APP_VERSION}
                    </span>
                ) : null}
            </div>
            <form onSubmit={handleSubmit} className={`relative ${submitting ? 'pointer-events-none' : ''}`}>
                <div className={`transition-opacity duration-300 ${submitting ? 'opacity-50' : 'opacity-100'}`}>
                    <div className='form-control mb-15'>
                        <label htmlFor='email' className='form-label'>
                            Username
                        </label>
                        <input 
                            value={email} 
                            onChange={(e)=>setEmail(e.target.value)} 
                            type='text' 
                            id='email' 
                            placeholder='username' 
                            className='form-input'
                            disabled={submitting}
                            ref={usernameRef}
                        />
                    </div>
                    <div className='form-control mb-15'>
                        <label htmlFor='password' className='form-label'>
                            Password
                        </label>
                        <div className='relative'>
                            <input
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                placeholder='Enter the password'
                                className='form-input !pr-12'
                                disabled={submitting}
                            />
                            <button 
                                type="button" 
                                onClick={togglePasswordVisibility} 
                                className='absolute top-[50%] translate-y-[-50%] right-3 text-font-color-100 disabled:opacity-50'
                                disabled={submitting}
                            >
                                {showPassword ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-wrap items-center justify-between gap-10 sm:mb-30 mb-6'>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={remember}
                                onChange={(e)=>setRemember(e.target.checked)}
                                className="form-check-input"
                                disabled={submitting}
                            />
                            <label className="form-check-label" htmlFor="remember">Remember me</label>
                        </div>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                id="dcl_user"
                                checked={dclUser}
                                onChange={(e)=>setDclUser(e.target.checked)}
                                className="form-check-input"
                                disabled={submitting}
                            />
                            <label className="form-check-label" htmlFor="dcl_user">DCL User</label>
                        </div>
                    </div>
                    {error ? <div className='text-danger mb-4'>{error}</div> : null}
                    <button 
                        disabled={submitting} 
                        type='submit' 
                        className='btn btn-secondary large w-full uppercase disabled:opacity-75 transition-all duration-200 flex items-center justify-center gap-2'
                    >
                        {submitting && (
                            <div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                        )}
                        {submitting ? 'Authenticating...' : 'Sign In'}
                    </button>
                    <div className='text-center text-[12px]/[18px] text-font-color-100 mt-4'>
                        © 2025 DCL Logistics · eFactory
                    </div>
                </div>
            </form>
        </div>
    )
}
