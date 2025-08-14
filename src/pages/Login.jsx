import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
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

    if (form.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    toast.success('Connexion réussie !');
    console.log('Formulaire envoyé : ', form);
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100 md:flex-row">
        <ToastContainer />

        {/* Animation Lottie */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <DotLottieReact
            src="https://lottie.host/6d50dda5-06e4-4787-9e31-7bd2cb31e9b5/YTMPTEIYO5.lottie"
            loop
            autoplay
            style={{ width: '100%', maxWidth: '1000px', height: 'auto' }}
          />
        </div>

        {/* Formulaire */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
          >
            <h2 className="mb-4 text-2xl font-bold text-center text-blue-600">Connexion</h2>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Entrez votre email"
              />
            </div>

            {/* Mot de passe */}
            <div className="mb-2">
              <label className="block text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Entrez votre mot de passe"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 cursor-pointer right-3 top-3 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>

            {/* Lien mot de passe oublié */}
            <div className="mb-4 text-right">
              <button
                type="button"
                onClick={() => navigate('/mot-de-passe-oublie')}
                className="text-sm text-blue-600 hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Se connecter
            </button>

            {/* Lien vers inscription */}
            <p className="mt-4 text-sm text-center text-gray-600">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/inscription')}
                className="text-blue-600 hover:underline"
              >
                Inscrivez-vous
              </button>
            </p>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Login;