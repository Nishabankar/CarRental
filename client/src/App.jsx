import React, { useState } from 'react'
import { useLocation, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CartDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import Footer from './components/Footer'
import Layout from './pages/owner/Layout'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Dashboard from './pages/owner/Dashboard'
import Login from './components/Login'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import EditBooking from './pages/EditBooking'
import EditCar from './pages/owner/EditCar'

const App = () => {
  const {showLogin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
      <Toaster/>
      {showLogin && <Login/>}

      {!isOwnerPath && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CartDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path="/edit-booking/:id" element={<EditBooking />} />




        {/* Nested Routes for Owner Dashboard */}
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='manage-cars' element={<ManageCars />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
          <Route path="edit-car/:id" element={<EditCar />} />
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App
