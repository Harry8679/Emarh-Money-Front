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

// CRA : .env ➜ REACT_APP_API_BASE_URL=http://localhost:5000
// ou "proxy" dans package.json et laisse vide.
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

async function parseJsonSafe(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(`Réponse non-JSON (${res.status}) : ${text.slice(0, 120)}…`);
}

const Dashboard = () => {
  const [frequence, setFrequence] = useState("7j"); // "7j" | "30j" | "365j"
  const [loading, setLoading] = useState(true);

  // Données du résumé API
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

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = `${API_BASE}/api/v1/transactions/summary?freq=${frequence}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.message || "Erreur lors du chargement");
      setSummary({
        total: data.total || 0,
        revenusCount: data.revenusCount || 0,
        depensesCount: data.depensesCount || 0,
        revenus: data.revenus || 0,
        depenses: data.depenses || 0,
        totalMontant: data.totalMontant || 0,
        categoriesRevenus: data.categoriesRevenus || [],
        categoriesDepenses: data.categoriesDepenses || [],
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
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequence]);

  // Modal handlers
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
      fetchSummary(); // rafraîchit les cartes
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
                  { value: "7j", label: "Last 1 Week" },
                  { value: "30j", label: "Last 1 Month" },
                  { value: "365j", label: "Last 1 Year" },
                ]}
              />
            </div>

            {/* Tu pourras ajouter d'autres filtres ici si besoin */}
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
