# Wanderlust
### [Live link ](#https://binaydas-wanderlust.onrender.com/)

`https://binaydas-wanderlust.onrender.com`

***Wanderlust*** is a **Full Stack MERN Application** project that mimics the functionality of Airbnb. It allows users to list properties, view details, leave reviews, and manage user authentication securely. The application follows modern web development practices and includes features like image uploads, sessions, authentication, and authorization.

## Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation and Setup](#installation-and-setup)
4. [Environment Variables](#environment-variables)
5. [Folder Structure](#folder-structure)
6. [Usage](#usage)
7. [API Routes](#api-routes)
8. [Middleware](#middleware)
9. [Error Handling](#error-handling)
10. [Contributing](#contributing)

## Features

- **User Authentication**
  - Secure user registration and login using Passport.js and sessions.
  - Flash messages for login and signup feedback.
- **Listings**
  - Add, edit, view, and delete property listings.
  - Upload property images to Cloudinary.
  - Server-side validation using Joi.
- **Reviews**
  - Add and delete reviews for listings.
  - Validation for reviews, including rating and comment requirements.
- **Authorization**
  - Protect routes to ensure only logged-in users can access certain features.
  - Restrict actions (edit/delete) to listing/review owners.
- **Responsive Design**
  - Mobile-friendly, modern, and user-centered interface.
- **Error Handling**
  - Custom error classes for structured error reporting.
  - Graceful error pages for user-friendly feedback.



---

## Technologies Used

- **Frontend**: EJS templating engine for dynamic server-side rendering.
- **Backend**: Node.js with Express.js for building RESTful APIs.
- **Database**: MongoDB with Mongoose for schema validation and data management.
- **Authentication**: Passport.js with `passport-local-mongoose`.
- **Image Hosting**: Cloudinary for managing and serving images.
- **Validation**: Joi for request validation.
- **Session Management**: `express-session` with MongoDB-backed store (`connect-mongo`).
- **Middleware**: `connect-flash`, `method-override`, `multer` and much more

---

## Installation and Setup
1. **Clone the Repository**  
    ```bash
    git clone https://github.com/binay-das/wanderlust.git
    cd airbnb-clone
    ```
2. Install Dependencies
    ```bash
    npm install 
    ```

3. Set Up MongoDB
    ```bash
    Make a .env file and provide all the environment variables needed
    ```
4. Run the application
    ```bash
    npm start
    ```

## Folder Structure

```plaintext
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/
│   ├── css/
│   │   ├── rating.css
│   │   └── style.css
│   └── js/
│       ├── script.js
│       └── utilityFunctions.js
├── routes/
│   ├── listingRouter.js
│   ├── reviewRouter.js
│   └── userRouter.js
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── homepage.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   ├── users/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   │   
│   └── error.ejs
│  
│  
├── .env
├── .gitignore
├── app.js
├── cloudConfig.js
├── middleware.js
├── package-lock.json
├── package.json
├── README.md
└── schema.js
```
---

## Contributing
Contributions are welcome! Please fork this repository and create a pull request with your changes.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your changes to the feature branch.
5. Create a pull request.