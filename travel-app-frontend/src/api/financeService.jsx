import api from "./axios";

export const financeService = {
  getExpenseById: async (id) => {
    const response = await api.get(`/finance/expenses/${id}`);
    return response.data;
  },

  addExpense: async (expenseData) => {
    const response = await api.post("/finance/expenses", expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await api.delete(`/finance/expenses/${id}`);
    return response.data;
  },

  getFinanceSummary: async (travelPlanId) => {
    const response = await api.get(`/finance/plans/${travelPlanId}/summary`);
    return response.data;
  },
};
