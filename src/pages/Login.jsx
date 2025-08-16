// src/pages/Login.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DefaultLayout from '../components/DefaultLayout';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAuth } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations simples côté client
    if (!form.email || !form.password) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        // credentials: 'include', // décommente si tu utilises des cookies côté serveur
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erreur lors de la connexion");
        return;
      }

      // On suppose que le backend renvoie { token, user }
      if (!data?.token || !data?.user) {
        toast.error("Réponse serveur invalide (token ou user manquant).");
        return;
      }

      // Persistance locale
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ⚡️ Mise à jour immédiate du contexte -> évite la redirection vers /connexion
      login(data.user);

      toast.success("Connexion réussie !");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur");
    } finally {
      setSubmitting(false);
    }
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
            <h2 className="mb-4 text-2xl font-bold text-center text-blue-600">
              Connexion
            </h2>

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
                autoComplete="email"
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute text-gray-500 cursor-pointer right-3 top-2.5 hover:text-gray-700"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
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
              disabled={submitting}
              className="w-full py-2 text-white transition bg-blue-600 rounded-lg disabled:opacity-60 hover:bg-blue-700"
            >
              {submitting ? "Connexion..." : "Se connecter"}
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