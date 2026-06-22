export const days = [
  {
    id: 1,
    name: 'Monday',
  },
  {
    id: 2,
    name: 'Tuesday',
  },
  {
    id: 3,
    name: 'Wednesday',
  },
  {
    id: 4,
    name: 'Thursday',
  },
  {
    id: 5,
    name: 'Friday',
  },
  {
    id: 6,
    name: 'Saturday',
  },
  {
    id: 7,
    name: 'Sunday',
  },
];

export const roles = [
  {
    id: 1,
    name: 'Administrator',
  },
  {
    id: 2,
    name: 'Campaign Management',
  },
  {
    id: 3,
    name: 'Design',
  },
  {
    id: 4,
    name: 'Creative Developer',
  },
  {
    id: 5,
    name: 'Quality Assurance',
  },
  {
    id: 6,
    name: 'Reporting',
  },
  {
    id: 7,
    name: 'Video Developer',
  },
  {
    id: 8,
    name: 'Client Services',
  },
  {
    id: 9,
    name: 'Member',
  },
  {
    id: 11,
    name: 'Manager',
  },
  {
    id: 12,
    name: 'Head of Production',
  },
  {
    id: 13,
    name: 'Creative Director',
  },
  {
    id: 14,
    name: 'Head of Creative',
  },
];

export const passwordRules = [
  {
    id: 1,
    label: 'Must be minimum of 8 to 16 characters',
    characters: null,
    regex: /^.{8,16}$/,
  },
  {
    id: 2,
    label: 'Must contain at least 1 lowercase',
    characters: null,
    regex: /^(?=.*[a-z])/,
  },
  {
    id: 3,
    label: 'Must contain at least 1 uppercase',
    characters: null,
    regex: /^(?=.*[A-Z])/,
  },
  {
    id: 4,
    label: 'Must contain at least 1 digit',
    characters: null,
    regex: /^(?=.*?[0-9])/,
  },
  {
    id: 5,
    label: 'Must contain at least 1 special characters:',
    characters: '! @ # $ % ^ & * ( ) _ + - = { } [ ] < > , . ? /',
    regex: /^(?=.*?[#?!@$%^&*_+=().,<>{}[\]/-])(?!.*['";:])/,
  },
];
