import api from "./axios";

export const checklistService = {
  addItem: async (itemData) => {
    const response = await api.post("/checklist/items", itemData);
    return response.data;
  },

  getItemById: async (id) => {
    const response = await api.get(`/checklist/items/${id}`);
    return response.data;
  },

  getItemsByPlan: async (travelPlanId) => {
    const response = await api.get(`/checklist/plans/${travelPlanId}/items`);
    return response.data;
  },

  updateItemStatus: async (id, isPacked) => {
    const response = await api.patch(`/checklist/items/${id}/status`, {
      isPacked,
    });
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await api.delete(`/checklist/items/${id}`);
    return response.data;
  },
};
