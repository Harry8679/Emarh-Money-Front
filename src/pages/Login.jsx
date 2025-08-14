import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import DefaultLayout from '../components/DefaultLayout';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  
  return (
    <DefaultLayout>
        
    </DefaultLayout>
  )
}

export default Login;