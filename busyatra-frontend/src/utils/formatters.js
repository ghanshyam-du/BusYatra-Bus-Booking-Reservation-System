export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatTime = (timeString) => {
  // Convert "08:00" to "8:00 AM"
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const formatDuration = (departureTime, arrivalTime) => {
  // Calculate duration between two times
  const [depHours, depMinutes] = departureTime.split(':').map(Number);
  const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
  
  let hours = arrHours - depHours;
  let minutes = arrMinutes - depMinutes;
  
  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }
  
  if (hours < 0) {
    hours += 24;
  }
  
  return `${hours}h ${minutes}m`;
};

export const getStatusColor = (status) => {
  const colors = {
    CONFIRMED: 'text-green-600 bg-green-100',
    PENDING: 'text-yellow-600 bg-yellow-100',
    CANCELLED: 'text-red-600 bg-red-100',
    ACTIVE: 'text-green-600 bg-green-100',
    COMPLETED: 'text-blue-600 bg-blue-100',
    APPROVED: 'text-green-600 bg-green-100',
    REJECTED: 'text-red-600 bg-red-100',
    OPEN: 'text-blue-600 bg-blue-100',
    IN_PROGRESS: 'text-yellow-600 bg-yellow-100',
    RESOLVED: 'text-green-600 bg-green-100',
    PAID: 'text-green-600 bg-green-100',
    UNPAID: 'text-red-600 bg-red-100',
    REFUNDED: 'text-purple-600 bg-purple-100',
  };
  
  return colors[status] || 'text-gray-600 bg-gray-100';
};

export const formatPhoneNumber = (phone) => {
  // Format 9876543210 to +91 98765 43210
  if (phone.length === 10) {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  }
  return phone;
};



// Utility functions for formatting data