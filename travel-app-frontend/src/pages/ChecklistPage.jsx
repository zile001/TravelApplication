import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checklistService } from "../api/checklistService";
import "../styles/ChecklistPage.css";

export const ChecklistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    if (id) {
      fetchChecklistItems();
    }
  }, [id]);

  const fetchChecklistItems = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await checklistService.getItemsByPlan(id);
      setItems(data || []);
    } catch (err) {
      console.error("Greska pri ucitavanju stavki:", err);
      setError("Neuspesno ucitavanje stavki");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      setError("");
      const itemData = {
        title: newItemName,
        category: "",
        travelPlanId: id,
        isPacked: false,
      };

      const newItem = await checklistService.addItem(itemData);

      if (newItem) {
        setItems((prev) => [...prev, newItem]);
      } else {
        await fetchChecklistItems();
      }

      setNewItemName("");
    } catch (err) {
      console.error("Greska pri dodavanju stavke", err);
      setError("Neuspesno dodavanje stavke");
    }
  };

  const handleTogglePacked = async (itemId, currentPackedStatus) => {
    try {
      const updatedStatus = !currentPackedStatus;
      await checklistService.updateItemStatus(itemId, updatedStatus);

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isPacked: updatedStatus } : item,
        ),
      );
    } catch (err) {
      console.error("Greska pri izmeni statusa:", err);
      alert("Neuspesna izmena statusa stavke");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (
      !window.confirm("Da li ste sigurni da želite da obrišete ovu stavku?")
    ) {
      return;
    }

    try {
      await checklistService.deleteItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Greška pri brisanju stavke:", err);
      alert("Neuspešno brisanje stavke");
    }
  };

  const packedCount = items.filter((item) => item.isPacked).length;
  if (loading) return <div className="loading-state">Ucitavanje stavki...</div>;

  return (
    <div className="checklist-container">
      <button className="btn-back" onClick={() => navigate(`/plans/${id}`)}>
        Nazad na detalje plana
      </button>

      <div className="checklist-header">
        <h2>Ček lista za pakovanje</h2>
        {items.length > 0 && (
          <div className="checklist-progress">
            Spakovano: {packedCount} od {items.length}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleAddItem} className="checklist-form">
        <input
          className="checklist-input"
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          required
        />
        <button className="btn-add" type="submit">
          Dodaj na listu
        </button>
      </form>

      <div className="checklist-card">
        {items.length === 0 ? (
          <p className="empty-message">Nema dodatih stvari na ček-listi.</p>
        ) : (
          <ul className="checklist-items">
            {items.map((item) => (
              <li
                className={`checklist-item ${item.isPacked ? "packed" : ""}`}
                key={item.id}
              >
                <div
                  className="item-content"
                  onClick={() => handleTogglePacked(item.id, item.isPacked)}
                >
                  <input
                    type="checkbox"
                    className="checkbox-custom"
                    checked={item.isPacked || false}
                    onChange={() => handleTogglePacked(item.id, item.isPacked)}
                  />
                  <span
                    className={`item-title ${item.isPacked ? "packed" : ""}`}
                  >
                    {item.title}
                  </span>
                </div>
                <button
                  className="btn-delete-small"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Obriši
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
