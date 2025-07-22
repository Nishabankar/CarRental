import Booking from "../models/Booking.js"
import Car from "../models/Car.js"


// Function to check availability of Car for a given Date
const checkAvailability = async ( car, pickupDate, returnDate ) => {
    const bookings = await Booking.find( {
        car,
        pickupDate: { $lte: returnDate },
        returnDate: {$gte: pickupDate},
    } )
    return bookings.length === 0
}


// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async ( req, res ) => {
    try {
        const { location, pickupDate, returnDate } = req.body

        // fetch all avaliable cars for the given location
        const cars = await Car.find( { location, isAvaliable: true } )

        // check car availability for the given date range using promise
        const avaliableCarsPromises = cars.map( async ( car ) => {
            const isAvaliable = await checkAvailability( car._id, pickupDate, returnDate )
            return { ...car._doc, isAvaliable: isAvaliable}
        } )

        let avaliableCars = await Promise.all( avaliableCarsPromises );
        avaliableCars = avaliableCars.filter( car => car.isAvaliable === true )

        res.json({success: true, avaliableCars})

    } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}


// API to Create Booking

export const createBooking = async ( req, res ) => {
    try {
        const { _id } = req.user;
        const { car, pickupDate, returnDate } = req.body;
        const isAvaliable = await checkAvailability( car, pickupDate, returnDate )
        if ( !isAvaliable ) {
            return res.json({success: false, message: "Car is not avaliable"})
        }
        const carData = await Car.findById( car )

        // Calculate price based on pickupdate and returnDate
        const picked = new Date(pickupDate);
       const returned = new Date(returnDate);
       const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
       const price = carData.pricePerDay * noOfDays;

          await Booking.create({ car, owner: carData.owner, user: _id, pickupDate, returnDate, price });

         res.json({ success: true, message: "Booking Created", price, noOfDays });


       } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}


// Api to List User Bookings
export const getUserBookings = async ( req, res ) => {
    try {

        const { _id } = req.user;
        const bookings = await Booking.find( { user: _id } ).populate( "car").sort( { createdAt: -1 } )
        res.json({success: true, bookings})

    } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}


// API to get Owner Bookings
export const getOwnerBookings = async ( req, res ) => {
    try {
        if ( req.user.role !== 'owner' ) {
          return res.json({success: false, message: "Unauthorized"})
        }

        const bookings = await Booking.find( { owner: req.user._id } ).populate( 'car user' ).select( "-user.password" ).sort( { createdAt: -1 } )
        res.json({success: true, bookings})


    } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}




// API to change  booking status
export const changeBookingstatus = async ( req, res ) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body
        const booking = await Booking.findById( bookingId )
        if ( booking.owner.toString() !== _id.toString() ) {
            return res.json({success: false, message: "unauthorized"})
        }
        booking.status = status;
        await booking.save();
        res.json({success: true, message: "Status Updated"})

    } catch (error) {
        console.log( error.message );
        res.json({success: false, message: error.message})
    }
}


// GET /api/bookings/:id - Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error("Get Booking Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// PUT /api/bookings/:id
export const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { pickupDate, returnDate } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
        const carData = await Car.findById(booking.car);
        const price = carData.pricePerDay * noOfDays;

        booking.pickupDate = pickupDate;
        booking.returnDate = returnDate;
        booking.price = price;

        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.error("Update Booking Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
