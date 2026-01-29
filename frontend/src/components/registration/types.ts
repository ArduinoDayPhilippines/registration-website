export interface RegistrationFormData {
  email: string;
  agreedToPrivacy: boolean;
  firstName: string;
  lastName: string;
  age: string;
  mobileNumber: string;
  occupation: string;
  institution: string;
  isPartnered: 'Yes' | 'No' | '';
  isOpenToScholarship: 'Yes' | 'No' | '';
  resumeUrl: string;
  expectations: string;
  suggestions: string;
}

export const INITIAL_DATA: RegistrationFormData = {
  email: '',
  agreedToPrivacy: false,
  firstName: '',
  lastName: '',
  age: '',
  mobileNumber: '',
  occupation: '',
  institution: '',
  isPartnered: '',
  isOpenToScholarship: '',
  resumeUrl: '',
  expectations: '',
  suggestions: ''
};
