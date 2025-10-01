// Predefined categories for transactions
export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', color: '#4CAF50' },
  { id: 'freelance', name: 'Freelance', color: '#8BC34A' },
  { id: 'business', name: 'Business', color: '#CDDC39' },
  { id: 'investments', name: 'Investments', color: '#FFC107' },
  { id: 'rental', name: 'Rental Income', color: '#FF9800' },
  { id: 'gifts', name: 'Gifts', color: '#FF5722' },
  { id: 'other-income', name: 'Other Income', color: '#795548' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#F44336' },
  { id: 'transportation', name: 'Transportation', color: '#E91E63' },
  { id: 'shopping', name: 'Shopping', color: '#9C27B0' },
  { id: 'entertainment', name: 'Entertainment', color: '#673AB7' },
  { id: 'bills', name: 'Bills & Utilities', color: '#3F51B5' },
  { id: 'healthcare', name: 'Healthcare', color: '#2196F3' },
  { id: 'education', name: 'Education', color: '#03A9F4' },
  { id: 'travel', name: 'Travel', color: '#00BCD4' },
  { id: 'home', name: 'Home & Garden', color: '#009688' },
  { id: 'insurance', name: 'Insurance', color: '#4CAF50' },
  { id: 'taxes', name: 'Taxes', color: '#8BC34A' },
  { id: 'other-expense', name: 'Other Expenses', color: '#607D8B' },
];

// Get all categories
export const getAllCategories = () => {
  return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
};

// Get categories by type
export const getCategoriesByType = (type) => {
  if (type === 'income') {
    return INCOME_CATEGORIES;
  } else if (type === 'expense') {
    return EXPENSE_CATEGORIES;
  }
  return [];
};

// Get category by ID
export const getCategoryById = (categoryId) => {
  const allCategories = getAllCategories();
  return allCategories.find(category => category.id === categoryId);
};

// Get category name by ID
export const getCategoryName = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.name : categoryId;
};

// Get category color by ID
export const getCategoryColor = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.color : '#757575';
};
