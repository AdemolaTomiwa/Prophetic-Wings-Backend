import express from 'express';

const router = express.Router();

import Load from '../models/loadModel.js';

// Get all loads
// GET @/api/loads
// public
router.get('/', async (req, res) => {
   try {
      const keyword = req.query.search
         ? {
              $or: [
                 { message: { $regex: req.query.search, $options: 'i' } },
                 { date: { $regex: req.query.search, $options: 'i' } },
                 { year: { $regex: req.query.search, $options: 'i' } },
                 { month: { $regex: req.query.search, $options: 'i' } },
              ],
           }
         : {};

      const loads = await Load.find(keyword).sort({ createdAt: -1 });

      res.status(200).json(loads);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get all loads
// GET @/api/loads/singleload/:id
// public
router.get('/singleload/:id', async (req, res) => {
   try {
      const load = await Load.findById(req.params.id);

      res.status(200).json(load);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get all loads
// GET @/api/loads/latest
// public
router.get('/latest', async (req, res) => {
   try {
      const loads = await Load.find().sort({ createdAt: -1 }).limit(10);
      res.status(200).json(loads);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Get today load
// GET @/api/loads/today
// public
router.get('/today', async (req, res) => {
   try {
      const load = await Load.find().sort({ createdAt: -1 });

      if (load.length === 0) {
         res.status(400).json({ msg: 'Error' });
      } else {
         res.status(200).json(load[0]);
      }

      // res.status(200).json({ msg: 'No load!' });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Create new load
// POST @/api/loads
// Private
router.post('/', async (req, res) => {
   try {
      const { message } = req.body;

      const today = new Date();

      const date = today.getDate();
      const year = today.getFullYear();

      var months = [
         'january',
         'february',
         'march',
         'april',
         'may',
         'june',
         'july',
         'august',
         'september',
         'october',
         'november',
         'december',
      ];

      var month = today.getMonth();

      const load = new Load({
         date,
         month: months[month],
         year,
         message,
      });

      const savedLoad = await load.save();

      res.status(201).json(savedLoad);
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

// Create new comment
// POST @/api/loads/:id/comment
// Private
router.post('/:id/comment', async (req, res) => {
   try {
      const { comment, name, email } = req.body;

      Load.findById(req.params.id).then((load) => {
         const newComment = {
            comment,
            name,
            email,
         };

         load.comments.push(newComment);

         load.save().then((newLoad) => res.status(201).json(newLoad));
      });
   } catch (err) {
      res.status(500).json({ msg: 'An error occured!' });
   }
});

export default router;
