import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { checklistService } from "../api/checklistService";

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
        fetchChecklistItems();
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

  if (loading) return <div>Ucitavanje stavki...</div>;

  return (
    <div>
      <button onClick={() => navigate(`/plans/${id}`)}>
        Nazad na detalje plana
      </button>

      <h2>Cek lista za pakovanje</h2>

      {error && <div>{error}</div>}

      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          required
        />
        <button type="submit">Dodaj na listu</button>
      </form>

      <div>
        {items.length === 0 ? (
          <p>Nema dodatih stvari na ček-listi.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <input
                  type="checkbox"
                  checked={item.isPacked || false}
                  onChange={() => handleTogglePacked(item.id, item.isPacked)}
                />
                <span
                  style={{
                    textDecoration: item.isPacked ? "line-through" : "none",
                  }}
                >
                  {item.title}
                </span>
                <button onClick={() => handleDeleteItem(item.id)}>
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
