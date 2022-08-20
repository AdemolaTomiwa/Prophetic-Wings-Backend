import express from 'express';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
const router = express.Router();

import User from '../models/userModel.js';

// Login a user
// POST @/api/auth
// Public
router.post('/', async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password)
         return res.status(400).json({ msg: 'Please enter all fields!' });

      //   Check if user already exist in database
      const user = await User.findOne({ email });

      if (!user)
         return res
            .status(409)
            .json({ msg: 'User does not exist! Please register now!' });

      //   Compare password
      bcrypt.compare(password, user.password).then((isMatch) => {
         if (!isMatch)
            return res.status(409).json({ msg: 'Invalid credentials' });

         // Generate token
         const token = generateToken(user._id);
         //  Login user
         res.status(201).json({
            token,
            user: {
               id: user._id,
               name: user.name,
               email: user.email,
               isAdmin: user.isAdmin,
            },
         });
      });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;
