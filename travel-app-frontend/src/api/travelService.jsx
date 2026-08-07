import api from "./axios";

export const travelService = {
  getPlans: async () => {
    const response = await api.get("/travel/plans");
    return response.data;
  },

  getPlanById: async (id) => {
    const response = await api.get(`/travel/plans/${id}`);
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post("/travel/plans", planData);
    return response.data;
  },

  deletePlan: async (id) => {
    const response = await api.delete(`/travel/plans/${id}`);
    return response.data;
  },

  getDestinations: async (planId) => {
    const response = await api.get(`/travel/plans/${planId}/destinations`);
    return response.data;
  },

  addDestination: async (planId, destinationData) => {
    const response = await api.post(
      `/travel/plans/${planId}/destinations`,
      destinationData,
    );
    return response.data;
  },

  updateDestination: async (planId, destinationId, destinationData) => {
    const response = await api.put(
      `/travel/plans/${planId}/destinations/${destinationId}`,
      destinationData,
    );
    return response.data;
  },

  deleteDestination: async (planId, destinationId) => {
    const response = await api.delete(
      `/travel/plans/${planId}/destinations/${destinationId}`,
    );
    return response.data;
  },

  getActivities: async (planId) => {
    const response = await api.get(`/travel/plans/${planId}/activities`);
    return response.data;
  },

  addActivity: async (planId, activityData) => {
    const response = await api.post(
      `/travel/plans/${planId}/activities`,
      activityData,
    );
    return response.data;
  },

  updateActivity: async (planId, activityId, activityData) => {
    const reponse = await api.put(
      `/travel/plans/${planId}/activities/${activityId}`,
      activityData,
    );
    return response.data;
  },

  deleteActivity: async (planId, activityId) => {
    const response = await api.delete(
      `/travel/plans/${planId}/activities/${activityId}`,
    );
    return response.data;
  },
};
