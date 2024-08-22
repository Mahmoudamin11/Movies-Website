import { api } from "../components/fetchData";

export const getPersonCredits = async (id) => {
    const response = await api.get(`/person/${id}/combined_credits`);
    return response.data;
};