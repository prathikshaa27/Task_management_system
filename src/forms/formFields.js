
export const signupFields = [
  {
    name: "username",
    type: "text",
    label: "Username",
  placeholder: "Username",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Email",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Password",
    hasToggle: true,
  },
  {
    name: "password_check",
    type: "password",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    hasToggle: true,
  },
];

export const loginFields = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Username",
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Password",
    hasToggle: true,
  },
]
export const changePasswordFields = [
  {
    name: "newPassword",
    label: "New Password",
    type: "password",
    placeholder: "Enter new password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm new password",
  },
];

export const updateProfileFields = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "New Password (optional)",
    type: "password",
    placeholder: "Leave blank to keep current password",
    hasToggle: true,
    required: false,
  },
  {
    name: "old_password",
    label: "Current Password",
    type: "password",
    placeholder: "Enter current password",
    hasToggle: true,
    required: false,
    conditional: (formData) => formData.password !== "",
  },
];
