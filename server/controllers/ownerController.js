import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import mongoose from 'mongoose';
import fs from 'fs/promises';




// API to Change Role of User
export const changeRoleToOwner = async ( req, res ) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate( _id, { role: "owner" } )
        res.json({success: true, message:"Now you can list cars"})
    } catch ( error ) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}

// API to List car
export const addCar = async ( req, res ) => {
    try {
        const { _id } = req.user;
        let car = JSON.parse( req.body.carData );
        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync( imageFile.path )
        const response = await imagekit.upload( {
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        } )

        // optimization throught imagekit URL transformation
          var optimizedImageUrl = imagekit.url({
          path : response.filePath,
              transformation: [
                  {width: '1280'}, // width resizing
                  {quality: 'auto'}, // Auto compression
                  {format: 'webp'}  // Convert to modern format
        ]
          } );

        const image = optimizedImageUrl;
        await Car.create( { ...car, owner: _id, image } )

        res.json({success: true, message: "Car Added"})

    } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}



// API to List Owner Cars
export const getOwnerCars = async (req, res ) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find( { owner: _id } )
        res.json({success: true, cars})

    } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}



// API to Toggle Car Availability
export const toggleCarAvailability = async ( req, res ) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body
        const car = await Car.findById( carId )

        // Checking is car belongs to the user
        if ( car.owner.toString() !== _id.toString() ) {
            return res.json( { success: false, message: "unauthorized"});
        }
        car.isAvaliable = !car.isAvaliable;
        await car.save()

        res.json({success: true, message: "availability Toggled"})

     } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
     }
}



// API to delete a car
export const deleteCar = async ( req, res ) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body
        const car = await Car.findById( carId )

        // Checking is car belongs to the user
        if ( car.owner.toString() !== _id.toString() ) {
            return res.json( { success: false, message: "unauthorized"});
        }
        car.owner = null;
        car.isAvaliable = false;
        await car.save()

        res.json({success: true, message: "Car Removed"})

     } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
     }
}

// GET /api/owner/car/:id
export const getCarById = async (req, res) => {
    try {
      const { id } = req.params;
      const car = await Car.findById(id);

      if (!car) {
        return res.status(404).json({ success: false, message: "Car not found" });
      }

      res.json(car);
    } catch (error) {
      console.error("Error fetching car:", error);
      res.status(500).json({ success: false, message: "Failed to fetch car" });
    }
  };



 // API to update  car  information
 // PUT /api/cars/:id

 
 export const editCar = async (req, res) => {
   try {
     const { id } = req.params;
     const carData = JSON.parse(req.body.carData);

     if (req.file) {
       const fileBuffer = await fs.readFile(req.file.path);

       const response = await imagekit.upload({
         file: fileBuffer,
         fileName: req.file.originalname,
         folder: '/cars'
       });

       const optimizedImageUrl = imagekit.url({
         path: response.filePath,
         transformation: [
           { width: '1280' },
           { quality: 'auto' },
           { format: 'webp' }
         ]
       });

       carData.image = optimizedImageUrl;

       await fs.unlink(req.file.path); // ✅ properly deletes temp file
     }

     const updatedCar = await Car.findByIdAndUpdate(id, carData, { new: true });

     if (!updatedCar) {
       return res.status(404).json({ error: 'Car not found' });
     }

     res.status(200).json(updatedCar);
   } catch (error) {
     console.error('Error updating car:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 };

// API to get Dashboard Data
export const getDashboardData = async ( req, res ) => {
    try {
        const { _id, role } = req.user;
        if ( role !== 'owner' ) {
            return res.json( { success: false, message: "unauthorized"});
        }


        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find( { owner: _id } ).populate( 'car', 'brand model' ).sort( { createdAt: -1 } );

        const pendingBookings = await Booking.find( { owner: _id, status: "pending" } )

        const completedBookings = await Booking.find( { owner: _id, status: "confirmed" } )

        // Calculate monthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = bookings.slice().filter( booking => booking.status === 'confirmed' ).reduce( ( acc, booking ) => acc + booking.price, 0 )

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice( 0, 3 ),
            monthlyRevenue
        }

        res.json( { success: true, dashboardData } );

    } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}


// API to update user image

export const updateUserImage = async ( req, res ) => {
    try {

        const { _id } = req.user;

        const imageFile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync( imageFile.path )
        const response = await imagekit.upload( {
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        } )

        // optimization throught imagekit URL transformation
          var optimizedImageUrl = imagekit.url({
          path : response.filePath,
              transformation: [
                  {width: '400'}, // width resizing
                  {quality: 'auto'}, // Auto compression
                  {format: 'webp'}  // Convert to modern format
                ]
          } );

        const image = optimizedImageUrl;
        await User.findByIdAndUpdate( _id, { image } );
        res.json({success: true, message: "Image Updated"})

    } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}
