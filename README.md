# Livana — Your Marketplace for Short-Term Rentals

A full‑stack web application, built to provide a smooth experience for booking and hosting unique stays. It connects people who want to rent out their properties (hosts) with travelers looking for short-term accommodations (guests).
The platform is built on trust, using verified identities and guest/host reviews to help users find and book places securely. 
Developed using Node.js, Express, MongoDB, EJS, and Mapbox, with user authentication, image uploading, geolocation mapping, and CRUD listings.

---

# 🔗 Live Link

[https://livana.onrender.com](https://livana.onrender.com/)

---

## 🚀 Features
- 🔐 Authentication
  - Secure user signup/login using Passport.js
  - Password hashing with passport-local-mongoose
- 🏡 Listings Management
  - Create, read, update, and delete property listings
  - Upload multiple images using Multer + Cloudinary
- 🗺️ Interactive Maps
  - Location-based listings using Mapbox Geocoding API
- 💬 Flash Messages
  - Success/error alerts using connect-flash
- 🔒 Sessions
  - User sessions stored securely in MongoDB using connect-mongo
- 🗂️ Backend Validation
  - Request validation using Joi
- 🧱 Templating Engine
  - Server-side rendered pages with EJS + EJS-Mate

---

## 🧰 Tech Stack

Frontend
- HTML, CSS, JavaScript
- EJS templating
- Bootstrap + Custom CSS

Backend
- Node.js, Express.js
- MongoDB + Mongoose
- Passport.js for authentication
- Multer + Cloudinary for media uploads

APIs
- Mapbox API for geolocation & maps

---

## 📦 Key Dependencies
(see package.json for full list)
express, mongoose, passport, passport-local, passport-local-mongoose, ejs, ejs-mate, cloudinary, multer, multer-storage-cloudinary, @mapbox/mapbox-sdk, connect-flash, connect-mongo, express-session, joi, dotenv, method-override

---

## 📁 Project Structure

Use the tree below to get a quick overview of the repository layout:

```
Livana/
├── .env
├── README.md
├── app.js
├── package.json
├── controllers/
├── middleware/
├── models/
├── public/
│   ├── css/
│   ├── images/
│   └── js/
├── routes/
├── utils/
└── views/
    ├── layouts/
    ├── partials/
    └── index.ejs
```


Notes:
- /public contains static assets served to clients (CSS, client JS, images).
- /views holds EJS templates, with layouts and partials organized for reuse.
- /models contains Mongoose schemas.
- /routes defines Express route handlers; controllers contain route logic.
- /utils and /middleware include helper functions and custom middleware respectively.

---

## 🔧 Installation & Setup

1. Clone the repo

git clone https://github.com/aryanSE7374/Livana.git
cd Livana

2. Install dependencies

npm install

3. Configure environment variables

Create a .env file in the project root and add the following (replace values accordingly):

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

MAPBOX_TOKEN=your_mapbox_token

MONGO_URL=mongodb://localhost:27017/livana

SESSION_SECRET=your_secret

---

## ▶️ Run the Project

Development mode:

npm run dev

Production mode:

npm start

By default the app runs on:
http://localhost:8080

---


## 🖼️ Screenshots



## Homepage
<img height="250" alt="Screenshot 2025-12-02 at 6 38 51 PM" src="https://github.com/user-attachments/assets/da95fbf6-5856-4428-8dcf-66553d6d7ceb" />

## Login Page
<img height="250" alt="Screenshot 2025-12-02 at 6 40 35 PM" src="https://github.com/user-attachments/assets/36819845-9181-46c6-afa7-6a9069e7a0c0" />

## Add Listing Page
<img height="250" alt="Screenshot 2025-12-02 at 6 45 59 PM" src="https://github.com/user-attachments/assets/917087b3-411c-4034-869d-473b5daf067d" />

## Map Preview of Sample Listing
<img height="250" alt="Screenshot 2025-12-02 at 6 47 07 PM" src="https://github.com/user-attachments/assets/5785b1a0-5bd0-4df4-bc9b-4cd555b2dde7" />

## Edit Listing Page
<img height="250" alt="Screenshot 2025-12-02 at 6 48 16 PM" src="https://github.com/user-attachments/assets/9793a5ba-53ce-406c-8480-e20450632302" />


<!--

<img width="500" height="500" alt="livana-logo" src="https://github.com/user-attachments/assets/b807fe82-2568-4e8b-96a8-d66e38f49da7" />

-->

---

## 🔮 Future Scope
- 💳 Payment Gateway (Razorpay Integration)
- ⭐ Review & Ratings System
- ❤️ Wishlist / Favorites
- 📧 Email Notifications
- 📱 Responsive design improvements
- 🧭 Advanced search filters (price, amenities, location radius)

---

## 🤝 Contributing
Pull requests are welcome!  
If you'd like to contribute:
1. Fork the repository
2. Create a branch: git checkout -b feat/your-feature
3. Write tests for new features where appropriate
4. Follow the existing code style and run linting
5. Open a pull request describing your changes

Please open an issue to discuss major changes before working on them.

---

## 📝 License
This project is licensed under the ISC License. See the LICENSE file for details.

---
