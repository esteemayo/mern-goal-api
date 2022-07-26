const slugify = require('slugify');
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      required: [true, 'Please provide a text value'],
      maxlength: [30, 'A goal text must have less or equal than 30 characters'],
      minlength: [10, 'A goal text must have equal or more than 10 characters'],
    },
    slug: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A goal must belong to a user'],
    },
  },
  {
    timestamps: true,
  }
);

goalSchema.index({ text: 1, slug: 1 });

goalSchema.pre('save', async function (next) {
  if (!this.isModified('text')) return next();
  this.slug = slugify(this.text, { lower: true });

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const goalWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (goalWithSlug.length) {
    this.slug = `${this.slug}-${goalWithSlug.length + 1}`;
  }
});

const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);

module.exports = Goal;
