import axiosInstance from './axiosInstance'; // Assuming this is the file where you set up axiosInstance

const fetchReservations = async () => {
    try {
        const response = await axiosInstance.get('reservations?days=30');
        return response.data;
    } catch (error) {
        if (error.response.status === 400) {
            throw new Error('Error fetching reservations. Please try again later.');
        } else {
            throw new Error('Critical error fetching reservations, contact support!');
        }
    }
};

export default fetchReservations;
