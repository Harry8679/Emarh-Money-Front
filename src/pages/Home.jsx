import React from "react";
import DefaultLayout from "../components/DefaultLayout";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Home = () => {
  return (
    <DefaultLayout>
      <section className="flex flex-col-reverse items-center justify-center min-h-screen px-6 py-12 text-center bg-gradient-to-br from-blue-50 to-blue-100 md:flex-row md:text-left">
        
        {/* Texte d'accueil */}
        <div className="max-w-lg space-y-6 md:w-1/2">
          <h1 className="text-4xl font-extrabold text-gray-800 md:text-5xl">
            Gérez votre argent facilement avec{" "}
            <span className="text-blue-600">EMARH Money</span>
          </h1>
          <p className="text-lg text-gray-600">
            Suivez vos finances, économisez intelligemment et atteignez vos objectifs
            plus rapidement grâce à notre application intuitive et sécurisée.
          </p>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <a
              href="/inscription"
              className="px-6 py-3 text-white transition duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
            >
              Créer un compte
            </a>
            <a
              href="/connexion"
              className="px-6 py-3 text-blue-600 transition duration-300 bg-white border border-blue-600 rounded-lg shadow-md hover:bg-blue-50"
            >
              Se connecter
            </a>
          </div>
        </div>

        {/* Animation Lottie */}
        <div className="flex items-center justify-center md:w-1/2">
          <DotLottieReact
            src="https://lottie.host/a21018f6-3796-418a-b092-f6bff4f6ca3c/0ZyAvxJTlv.lottie"
            loop
            autoplay
            style={{ width: "100%", maxWidth: "400px", height: "auto" }}
          />
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Home;