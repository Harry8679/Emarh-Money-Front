import React, { useEffect, useMemo, useState } from "react";
import { Table, Tag, Select, Spin, message } from "antd";
import { useSearchParams } from "react-router-dom";
import DefaultLayout from "../components/DefaultLayout";

const API_BASE = "http://localhost:5000";

async function parseJsonSafe(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  throw new Error(`Réponse non-JSON (${res.status}) : ${text.slice(0, 120)}…`);
}

const fmtMoney = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    Number(n || 0)
  );

const fmtDate = (d) => {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("fr-FR");
};

export default function TransactionsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFreq = searchParams.get("freq") || "7j";

  const [frequence, setFrequence] = useState(initialFreq);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  // pagination locale (Table d’Antd)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        sort: "-date",
      });
      if (frequence !== "all") params.set("freq", frequence);

      const res = await fetch(
        `${API_BASE}/api/v1/transactions?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await parseJsonSafe(res);
      if (!res.ok) throw new Error(json.message || "Erreur lors du chargement");

      setData(Array.isArray(json.transactions) ? json.transactions : []);
      setTotal(json.total || 0);
    } catch (e) {
      console.error(e);
      message.error(e.message || "Erreur réseau");
      setData([]);
      setTotal(0);
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
  }, [frequence, pagination.current, pagination.pageSize]);

  const columns = useMemo(
    () => [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (v) => fmtDate(v),
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        render: (t) =>
          t === "entree" ? (
            <Tag color="green">Entrée</Tag>
          ) : (
            <Tag color="volcano">Sortie</Tag>
          ),
        filters: [
          { text: "Entrée", value: "entree" },
          { text: "Sortie", value: "sortie" },
        ],
        onFilter: (val, record) => record.type === val,
      },
      {
        title: "Catégorie",
        dataIndex: "category",
        key: "category",
      },
      {
        title: "Montant",
        dataIndex: "montant",
        key: "montant",
        align: "right",
        render: (v) => fmtMoney(v),
        sorter: (a, b) => Number(a.montant || 0) - Number(b.montant || 0),
      },
      {
        title: "Référence",
        dataIndex: "reference",
        key: "reference",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
      },
    ],
    []
  );

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex items-center justify-between p-4 mb-6 bg-white rounded-lg shadow">
          <div className="flex items-center gap-4">
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
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spin />
          </div>
        ) : (
          <Table
            rowKey={(r) => r.id || r._id}
            columns={columns}
            dataSource={data}
            pagination={{
              ...pagination,
              total,
              showSizeChanger: true,
            }}
            onChange={(p) =>
              setPagination({ current: p.current, pageSize: p.pageSize })
            }
          />
        )}
      </div>
    </DefaultLayout>
  );
}