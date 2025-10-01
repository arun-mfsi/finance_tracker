import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Email,
  Language,
  CalendarToday,
  Verified,
  CameraAlt,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useDeleteProfileImageMutation,
} from '../store/api';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetUserProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [uploadProfileImage, { isLoading: isUploading }] = useUploadProfileImageMutation();
  const [deleteProfileImage, { isLoading: isDeleting }] = useDeleteProfileImageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      currency: 'INR',
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        currency: profileData.currency || 'INR',
      });
    }
  }, [profileData, reset]);

  const handleEditToggle = () => {
    if (isEditing && isDirty) {
      reset();
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data) => {
    try {
      const result = await updateProfile(data).unwrap();

      dispatch(updateUserProfile(result));

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      refetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error?.message || 'Failed to update profile');
    }
  };

  // Handle image file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        toast.error('Image size must be less than 15MB');
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profileImage', selectedFile);

      const result = await uploadProfileImage(formData).unwrap();

      dispatch(updateUserProfile({ profileImage: result.profileImage }));

      toast.success('Profile image uploaded successfully!');
      setSelectedFile(null);
      setImagePreview(null);
      refetchProfile();
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error(error?.message || 'Failed to upload image');
    }
  };

  // Handle image delete
  const handleImageDelete = async () => {
    try {
      await deleteProfileImage().unwrap();

      dispatch(updateUserProfile({ profileImage: null }));

      toast.success('Profile image deleted successfully!');
      setImagePreview(null);
      setSelectedFile(null);
      refetchProfile();
    } catch (error) {
      console.error('Image delete failed:', error);
      toast.error(error?.message || 'Failed to delete image');
    }
  };

  // Cancel image selection
  const handleCancelImageSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' },
  ];

  if (isProfileLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (profileError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load profile data. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 1 }}>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account information and preferences
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={imagePreview || profileData?.profileImage || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: '#1976d2',
                  fontSize: '2.5rem',
                  fontWeight: 600,
                }}
              >
                {!imagePreview && !profileData?.profileImage && (profileData?.firstName?.[0] || 'U').toUpperCase()}
              </Avatar>

              <Box sx={{ position: 'absolute', bottom: -5, right: -5, display: 'flex', gap: 0.5 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="profile-image-upload">
                  <IconButton
                    component="span"
                    size="small"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'primary.dark' },
                      boxShadow: 2,
                    }}
                  >
                    <CameraAlt fontSize="small" />
                  </IconButton>
                </label>

                {(profileData?.profileImage || imagePreview) && (
                  <IconButton
                    size="small"
                    onClick={imagePreview ? handleCancelImageSelection : handleImageDelete}
                    disabled={isDeleting}
                    sx={{
                      backgroundColor: 'error.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'error.dark' },
                      boxShadow: 2,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                {profileData?.firstName} {profileData?.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                {profileData?.email}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<Verified />}
                  label="Verified Account"
                  size="small"
                  color="success"
                  variant="outlined"
                />
                <Chip
                  icon={<Language />}
                  label={currencies.find(c => c.value === profileData?.currency)?.label || 'INR'}
                  size="small"
                  variant="outlined"
                />
              </Box>

              {selectedFile && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleImageUpload}
                    disabled={isUploading}
                    startIcon={isUploading ? <CircularProgress size={16} /> : null}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCancelImageSelection}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
          
          {!isEditing && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEditToggle}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                disabled={!isEditing}
                {...register('firstName', {
                  required: 'First name is required',
                  maxLength: {
                    value: 50,
                    message: 'First name cannot exceed 50 characters',
                  },
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                disabled={!isEditing}
                {...register('lastName', {
                  required: 'Last name is required',
                  maxLength: {
                    value: 50,
                    message: 'Last name cannot exceed 50 characters',
                  },
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                disabled={true}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText="Email address cannot be changed for security reasons"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!isEditing}>
                <InputLabel>Preferred Currency</InputLabel>
                <Select
                  {...register('currency', { required: 'Currency is required' })}
                  value={watch('currency') || 'INR'}
                  label="Preferred Currency"
                  error={!!errors.currency}
                  startAdornment={<Language sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Member Since"
                value={new Date(profileData?.createdAt || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                disabled
                InputProps={{
                  startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
          </Grid>

          {/* Save Button */}
          {isEditing && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleEditToggle}
                disabled={isUpdating}
                sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isUpdating || !isDirty}
                startIcon={isUpdating ? <CircularProgress size={20} /> : <Save />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
