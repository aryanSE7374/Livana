const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { isLoggedIn } = require("../middleware.js");

const Booking = require("../models/booking.js");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get availability for a listing
router.get("/availability/:listingId", async (req, res) => {
    try {
        const bookings = await Booking.find({ 
            listing: req.params.listingId,
            status: "confirmed"
        });
        
        const bookedDates = bookings.map(b => ({
            start: b.checkIn.toISOString().split('T')[0],
            end: b.checkOut.toISOString().split('T')[0]
        }));
        
        res.json({ success: true, bookedDates });
    } catch (err) {
        console.log("Availability check error:", err);
        res.status(500).json({ success: false, message: "Could not fetch availability" });
    }
});

// Create a Razorpay order
router.post("/create-order", isLoggedIn, async (req, res) => {
    try {
        const { amount, listing_id, checkIn, checkOut } = req.body;
        
        // Double check availability before creating order
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        const conflictingBookings = await Booking.find({
            listing: listing_id,
            status: "confirmed",
            $or: [
                { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
            ]
        });
        
        if (conflictingBookings.length > 0) {
            return res.status(400).json({ success: false, message: "Selected dates are no longer available" });
        }

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `rcpt_${listing_id.slice(-8)}_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (err) {
        console.log("Razorpay order creation error:", err);
        res.status(500).json({ success: false, message: "Could not create order" });
    }
});

// Verify payment signature
router.post("/verify", isLoggedIn, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, checkIn, checkOut, amount, listing_id } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Create booking
            const newBooking = new Booking({
                listing: listing_id,
                guest: req.user._id,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                amount: amount,
                razorpay_order_id,
                razorpay_payment_id,
                status: "confirmed"
            });
            await newBooking.save();

            req.flash("success", "Payment successful! Your booking is confirmed.");
            res.json({ success: true, redirect: "/profile" });
        } else {
            req.flash("error", "Payment verification failed.");
            res.json({ success: false, redirect: req.headers.referer || "/listings" });
        }
    } catch (err) {
        console.log("Razorpay verification error:", err);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
});

module.exports = router;
