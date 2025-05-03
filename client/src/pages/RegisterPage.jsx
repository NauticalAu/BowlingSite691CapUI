import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-4">
          📝 Create Your Account
        </h2>
        <p className="text-[18px] text-gray-700 text-center mb-6">
          Join Bowling Hub to track your scores, find alleys, and compete in tournaments!
        </p>
        <RegisterForm />
      </div>
  );
}

export default RegisterPage;
