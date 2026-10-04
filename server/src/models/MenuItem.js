import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [3, 'Description must be at least 3 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least ₹1']
    },
    category: {
      type: String,
      enum: {
        values: ['BREAKFAST', 'MEALS', 'FAST_FOOD', 'SNACKS', 'BEVERAGES', 'DESSERTS', 'HEALTHY'],
        message: '{VALUE} is not a valid food category'
      },
      required: [true, 'Category is required']
    },
    subcategory: {
      type: String,
      trim: true,
      default: 'General'
    },
    foodType: {
      type: String,
      enum: {
        values: ['VEG', 'NON_VEG'],
        message: '{VALUE} must be either VEG or NON_VEG'
      },
      default: 'VEG',
      required: true
    },
    image: {
      type: String,
      required: [true, 'Image URL or path is required'],
      trim: true,
      default: '/images/veg_biriyani.jpg'
    },
    availabilityStatus: {
      type: String,
      enum: {
        values: ['AVAILABLE', 'SOLD_OUT', 'UNAVAILABLE'],
        message: '{VALUE} must be AVAILABLE, SOLD_OUT, or UNAVAILABLE'
      },
      default: 'AVAILABLE'
    },
    available: {
      type: Boolean,
      default: true
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    preparationTime: {
      type: Number,
      default: 10,
      min: [1, 'Preparation time must be at least 1 minute']
    },
    featured: {
      type: Boolean,
      default: false
    },
    mealPeriod: {
      type: String,
      enum: ['BREAKFAST', 'LUNCH', 'EVENING', 'ALL_DAY'],
      default: 'ALL_DAY'
    },
    spiceLevel: {
      type: String,
      enum: ['MILD', 'MEDIUM', 'SPICY', 'NONE'],
      default: 'NONE'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Pre-save hook to ensure 'available' boolean remains in sync with 'availabilityStatus'
menuItemSchema.pre('save', function (next) {
  if (this.isModified('availabilityStatus')) {
    this.available = this.availabilityStatus === 'AVAILABLE';
  } else if (this.isModified('available') && !this.isModified('availabilityStatus')) {
    this.availabilityStatus = this.available ? 'AVAILABLE' : 'SOLD_OUT';
  }
  next();
});

menuItemSchema.index({ category: 1, isArchived: 1, available: 1 });
menuItemSchema.index({ availabilityStatus: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
