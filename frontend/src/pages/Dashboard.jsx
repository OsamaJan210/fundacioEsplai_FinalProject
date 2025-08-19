import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import '../styles/Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4444"];

// 📌 Rango estático (para gráficos)
const DEFAULT_FROM = "2025-01-01T00:00:00";
const DEFAULT_TO = "2025-12-31T23:59:59";

function parseSfBusinessString(str) {
  const contentMatch = str.match(/\((.*)\)/);
  if (!contentMatch) return {};

  const content = contentMatch[1];
  const obj = {};
  const regex = /(\w+)=(([^,()]+)|(\w+\([^)]*\)))/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    let value = match[2].trim();
    if (value.includes("(") && value.includes(")")) {
      value = parseSfBusinessString(value);
    }
    obj[key] = value;
  }

  return obj;
}

export default function Dashboard() {
  const [company, setCompany] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [headerData, setHeaderData] = useState({
    numberOfSales: 0,
    totalAmount: 0,
    tax: 0,
    cardCash: "Cash: 0 / Card: 0",
  });

  // Obtener info de la empresa
  useEffect(() => {
    const businessId = localStorage.getItem("businessId");
    const token = localStorage.getItem("token");
    if (!businessId || !token) return;

    const fetchCompany = async () => {
      try {
        const response = await fetch(`${API_URL}/smartflow-api/v1/business/get/${businessId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch company info");

        const json = await response.json();
        const rawData = json.data || {};
        const parsed = parseSfBusinessString(rawData) || {};
        setCompany(parsed);

      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };

    fetchCompany();
  }, []);

  // 📊 Monthly Sales → rango fijo 2025
  useEffect(() => {
    const fetchMonthlySales = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/smartflow-api/v1/dashboards/getSalesByMonth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fromDate: DEFAULT_FROM,
            toDate: DEFAULT_TO,
          }),
        });

        if (!response.ok) throw new Error("Error fetching monthly sales");

        const json = await response.json();
        if (!json.data) return;

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const salesByMonth = {};
        months.forEach((m) => (salesByMonth[m] = 0));

        json.data.forEach(([monthNum, totalAmount]) => {
          const monthName = months[monthNum - 1];
          salesByMonth[monthName] = totalAmount;
        });

        const formattedData = months.map((month) => ({
          month,
          sales: salesByMonth[month]
        }));

        setSalesData(formattedData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchMonthlySales();
  }, []);

  // 📊 Top Selling Products → rango fijo 2025
  const fetchTopProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/smartflow-api/v1/dashboards/byMostSaled`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromDate: DEFAULT_FROM,
          toDate: DEFAULT_TO,
        }),
      });

      if (!response.ok) throw new Error("Error fetching top products");
      const json = await response.json();
      if (!json.data) return;

      const top5 = json.data
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      setTopProducts(top5);

    } catch (error) {
      console.error(error);
    }
  };

  // cargar top products al inicio
  useEffect(() => {
    fetchTopProducts();
  }, []);

  // 📊 Stats (Nº Sale, Total Amount, Tax, Cash/Card) → dependen de fecha seleccionada
  const fetchStats = async (fromDate, toDate) => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/smartflow-api/v1/dashboards/getStats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromDate: `${fromDate}T00:00:00`,
          toDate: `${toDate}T23:59:59`,
        }),
      });

      if (!response.ok) throw new Error("Error fetching stats");

      const json = await response.json();
      if (!json.data || !json.data[0]) return null;

      const [totalAmount, tax, cashCount, cardCount] = json.data[0];
      return {
        totalAmount,
        tax,
        cashCount,
        cardCount,
        numberOfSales: cashCount + cardCount,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // actualizar stats cuando cambian fechas
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchStats(dateRange.from, dateRange.to).then((stats) => {
        if (!stats) return;
        setHeaderData({
          numberOfSales: stats.numberOfSales,
          totalAmount: stats.totalAmount,
          tax: stats.tax,
          cardCash: `Cash: ${stats.cashCount} / Card: ${stats.cardCount}`,
        });
      });
    }
  }, [dateRange]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard-container">
      {company && (
        <div className="company-info">
          <h1 className="title-dashboard">{company.businessName} Statistics</h1>

          <div className="date-filter">
            <label>
              From:
              <input
                type="date"
                name="from"
                value={dateRange.from}
                onChange={handleDateChange}
              />
            </label>
            <label>
              To:
              <input
                type="date"
                name="to"
                value={dateRange.to}
                onChange={handleDateChange}
              />
            </label>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <div className="header-row">
          <div className="dashboard-item">
            <div className="dashboard-title">Nº Of Sale</div>
            <div className="dashboard-value">{headerData.numberOfSales}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-title">Total Amount</div>
            <div className="dashboard-value">$ {headerData.totalAmount}</div>
          </div>
        </div>

        <div className="header-row">
          <div className="dashboard-item">
            <div className="dashboard-title">TAX</div>
            <div className="dashboard-value">{headerData.tax}</div>
          </div>
          <div className="dashboard-item">
            <div className="dashboard-title"></div>
            <div className="dashboard-value">{headerData.cardCash}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-box">
          <h2 className="chart-title">Monthly Sales ($)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2 className="chart-title">Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topProducts}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
