import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "../components/DefaultLayout";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères !");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erreur lors de l'inscription");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Inscription réussie !");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erreur serveur");
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100 md:flex-row">
        <ToastContainer />

        {/* Animation Lottie */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <DotLottieReact
            src="https://lottie.host/c939432c-648a-4340-b8b2-3f5e678f6dc3/1NnAB3RSea.lottie"
            loop
            autoplay
            style={{ width: "100%", maxWidth: "1000px", height: "auto" }}
          />
        </div>

        {/* Formulaire */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
          >
            <h2 className="mb-4 text-2xl font-bold text-center text-blue-600">
              Inscription
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
              />
            </div>

            {/* Mot de passe */}
            <div className="mb-4">
              <label className="block text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
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
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div className="mb-4">
              <label className="block text-gray-700">
                Confirmez le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Confirmez votre mot de passe"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute text-gray-500 cursor-pointer right-3 top-3 hover:text-gray-700"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              S'inscrire
            </button>

            {/* Lien vers connexion */}
            <p className="mt-4 text-sm text-center text-gray-600">
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => navigate("/connexion")}
                className="text-blue-600 hover:underline"
              >
                Connectez-vous
              </button>
            </p>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RegisterPage;