import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import DefaultLayout from '../components/DefaultLayout';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Veuillez remplir tous les champs !');
      return;
    }

    if (form.password < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
    };

    toast.success('Connexion réussie !');
    console.log('Formulaire envoyé : ', form);
  };
  return (
    <DefaultLayout>
        
    </DefaultLayout>
  )
}

export default Login;