import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col items-center justify-center p-6 font-[Arial]">
      <h2 className="text-2xl font-bold text-[#d32f2f] mb-6">Welcome Back 👋</h2>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
// Compare this snippet from client/src/components/LoginForm.jsx:
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';