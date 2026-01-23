import { useState } from 'react'
import { signInWithGoogle } from '../services/supabase'

function Login() {
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async () => {
        try {
            const { error } = await signInWithGoogle()
            if (error) throw error
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An error occurred during login')
            }
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '2rem'
        }}>
            <h1>Login to AIGestion</h1>

            {error && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <button
                onClick={handleLogin}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#4285F4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                Sign in with Google
            </button>
        </div>
    )
}

export default Login
