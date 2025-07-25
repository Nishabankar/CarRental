import express from "express";
import {protect} from "../middleware/auth.js"
import { changeRoleToOwner, addCar, getOwnerCars, toggleCarAvailability, deleteCar, getDashboardData, updateUserImage, getCarById, editCar } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post( "/change-role", protect, changeRoleToOwner )
ownerRouter.post( "/add-car", upload.single( "image" ), protect, addCar )
ownerRouter.get( "/cars", protect, getOwnerCars )
ownerRouter.post( "/toggle-car", protect, toggleCarAvailability )
ownerRouter.post( "/delete-car", protect, deleteCar )
ownerRouter.get( '/dashboard', protect, getDashboardData )
ownerRouter.post( '/update-image', upload.single( "image" ), protect, updateUserImage )
ownerRouter.get( "/car/:id", protect, getCarById );
ownerRouter.put('/edit-car/:id', upload.single('image'), editCar);




export default ownerRouter;
