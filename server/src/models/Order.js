import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user']
    },
    items: {
      type: [orderItemSchema],
      validate: [
        (val) => val && val.length > 0,
        'Order must contain at least one item'
      ]
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
        message: '{VALUE} is not a valid order status'
      },
      default: 'PENDING'
    },
    pickupType: {
      type: String,
      default: 'immediate'
    },
    pickupTime: {
      type: String,
      required: [true, 'Pickup time is required']
    },
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      default: 'PAID'
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'CARD', 'CASH_AT_COUNTER'],
      default: 'UPI'
    },
    specialInstructions: {
      type: String,
      default: '',
      trim: true
    },
    preparingAt: {
      type: Date
    },
    readyAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    cancelledAt: {
      type: Date
    },
    cancelReason: {
      type: String,
      default: '',
      trim: true
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

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export const Order = mongoose.model('Order', orderSchema);
