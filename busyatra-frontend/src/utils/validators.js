export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

export const validateBusNumber = (busNumber) => {
  // Format: GJ01AB1234
  const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
  return regex.test(busNumber);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

export const validatePositiveNumber = (value) => {
  return !isNaN(value) && parseFloat(value) > 0;
};

export const validateFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};