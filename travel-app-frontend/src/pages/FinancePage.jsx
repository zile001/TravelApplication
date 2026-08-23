import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { financeService } from "../api/financeService";
import { travelService } from "../api/travelService";
import "../styles/FinancePage.css";

const CATEGORIES = [
  { value: 0, label: "Prevoz" },
  { value: 1, label: "Smestaj" },
  { value: 2, label: "Hrana" },
  { value: 3, label: "Aktivnosti" },
  { value: 4, label: "Kupovina" },
  { value: 5, label: "Ostalo" },
];

export const FinancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [plannedBudget, setPlannedBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: 0,
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [summaryData, expensesData, planData] = await Promise.all([
        financeService.getFinanceSummary(id),
        financeService.getExpensesByPlan(id),
        travelService.getPlanById(id),
      ]);

      setSummary(summaryData);
      setExpenses(expensesData || []);
      setPlannedBudget(planData?.budget || 0);
    } catch (err) {
      console.error("Greska pri ucitavanju finansijskih podataka", err);
      setError("Neuspsesno ucitavanje finansijskih podataka");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "category" || name === "amount" ? Number(value) : value,
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    try {
      setError("");

      const dto = {
        travelPlanId: id,
        title: formData.title,
        description: formData.description || null,
        amount: Number(formData.amount),
        category: Number(formData.category),
        date: formData.date
          ? new Date(formData.date).toISOString()
          : new Date().toISOString(),
      };

      await financeService.addExpense(dto);

      setFormData({
        title: "",
        description: "",
        amount: "",
        category: 0,
        date: new Date().toISOString().split("T")[0],
      });

      await loadData();
    } catch (err) {
      console.error("Greska pri dodavanju troska:", err);
      setError("Neuspesno dodavanje troska.");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Da li ste sigurni da zelite obrisati ovaj trosak?"))
      return;

    try {
      await financeService.deleteExpense(expenseId);
      await loadData();
    } catch (err) {
      console.error("Greska pri brisanju troska:", err);
      setError("Neuspesno brisanje troska");
    }
  };

  if (loading)
    return <div className="loading-state">Ucitavanje finansija...</div>;

  const totalSpent = summary?.totalSpent || 0;
  const remainingBudget = plannedBudget - totalSpent;

  return (
    <div className="finance-container">
      <button className="btn-back" onClick={() => navigate(`/plans/${id}`)}>
        Nazad na plan putovanja
      </button>
      <h2 className="finance-title">Evidencija troskova i budzeta</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="summary-card">
        <div className="budget-stats">
          <div className="stat-item">
            <span className="stat-label">Planirani budžet</span>
            <span className="stat-value">{plannedBudget} EUR</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Ukupno potrošeno</span>
            <span className="stat-value">{totalSpent} EUR</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Preostali budžet</span>
            <span
              className={`stat-value remaining ${remainingBudget >= 0 ? "positive" : "negative"}`}
            >
              {remainingBudget} EUR
            </span>
          </div>
        </div>

        {summary?.spentByCategory && (
          <div className="category-summary">
            <h4>Potrošnja po kategorijama:</h4>
            <ul className="category-list">
              {Object.entries(summary.spentByCategory).map(([cat, amount]) => (
                <li key={cat}>
                  <strong>{cat}:</strong> {amount} EUR
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form className="financeForm" onSubmit={handleAddExpense}>
        <h3>Dodaj novi trosak</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Naziv:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Opis (opciono):</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Iznos (EUR):</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Kategorija:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Datum:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button className="btn-submit" type="submit">
          Sacuvaj trosak
        </button>
      </form>
      <div className="table-card">
        <h3>Lista svih troškova</h3>
        {expenses.length === 0 ? (
          <p className="empty-state">Nema evidentiranih troškova.</p>
        ) : (
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Naziv</th>
                <th>Opis</th>
                <th>Kategorija</th>
                <th>Iznos (EUR)</th>
                <th>Datum</th>
                <th>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>{exp.description || "-"}</td>
                  <td>
                    {CATEGORIES.find((c) => c.value === exp.category)?.label ||
                      exp.category}
                  </td>
                  <td>{exp.amount}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteExpense(exp.id)}
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
