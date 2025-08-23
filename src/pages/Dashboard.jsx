// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { FaList, FaChartPie, FaPlus } from "react-icons/fa";
import {
  Progress,
  Select,
  Modal,
  Form,
  Input,
  DatePicker,
  Spin,
  message,
} from "antd";
import DefaultLayout from "../components/DefaultLayout";

const { TextArea } = Input;

// Pointe vers ton back (ou utilise le proxy CRA)
const API_BASE = "http://localhost:5000";

// helpers
const sum = (arr) => arr.reduce((acc, n) => acc + Number(n || 0), 0);

async function parseJsonSafe(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(`Réponse non-JSON (${res.status}) : ${text.slice(0, 120)}…`);
}

function breakdownByCategory(list, type) {
  const only = list.filter((t) => t.type === type);
  const total = sum(only.map((t) => t.montant));
  const map = new Map();
  for (const t of only) {
    const k = t.category || "autre";
    map.set(k, (map.get(k) || 0) + Number(t.montant || 0));
  }
  return Array.from(map.entries())
    .map(([nom, montant]) => ({
      nom,
      pourcentage: total > 0 ? Math.round((montant / total) * 100) : 0,
    }))
    .sort((a, b) => b.pourcentage - a.pourcentage);
}

const Dashboard = () => {
  const [frequence, setFrequence] = useState("7j"); // "7j" | "30j" | "365j"
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    total: 0,
    revenusCount: 0,
    depensesCount: 0,
    revenus: 0,
    depenses: 0,
    totalMontant: 0,
    categoriesRevenus: [],
    categoriesDepenses: [],
  });

  // Modal + Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  // 👉 on consomme /transactions et on calcule les stats
  const fetchFromList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // prends la période côté API (ton controller supporte freq)
      const url = `${API_BASE}/api/v1/transactions?freq=${frequence}&limit=1000&page=1&sort=-date`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.message || "Erreur lors du chargement");

      const tx = Array.isArray(data.transactions) ? data.transactions : [];
      const total = typeof data.total === "number" ? data.total : tx.length;

      const revenusList = tx.filter((t) => t.type === "entree");
      const depensesList = tx.filter((t) => t.type === "sortie");

      const revenusCount = revenusList.length;     // 👈 nombre de "type: entree"
      const depensesCount = depensesList.length;   // 👈 nombre de "type: sortie"

      const revenus = sum(revenusList.map((t) => t.montant));
      const depenses = sum(depensesList.map((t) => t.montant));
      const totalMontant = revenus + depenses;

      setSummary({
        total,
        revenusCount,
        depensesCount,
        revenus,
        depenses,
        totalMontant,
        categoriesRevenus: breakdownByCategory(tx, "entree"),
        categoriesDepenses: breakdownByCategory(tx, "sortie"),
      });
    } catch (e) {
      console.error(e);
      message.error(e.message || "Erreur réseau");
      setSummary({
        total: 0,
        revenusCount: 0,
        depensesCount: 0,
        revenus: 0,
        depenses: 0,
        totalMontant: 0,
        categoriesRevenus: [],
        categoriesDepenses: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFromList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequence]);

  const openModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const payload = {
      montant: values.montant,
      type: values.type, // "entree" | "sortie"
      category: values.category,
      date: values.date.format("DD-MM-YYYY"),
      reference: values.reference,
      description: values.description || "",
    };

    setConfirmLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/v1/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création");

      message.success("Transaction créée");
      setIsModalOpen(false);
      form.resetFields();
      // on recharge la liste puis recalcule les stats
      fetchFromList();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Erreur serveur");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleOk = () => form.submit();

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 bg-gray-50">
        {/* Filtres */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex gap-6">
            <div>
              <label className="block mb-1 font-semibold">Select Frequency</label>
              <Select
                value={frequence}
                style={{ width: 150 }}
                onChange={setFrequence}
                options={[
                  { value: "7j", label: "La dernière semaine" },
                  { value: "30j", label: "Le dernier mois" },
                  { value: "365j", label: "La dernière année" },
                ]}
              />
            </div>
          </div>

          {/* Boutons d’action */}
          <div className="flex gap-3">
            <button className="flex items-center px-4 py-2 text-white bg-blue-900 rounded-lg shadow hover:bg-blue-700">
              <FaList className="mr-2" /> Liste
            </button>
            <button className="flex items-center px-4 py-2 text-white bg-blue-900 rounded-lg shadow hover:bg-blue-700">
              <FaChartPie className="mr-2" /> Graph
            </button>
            <button
              onClick={openModal}
              className="flex items-center px-4 py-2 text-white bg-blue-900 rounded-lg shadow hover:bg-blue-700"
            >
              <FaPlus className="mr-2" /> Nouvelle transaction
            </button>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spin />
          </div>
        ) : (
          <>
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
              {/* Transactions */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-bold">
                  {/* 👇 total vient directement de l'API /transactions */}
                  Total Transactions : {summary.total}
                </h2>
                <p>Entrée(s) : {summary.revenusCount}</p>
                <p>Sortie(s) : {summary.depensesCount}</p>
                <div className="flex gap-6 mt-4">
                  <Progress
                    type="circle"
                    percent={
                      summary.total > 0
                        ? Math.round((summary.revenusCount / summary.total) * 100)
                        : 0
                    }
                    strokeColor="green"
                    format={() =>
                      `${
                        summary.total > 0
                          ? Math.round((summary.revenusCount / summary.total) * 100)
                          : 0
                      }%`
                    }
                  />
                  <Progress
                    type="circle"
                    percent={
                      summary.total > 0
                        ? Math.round((summary.depensesCount / summary.total) * 100)
                        : 0
                    }
                    strokeColor="orange"
                    format={() =>
                      `${
                        summary.total > 0
                          ? Math.round((summary.depensesCount / summary.total) * 100)
                          : 0
                      }%`
                    }
                  />
                </div>
              </div>

              {/* Chiffre d'affaires */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-lg font-bold">
                  Total Turnover : {summary.totalMontant}
                </h2>
                <p>Entrée(s) : {summary.revenus}</p>
                <p>Sortie(s) : {summary.depenses}</p>
                <div className="flex gap-6 mt-4">
                  <Progress
                    type="circle"
                    percent={
                      summary.totalMontant > 0
                        ? Math.round((summary.revenus / summary.totalMontant) * 100)
                        : 0
                    }
                    strokeColor="green"
                    format={() =>
                      `${
                        summary.totalMontant > 0
                          ? Math.round((summary.revenus / summary.totalMontant) * 100)
                          : 0
                      }%`
                    }
                  />
                  <Progress
                    type="circle"
                    percent={
                      summary.totalMontant > 0
                        ? Math.round((summary.depenses / summary.totalMontant) * 100)
                        : 0
                    }
                    strokeColor="orange"
                    format={() =>
                      `${
                        summary.totalMontant > 0
                          ? Math.round((summary.depenses / summary.totalMontant) * 100)
                          : 0
                      }%`
                    }
                  />
                </div>
              </div>
            </div>

            {/* Catégories */}
            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
              {/* Entrées */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 font-bold">Entrées par catégorie</h2>
                {summary.categoriesRevenus.length === 0 && (
                  <p className="text-sm text-gray-500">Aucune entrée</p>
                )}
                {summary.categoriesRevenus.map((cat, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between">
                      <span>{cat.nom}</span>
                      <span>{cat.pourcentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-green-600 rounded"
                        style={{ width: `${cat.pourcentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Sorties */}
              <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 font-bold">Sorties par catégorie</h2>
                {summary.categoriesDepenses.length === 0 && (
                  <p className="text-sm text-gray-500">Aucune dépense</p>
                )}
                {summary.categoriesDepenses.map((cat, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between">
                      <span>{cat.nom}</span>
                      <span>{cat.pourcentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-orange-500 rounded"
                        style={{ width: `${cat.pourcentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Modal Nouvelle transaction */}
        <Modal
          title="Nouvelle transaction"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Valider"
          cancelText="Annuler"
          confirmLoading={confirmLoading}
          destroyOnHidden
        >
          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
            <Form.Item label="Montant" name="montant" rules={[{ required: true, message: "Le montant est requis" }]}>
              <Input placeholder="Ex: 1200.50" inputMode="decimal" />
            </Form.Item>
            <Form.Item label="Type" name="type" rules={[{ required: true, message: "Le type est requis" }]}>
              <Select
                placeholder="Sélectionner le type"
                options={[
                  { value: "entree", label: "Entrée" },
                  { value: "sortie", label: "Sortie" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Catégorie" name="category" rules={[{ required: true, message: "La catégorie est requise" }]}>
              <Select
                placeholder="Sélectionner une catégorie"
                options={[
                  { value: "salaire", label: "Salaire" },
                  { value: "freelance", label: "Freelance" },
                  { value: "nourriture", label: "Nourriture" },
                  { value: "entrainement", label: "Entrainement" },
                  { value: "education", label: "Education" },
                  { value: "medical", label: "Medical" },
                  { value: "taxe", label: "Taxe" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Date de la transaction" name="date" rules={[{ required: true, message: "La date est requise" }]}>
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" placeholder="JJ-MM-AAAA" />
            </Form.Item>
            <Form.Item label="Référence" name="reference" rules={[{ required: true, message: "La référence est requise" }]}>
              <Input placeholder="Ex: Fact-2025-001" />
            </Form.Item>
            <Form.Item label="Description (optionnel)" name="description">
              <TextArea placeholder="Quelques détails..." rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;