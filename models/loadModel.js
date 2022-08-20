import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         unique: true,
      },
      comment: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

const loadSchema = mongoose.Schema(
   {
      message: {
         type: String,
         required: true,
      },
      date: {
         type: String,
         required: true,
      },
      year: {
         type: String,
         required: true,
      },
      month: {
         type: String,
         required: true,
      },
      comments: [commentSchema],
   },
   {
      timestamps: true,
   }
);

const Load = mongoose.model('Load', loadSchema);

export default Load;
