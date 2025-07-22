import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const EditBooking = () => {
    const { id } = useParams();
    const { axios } = useAppContext();
    const navigate = useNavigate();

    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    useEffect(() => {
        // Fetch booking data
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`/api/bookings/${id}`);
                setPickupDate(res.data.data.pickupDate.split('T')[0]);
                setReturnDate(res.data.data.returnDate.split('T')[0]);
            } catch (error) {
                toast.error("Failed to load booking");
            }
        };
        fetchBooking();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/bookings/${id}`, { pickupDate, returnDate });
            toast.success("Booking updated successfully");
            navigate('/my-bookings');
        } catch (err) {
            toast.error("Failed to update booking");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold">Edit Booking</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Pickup Date:</label>
                    <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1">Return Date:</label>
                    <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Upadte Booking 
                </button>
            </form>
        </div>
    );
};

export default EditBooking;
