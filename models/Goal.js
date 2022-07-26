const slugify = require('slugify');
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      required: [true, 'Please provide some text'],
    },
    slug: String,
  },
  {
    timestamps: true,
  }
);

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
