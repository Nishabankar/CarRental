import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`/api/owner/car/${id}`);
        setCar(data);
        setImage(data.image); // Assuming backend returns image URL
      } catch (err) {
        toast.error('Failed to load car data');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('carData', JSON.stringify(car));
      if (typeof image === 'object') {
        formData.append('image', image);
      }

      const res = await axios.put(`/api/owner/edit-car/${id}`, formData);
      toast.success('Car updated successfully');
      navigate('/owner/manage-cars');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title="Edit Car" subTitle="Update your car details here." />

      <form onSubmit={handleSubmit} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Image Upload */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
            <img
              src={
                image
                  ? typeof image === 'string'
                    ? image
                    : URL.createObjectURL(image)
                  : assets.upload_icon
              }
              alt=""
              className='h-14 rounded cursor-pointer'
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={e => setImage(e.target.files[0])}
            />
          </label>
          <p className='text-sm text-gray-500'>Update your car image</p>
        </div>

        {/* Brand and Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={car.brand}
              onChange={handleChange}
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            />
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input
              type="text"
              name="model"
              value={car.model}
              onChange={handleChange}
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            />
          </div>
        </div>

        {/* Year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={car.year}
              onChange={handleChange}
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            />
          </div>

          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input
              type="number"
              name="pricePerDay"
              value={car.pricePerDay}
              onChange={handleChange}
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            />
          </div>

          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select
              name="category"
              value={car.category}
              onChange={handleChange}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
            </select>
          </div>
        </div>

        {/* Transmission, Fuel, Seating */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select
              name="transmission"
              value={car.transmission}
              onChange={handleChange}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select a Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
          </div>

          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select
              name="fuel_type"
              value={car.fuel_type}
              onChange={handleChange}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
              <option value="">Select fuel type</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Petrol">Petrol</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input
              type="number"
              name="seating_capacity"
              value={car.seating_capacity}
              onChange={handleChange}
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            />
          </div>
        </div>

        {/* Location */}
        <div className='flex flex-col w-full'>
          <label>Location</label>
          <select
            name="location"
            value={car.location}
            onChange={handleChange}
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value="">Select a location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
          </select>
        </div>

        {/* Description */}
        <div className='flex flex-col w-full'>
          <label>Description</label>
          <textarea
            name="description"
            rows={5}
            value={car.description}
            onChange={handleChange}
            required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
          ></textarea>
        </div>

        <button type="submit" className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt="" />
          Update Car
        </button>
      </form>
    </div>
  );
};

export default EditCar;
