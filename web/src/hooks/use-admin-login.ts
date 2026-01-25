import { useState, FormEvent } from 'react';

export function useAdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', form: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // Email validation helper
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors on input
    setErrors(prev => ({ ...prev, [name]: '', form: '' }));
  };

  // Handle input blur for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!value) {
      setErrors(prev => ({ ...prev, [name]: 'This field is required' }));
    } else if (name === 'email' && !isValidEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setErrors({ email: '', password: '', form: '' });
    
    // Validate fields
    let hasError = false;
    const newErrors = { email: '', password: '', form: '' };
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      hasError = true;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate login
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate wrong credentials for demo
      if (formData.email !== 'admin@arduinoday.ph' || formData.password !== 'arduino2026') {
        setErrors(prev => ({ 
          ...prev, 
          password: '',
          form: 'Invalid admin credentials. Please try again.' 
        }));
        
        // Trigger shake animation
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        // Success state
        setIsSuccess(true);
        setTimeout(() => {
          // Redirect or handle success
          console.log('Login successful!');
        }, 1000);
      }
    }, 1500);
  };

  // Check if form is valid for submit button
  const isFormValid = formData.email && formData.password && !errors.email && !errors.password;

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    shake,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
