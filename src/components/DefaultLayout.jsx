import React from "react";

const DefaultLayout = ({ children }) => {
  // Exemple : prenom = "John", nom = "Doe"
  const prenom = "John";
  const nom = "Doe";
  const initials = `${prenom[0]}${nom[0]}`.toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Logo à gauche */}
        <h1 className="text-xl font-bold text-blue-600">EMARH Money</h1>

        {/* Avatar + Menu à droite */}
        <div className="relative group">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-blue-500 rounded-full">
              {initials}
            </div>
          </div>

          {/* Menu déroulant */}
          <div className="absolute right-0 invisible w-40 mt-2 transition-opacity duration-200 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible">
            <ul className="py-2 text-gray-700">
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                Inscription
              </li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                Connexion
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DefaultLayout;