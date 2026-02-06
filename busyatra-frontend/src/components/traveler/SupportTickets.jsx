// Create and view support tickets
// ----------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  Paper,
  Collapse,
  IconButton,
  Alert,
  Avatar,
} from '@mui/material';
import {
  Add,
  MessageOutlined,
  ErrorOutline,
  CheckCircle,
  AccessTime,
  Close,
  ConfirmationNumberOutlined,
  PriorityHigh,
} from '@mui/icons-material';
import travelerService from '../../services/travelerService';
import { formatDateTime, getStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    ticket_type: 'TECHNICAL',
    priority: 'MEDIUM'
  });

  const ticketTypes = [
    { value: 'TECHNICAL', label: 'Technical Support' },
    { value: 'BOOKING', label: 'Booking Issue' },
    { value: 'PAYMENT', label: 'Payment Issue' },
    { value: 'SCHEDULE', label: 'Schedule Inquiry' },
    { value: 'OTHER', label: 'Other' }
  ];

  const priorities = [
    { value: 'LOW', label: 'Low', color: '#10b981' },
    { value: 'MEDIUM', label: 'Medium', color: '#f59e0b' },
    { value: 'HIGH', label: 'High', color: '#f97316' },
    { value: 'URGENT', label: 'Urgent', color: '#ef4444' }
  ];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await travelerService.getTickets();
      setTickets(response.data || []);
    } catch (error) {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await travelerService.createTicket(formData);
      toast.success('Support ticket created successfully!');
      setShowCreateForm(false);
      setFormData({
        subject: '',
        description: '',
        ticket_type: 'TECHNICAL',
        priority: 'MEDIUM'
      });
      fetchTickets();
    } catch (error) {
      toast.error(error.message || 'Failed to create ticket');
    }
  };

  const getPriorityIcon = (priority) => {
    const iconProps = { sx: { fontSize: 20 } };
    switch (priority) {
      case 'URGENT':
        return <ErrorOutline {...iconProps} sx={{ color: '#ef4444' }} />;
      case 'HIGH':
        return <PriorityHigh {...iconProps} sx={{ color: '#f97316' }} />;
      case 'MEDIUM':
        return <AccessTime {...iconProps} sx={{ color: '#f59e0b' }} />;
      default:
        return <CheckCircle {...iconProps} sx={{ color: '#10b981' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || '#9ca3af';
  };

  const getTicketStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
      case 'IN_PROGRESS':
        return 'primary';
      case 'RESOLVED':
      case 'CLOSED':
        return 'success';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Support Tickets
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Get help from our support team
          </Typography>
        </Box>
        {!showCreateForm && (
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => setShowCreateForm(true)}
            sx={{ 
              textTransform: 'none',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Create Ticket
          </Button>
        )}
      </Box>

      {/* Create Ticket Form */}
      <Collapse in={showCreateForm}>
        <Card elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Create Support Ticket
              </Typography>
              <IconButton onClick={() => setShowCreateForm(false)} size="small">
                <Close />
              </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Ticket Type */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Ticket Type</InputLabel>
                    <Select
                      value={formData.ticket_type}
                      label="Ticket Type"
                      onChange={(e) => setFormData({ ...formData, ticket_type: e.target.value })}
                    >
                      {ticketTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Priority */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={formData.priority}
                      label="Priority"
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      {priorities.map(priority => (
                        <MenuItem key={priority.value} value={priority.value}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: priority.color
                              }}
                            />
                            <Typography>{priority.label}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Subject */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Subject"
                    placeholder="Brief description of the issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={5}
                    label="Description"
                    placeholder="Please provide detailed information about your issue..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ 
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    Submit Ticket
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Collapse>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box textAlign="center" py={8}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <MessageOutlined sx={{ fontSize: 48 }} />
              </Avatar>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                No support tickets
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Create a ticket if you need help from our team
              </Typography>
              {!showCreateForm && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => setShowCreateForm(true)}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  Create Your First Ticket
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {tickets.map((ticket) => (
            <Card key={ticket.ticket_id} elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                {/* Header Section */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Box flex={1}>
                    <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: `${getPriorityColor(ticket.priority)}20`,
                          color: getPriorityColor(ticket.priority)
                        }}
                      >
                        {getPriorityIcon(ticket.priority)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {ticket.subject}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ConfirmationNumberOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {ticket.ticket_number}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>
                  <Chip
                    label={ticket.ticket_status}
                    color={getTicketStatusColor(ticket.ticket_status)}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Description */}
                <Typography variant="body1" color="text.primary" mb={3} sx={{ lineHeight: 1.7 }}>
                  {ticket.description}
                </Typography>

                {/* Metadata */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3}
                  divider={<Divider orientation="vertical" flexItem />}
                  mb={ticket.resolution_notes ? 3 : 0}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Type
                    </Typography>
                    <Chip 
                      label={ticket.ticket_type}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 0.5, fontWeight: 500 }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Priority
                    </Typography>
                    <Chip
                      label={ticket.priority}
                      size="small"
                      sx={{
                        mt: 0.5,
                        bgcolor: `${getPriorityColor(ticket.priority)}20`,
                        color: getPriorityColor(ticket.priority),
                        fontWeight: 600,
                        borderColor: getPriorityColor(ticket.priority)
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Created
                    </Typography>
                    <Typography variant="body2" fontWeight="500" sx={{ mt: 0.5 }}>
                      {formatDateTime(ticket.created_at)}
                    </Typography>
                  </Box>
                </Stack>

                {/* Resolution Notes */}
                {ticket.resolution_notes && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Alert severity="success" icon={<CheckCircle />}>
                      <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                        Resolution
                      </Typography>
                      <Typography variant="body2">
                        {ticket.resolution_notes}
                      </Typography>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default SupportTickets;