import React, { useState } from "react";
import { FaList, FaChartPie, FaPlus } from "react-icons/fa";
import DefaultLayout from "../components/DefaultLayout";

const Dashboard = () => {
  const [frequence, setFrequence] = useState("7j");
  const [type, setType] = useState("all");

  // Données fictives
  const stats = {
    transactions: 3,
    revenus: 150000,
    depenses: 300,
    revenusCount: 2,
    depensesCount: 1,
    categoriesRevenus: [
      { nom: "Salaire", pourcentage: 90 },
      { nom: "Freelance", pourcentage: 10 },
    ],
    categoriesDepenses: [
      { nom: "Nourriture", pourcentage: 50 },
      { nom: "Transport", pourcentage: 50 },
    ],
  };

  return (
    <DefaultLayout>
        <div className="min-h-screen p-6 bg-gray-50">
            {/* Filtres */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">
                <div className="flex gap-4">
                <div>
                    <label className="block text-sm font-medium">Sélectionner la période</label>
                    <select
                    className="px-3 py-2 border rounded"
                    value={frequence}
                    onChange={(e) => setFrequence(e.target.value)}
                    >
                    <option value="7j">Dernière semaine</option>
                    <option value="30j">Dernier mois</option>
                    <option value="365j">Dernière année</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Sélectionner le type</label>
                    <select
                    className="px-3 py-2 border rounded"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    >
                    <option value="all">Tous</option>
                    <option value="revenu">Entrées</option>
                    <option value="depense">Sorties</option>
                    </select>
                </div>
                </div>

                <div className="flex gap-2">
                <button className="p-2 border rounded hover:bg-gray-100">
                    <FaList />
                </button>
                <button className="p-2 border rounded hover:bg-gray-100">
                    <FaChartPie />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-700 rounded hover:bg-blue-800">
                    <FaPlus /> Ajouter
                </button>
                </div>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                {/* Transactions */}
                <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-bold">
                    Transactions totales : {stats.transactions}
                </h2>
                <p>Entrées : {stats.revenusCount}</p>
                <p>Sorties : {stats.depensesCount}</p>
                <div className="flex gap-6 mt-4">
                    <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-green-600">67%</div>
                    <span>Entrées</span>
                    </div>
                    <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-orange-500">33%</div>
                    <span>Sorties</span>
                    </div>
                </div>
                </div>

                {/* Chiffre d'affaires */}
                <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-bold">
                    Total : {stats.revenus + stats.depenses} €
                </h2>
                <p>Entrées : {stats.revenus} €</p>
                <p>Sorties : {stats.depenses} €</p>
                <div className="flex gap-6 mt-4">
                    <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-green-600">100%</div>
                    <span>Entrées</span>
                    </div>
                    <div className="flex flex-col items-center">
                    <div className="text-xl font-bold text-orange-500">0%</div>
                    <span>Sorties</span>
                    </div>
                </div>
                </div>
            </div>

            {/* Catégories */}
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
                {/* Revenus */}
                <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 font-bold">Entrées par catégorie</h2>
                {stats.categoriesRevenus.map((cat, i) => (
                    <div key={i} className="mb-3">
                    <div className="flex justify-between">
                        <span>{cat.nom}</span>
                        <span>{cat.pourcentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                        <div
                        className="h-2 bg-green-600 rounded"
                        style={{ width: `${cat.pourcentage}%` }}
                        ></div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Dépenses */}
                <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 font-bold">Sorties par catégorie</h2>
                {stats.categoriesDepenses.map((cat, i) => (
                    <div key={i} className="mb-3">
                    <div className="flex justify-between">
                        <span>{cat.nom}</span>
                        <span>{cat.pourcentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                        <div
                        className="h-2 bg-orange-500 rounded"
                        style={{ width: `${cat.pourcentage}%` }}
                        ></div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
    </DefaultLayout>
  );
};

export default Dashboard;