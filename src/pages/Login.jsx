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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <ToastContainer />
          <form onSubmit={handleSubmit} className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
            <h2 className="mb-4 text-2xl font-bold text-center text-blue-600">Connexion</h2>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input type="email" name='email' value={form.email} onChange={handleChange} 
                className='w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300'
                placeholder='Entrez votre email'
              />
            </div>
          </form>
        </div>
    </DefaultLayout>
  )
}

export default Login;