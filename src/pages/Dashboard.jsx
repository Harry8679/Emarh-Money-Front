// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { FaList, FaChartPie, FaPlus } from "react-icons/fa";
import {
  Progress,
  Select,
  Modal,
  Form,
  Input,
  DatePicker,
} from "antd";
import DefaultLayout from "../components/DefaultLayout";

const { TextArea } = Input;

const Dashboard = () => {
  const [frequence, setFrequence] = useState("7j");
  const [type, setType] = useState("all");

  // Modal + Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Soumission du formulaire (clic sur "Valider")
  const onFinish = async (values) => {
    // Adapter ici le mapping pour ton backend
    const payload = {
      montant: values.montant,                       // string (texte)
      type: values.type,                             // "entree" | "sortie"
      category: values.category,                     // l'une des catégories
      date: values.date.format("DD-MM-YYYY"),        // dd-mm-yyyy
      reference: values.reference,                   // string
      description: values.description || "",         // optionnel
    };

    setConfirmLoading(true);
    try {
      // Exemple d’envoi API (décommente et adapte l’URL + headers si besoin)
      /*
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/v1/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la création");
      }
      */

      // Si tout va bien:
      setIsModalOpen(false);
      form.resetFields();
      // Tu peux rafraîchir tes stats ici si nécessaire
    } catch (err) {
      console.error(err);
      // Affiche un message avec ta lib de toast si tu en utilises une
      // ex: toast.error(err.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleOk = () => {
    form.submit(); // déclenche onFinish
  };

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

  // Calcul des pourcentages
  const totalCount = stats.revenusCount + stats.depensesCount;
  const revenusPourcent = Math.round((stats.revenusCount / totalCount) * 100);
  const depensesPourcent = Math.round((stats.depensesCount / totalCount) * 100);
  const totalMontant = stats.revenus + stats.depenses;
  const revenusMontantPourcent = Math.round((stats.revenus / totalMontant) * 100);
  const depensesMontantPourcent = Math.round((stats.depenses / totalMontant) * 100);

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
                onChange={(value) => setFrequence(value)}
                options={[
                  { value: "7j", label: "Last 1 Week" },
                  { value: "30j", label: "Last 1 Month" },
                  { value: "365j", label: "Last 1 Year" },
                ]}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Select Type</label>
              <Select
                value={type}
                style={{ width: 150 }}
                onChange={(value) => setType(value)}
                options={[
                  { value: "all", label: "All" },
                  { value: "revenus", label: "Income" },
                  { value: "depenses", label: "Expenses" },
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

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
          {/* Transactions */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-bold">Total Transactions : {stats.transactions}</h2>
            <p>Income : {stats.revenusCount}</p>
            <p>Expenses : {stats.depensesCount}</p>
            <div className="flex gap-6 mt-4">
              <Progress type="circle" percent={revenusPourcent} strokeColor="green" format={() => `${revenusPourcent}%`} />
              <Progress type="circle" percent={depensesPourcent} strokeColor="orange" format={() => `${depensesPourcent}%`} />
            </div>
          </div>

          {/* Chiffre d'affaires */}
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-lg font-bold">Total Turnover : {totalMontant}</h2>
            <p>Income : {stats.revenus}</p>
            <p>Expenses : {stats.depenses}</p>
            <div className="flex gap-6 mt-4">
              <Progress type="circle" percent={revenusMontantPourcent} strokeColor="green" format={() => `${revenusMontantPourcent}%`} />
              <Progress type="circle" percent={depensesMontantPourcent} strokeColor="orange" format={() => `${depensesMontantPourcent}%`} />
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
                  <div className="h-2 bg-green-600 rounded" style={{ width: `${cat.pourcentage}%` }} />
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
                  <div className="h-2 bg-orange-500 rounded" style={{ width: `${cat.pourcentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

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
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
          >
            <Form.Item
              label="Montant"
              name="montant"
              rules={[{ required: true, message: "Le montant est requis" }]}
            >
              <Input placeholder="Ex: 1200.50" inputMode="decimal" />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Le type est requis" }]}
            >
              <Select
                placeholder="Sélectionner le type"
                options={[
                  { value: "entree", label: "Entrée" },
                  { value: "sortie", label: "Sortie" },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Catégorie"
              name="category"
              rules={[{ required: true, message: "La catégorie est requise" }]}
            >
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

            <Form.Item
              label="Date de la transaction"
              name="date"
              rules={[{ required: true, message: "La date est requise" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                placeholder="JJ-MM-AAAA"
              />
            </Form.Item>

            <Form.Item
              label="Référence"
              name="reference"
              rules={[{ required: true, message: "La référence est requise" }]}
            >
              <Input placeholder="Ex: Fact-2025-001" />
            </Form.Item>

            <Form.Item
              label="Description (optionnel)"
              name="description"
            >
              <TextArea placeholder="Quelques détails..." rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;