import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Register</h1>
      <input type="email" placeholder="Email" required onChange={e => setEmail(e.target.value)} className="border p-2 w-full" />
      <input type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Register</button>
    </form>
  );
}
