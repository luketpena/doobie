import { useState } from 'react';
import { supabase } from '../../../supabase-client';
import './Auth.scss';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth_container">
      <h1 className="header">To Do</h1>
      <p className="description">
        Sign in via magic link with your email below
      </p>
      {loading ? (
        'Sending magic link...'
      ) : (
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="button block" aria-live="polite">
            Send magic link
          </button>
        </form>
      )}
    </div>
  );
}
