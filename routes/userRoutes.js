import express from 'express';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

import User from '../models/userModel.js';

const router = express.Router();

// Register new user
// POST @/api/users
// Public
router.post('/', async (req, res) => {
   try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
         return res.status(400).json({ msg: 'Please enter all fields!' });

      if (password.length <= 5)
         return res.status(400).json({
            msg: 'Password character should be at least 6 character long!',
         });

      //   Check if user already exist in database
      const userExist = await User.findOne({ email });

      if (userExist)
         return res
            .status(409)
            .json({ msg: 'User already exist! Please login now!' });

      //Create user instance
      const user = new User({
         name,
         email,
         password,
      });

      //   Proceed to hashing password
      bcrypt.genSalt(14, (err, salt) => {
         bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;

            user.password = hash;

            // Save User in DB
            user.save().then((savedUser) => {
               const token = generateToken(savedUser._id);
               res.status(201).json({
                  token,
                  user: {
                     id: savedUser._id,
                     name: savedUser.name,
                     email: savedUser.email,
                     isAdmin: savedUser.isAdmin,
                  },
               });
            });
         });
      });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;
