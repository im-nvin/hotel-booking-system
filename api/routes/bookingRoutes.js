const express = require('express');
const router = express.Router();
const Booking = require('../modals/booking');
const Room = require('../modals/room')
const stripe = require('stripe')('sk_test_51NnjHRSFG277DYySbzbxIwqXm5hioetC6WlYgmgcdNCI3euqiAUEe5UkIuvkuCOq409Yk58quoncYZSlSniZGZ0z00ATBbdHn0')
const { v4: uuidv4 } = require('uuid');


router.post('/bookrooms', async (req, res) => {
    const { room, roomid, fromDate, toDate, totalDays, token, totalamount } = req.body;


    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })
        const payment = await stripe.charges.create(
            {
                amount: totalamount * 100,
                currency: 'inr',  // Specify the currency (you can change it based on your needs)
                customer: customer.id
            }, {
            idempotencyKey: uuidv4()
        })


    } catch (error) {
        console.log(error)
    }





    try {
        const newbooking = new Booking({
            room: room,
            roomid: roomid,
            userid: req.body.userid, // Ensure you have the user ID in the request body or fetch it from the authentication
            fromdate: fromDate,
            todate: toDate,
            totalamount: totalDays * room.rentperday,
            totaldays: totalDays,
            transactionId: "1234"
        });

        const booking = await newbooking.save();
        // const roomtemp = await Room.findOne({ _id: room._id })
        // roomtemp.currentbookings.push({ bookingid: booking._id, fromdate: fromDate, todate: toDate, userid: userid, status: booking.status })

        // await roomtemp.save()
        res.send("Room booked successfully");
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.get('/getbookingsbyuserid', async (req, res) => {
//     const userid = req.body.userid;

//     try {
//         const bookings = await Booking.find({ userid: userid });
//         res.send(bookings);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
router.get('/getbookingsbyuserid/:userid', async (req, res) => {
    const userid = req.params.userid;

    try {
        const bookings = await Booking.find({ userid: userid });
        res.send(bookings);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/getallbookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings); // Send the bookings as JSON response
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/cancelbooking', async (req, res) => {
    const { bookingid, roomid } = req.body;
    try {
        const bookingItem = await Booking.findOne({ _id: bookingid });
        bookingItem.status = "CANCELLED"
        await bookingItem.save()

        const room = await Room.findOne({ _id: roomid })
        const bookings = room.currentbookings;
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
        room.currentbookings = temp;
        await room.save()
        res.send("your booking cancelled successfully")
    } catch (error) {
        console.log("error while cancelling", error)

    }

})
module.exports = router;
