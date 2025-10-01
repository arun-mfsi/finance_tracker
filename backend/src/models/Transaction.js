import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
      validate: {
        validator: function(v) {
          return Number.isFinite(v) && v > 0;
        },
        message: 'Amount must be a valid positive number',
      },
    },

    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Transaction type must be either income or expense',
      },
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },

    date: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      maxlength: [50, 'Category ID cannot exceed 50 characters'],
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },

  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient querying
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, createdAt: -1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return this.type === 'expense' ? -this.amount : this.amount;
});

// Ensure virtual fields are serialized
transactionSchema.set('toJSON', { virtuals: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
