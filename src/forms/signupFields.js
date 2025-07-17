const signupFields = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Username",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
    required: true,
    toggleVisibility: true,
  },
  {
    name: "password_check",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm Password",
    required: true,
    toggleVisibility: true,
  },
];

export default signupFields;
