import React, { useState } from "react";
import { FaList, FaChartPie, FaPlus } from "react-icons/fa";
import { Progress } from "antd"; // ⬅️ import antd
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
  };

  const totalCount = stats.revenusCount + stats.depensesCount;
  const revenusPourcent = Math.round((stats.revenusCount / totalCount) * 100);
  const depensesPourcent = Math.round((stats.depensesCount / totalCount) * 100);

  const totalMontant = stats.revenus + stats.depenses;
  const revenusMontantPourcent = Math.round((stats.revenus / totalMontant) * 100);
  const depensesMontantPourcent = Math.round((stats.depenses / totalMontant) * 100);

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 bg-gray-50">
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
              <Progress
                type="circle"
                percent={revenusPourcent}
                strokeColor={{ "0%": "green", "100%": "green" }}
                format={() => `${revenusPourcent}%`}
              />
              <Progress
                type="circle"
                percent={depensesPourcent}
                strokeColor={{ "0%": "orange", "100%": "orange" }}
                format={() => `${depensesPourcent}%`}
              />
            </div>
          </div>

          {/* Chiffre d'affaires */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-bold">
              Total : {totalMontant} €
            </h2>
            <p>Entrées : {stats.revenus} €</p>
            <p>Sorties : {stats.depenses} €</p>
            <div className="flex gap-6 mt-4">
              <Progress
                type="circle"
                percent={revenusMontantPourcent}
                strokeColor={{ "0%": "green", "100%": "green" }}
                format={() => `${revenusMontantPourcent}%`}
              />
              <Progress
                type="circle"
                percent={depensesMontantPourcent}
                strokeColor={{ "0%": "orange", "100%": "orange" }}
                format={() => `${depensesMontantPourcent}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;