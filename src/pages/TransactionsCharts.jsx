import React, { useEffect, useMemo, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Select, Spin, message } from "antd";
import { useSearchParams } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

const API_BASE = "http://localhost:5000";
const COLORS = ["#34d399", "#f97316", "#60a5fa", "#a78bfa", "#f59e0b", "#ef4444"];

async function parseJsonSafe(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(`Réponse non-JSON (${res.status}) : ${text.slice(0, 120)}…`);
}

const sum = (arr) => arr.reduce((a, n) => a + Number(n || 0), 0);

// total par catégorie (montant), pour un type donné
function aggregateByCategoryAmount(list, type) {
  const map = new Map();
  for (const t of list) {
    if (t.type !== type) continue;
    const k = t.category || "autre";
    map.set(k, (map.get(k) || 0) + Number(t.montant || 0));
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export default function TransactionsCharts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFreq = searchParams.get("freq") || "7j";

  const [frequence, setFrequence] = useState(initialFreq);
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ page: "1", limit: "1000", sort: "-date" });
      if (frequence !== "all") params.set("freq", frequence);

      const res = await fetch(`${API_BASE}/api/v1/transactions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.message || "Erreur lors du chargement");
      setTx(Array.isArray(data.transactions) ? data.transactions : []);
    } catch (e) {
      console.error(e);
      message.error(e.message || "Erreur réseau");
      setTx([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchParams((prev) => {
      const n = new URLSearchParams(prev);
      if (frequence === "all") n.delete("freq");
      else n.set("freq", frequence);
      return n;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequence]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequence]);

  // données dérivées
  const revenus = useMemo(() => tx.filter((t) => t.type === "entree"), [tx]);
  const depenses = useMemo(() => tx.filter((t) => t.type === "sortie"), [tx]);

  const totalRevenus = useMemo(() => sum(revenus.map((t) => t.montant)), [revenus]);
  const totalDepenses = useMemo(() => sum(depenses.map((t) => t.montant)), [depenses]);

  const pieIE = useMemo(
    () => [
      { name: "Entrées", value: totalRevenus },
      { name: "Sorties", value: totalDepenses },
    ],
    [totalRevenus, totalDepenses]
  );

  const catRev = useMemo(() => aggregateByCategoryAmount(tx, "entree"), [tx]);
  const catDep = useMemo(() => aggregateByCategoryAmount(tx, "sortie"), [tx]);

  // dataset bar combiné par catégorie
  const barData = useMemo(() => {
    const keys = new Set([...catRev.map((d) => d.name), ...catDep.map((d) => d.name)]);
    return Array.from(keys).map((name) => ({
      category: name,
      entree: catRev.find((d) => d.name === name)?.value || 0,
      sortie: catDep.find((d) => d.name === name)?.value || 0,
    }));
  }, [catRev, catDep]);

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 bg-gray-50">
        {/* Filtres */}
        <div className="flex items-center justify-between p-4 mb-6 bg-white rounded-lg shadow">
          <div>
            <label className="block mb-1 font-semibold">Période</label>
            <Select
              value={frequence}
              style={{ width: 200 }}
              onChange={setFrequence}
              options={[
                { value: "all", label: "Toutes les périodes" },
                { value: "7j", label: "Les 7 derniers jours" },
                { value: "30j", label: "Les 30 derniers jours" },
                { value: "365j", label: "La dernière année" },
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spin />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Pie Entrées vs Sorties */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-lg font-bold">Entrées vs Sorties (montants)</h2>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieIE}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {pieIE.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar par catégorie */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-lg font-bold">Montants par catégorie</h2>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="entree" name="Entrées" fill="#34d399" />
                    <Bar dataKey="sortie" name="Sorties" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}