'use client';

import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// ✅ Firebase config (your values)
const firebaseConfig = {
  apiKey: "AIzaSyCdRCUcczKIy_q5-MICVLAyDqGQinpDv3M",
  authDomain: "webmicrofasta.firebaseapp.com",
  projectId: "webmicrofasta",
  storageBucket: "webmicrofasta.firebasestorage.app",
  messagingSenderId: "704799157473",
  appId: "1:704799157473:web:f8e9e726e9773adf775ba0",
  measurementId: "G-K6CCZMTN8Z"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phoneNumber: '',
    vehicleReg: '',
    selectedMFI: '',
    reason: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'applications'), {
        ...formData,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('❌ Failed to submit application:', error);
      alert('There was an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold text-green-600">✅ Application Submitted!</h2>
        <p className="mt-2">Thank you. We’ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-semibold mb-4">📋 Logbook Loan Application</h2>

      <label className="block mb-2">Full Name</label>
      <input
        type="text"
        name="fullName"
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2">National ID Number</label>
      <input
        type="number"
        name="idNumber"
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2">Phone Number</label>
      <input
        type="tel"
        name="phoneNumber"
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2">Vehicle Registration Number</label>
      <input
        type="text"
        name="vehicleReg"
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2">Select Preferred MFI</label>
      <select
        name="selectedMFI"
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">-- Choose MFI --</option>
        <option value="Car Credit">Car Credit</option>
        <option value="Platinum Credit">Platinum Credit</option>
        <option value="Mwananchi Credit">Mwananchi Credit</option>
      </select>

      <label className="block mb-2">Reason for the Loan</label>
      <textarea
        name="reason"
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        rows={3}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
