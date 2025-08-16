import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const DefaultLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "??";
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer hover:opacity-80"
          onClick={() => navigate('/')}
        >
          EMARH Money
        </h1>

        <div className="relative group">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-blue-500 rounded-full">
              {initials}
            </div>
          </div>

          <div className="absolute right-0 invisible w-40 mt-2 transition-all duration-200 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible">
            <ul className="py-2 text-gray-700">
              {!user && (
                <>
                  <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => navigate('/inscription')}>
                    Inscription
                  </li>
                  <li className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => navigate('/connexion')}>
                    Connexion
                  </li>
                </>
              )}
              {user && (
                <li
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => { logout(); navigate('/'); }}
                >
                  Déconnexion
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DefaultLayout;