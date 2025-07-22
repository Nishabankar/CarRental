import express from "express";
import { checkAvailabilityOfCar, createBooking, getUserBookings, getOwnerBookings, changeBookingstatus, getBookingById, updateBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post( '/check-availability', checkAvailabilityOfCar )
bookingRouter.post( '/create', protect, createBooking )
bookingRouter.get( '/user', protect, getUserBookings )
bookingRouter.get( '/owner', protect, getOwnerBookings )
bookingRouter.post( '/change-status', protect, changeBookingstatus )
bookingRouter.get('/:id', protect, getBookingById); 
bookingRouter.put('/:id', protect, updateBooking);

export default bookingRouter;
