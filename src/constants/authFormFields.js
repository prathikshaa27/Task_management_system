const loginFields = [
  {
    id: "username",
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Username",
    autoComplete: "username",
    isPassword: false,
  },
  {
    id: "password",
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Password",
    autoComplete: "current-password",
    isPassword: true,
  },
];

const signupFields = [
  {
    id: "username",
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Username",
    autoComplete: "username",
    isPassword: false,
  },
  {
    id: "email",
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Email",
    autoComplete: "email",
    isPassword: false,
  },
  {
    id: "password",
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Password",
    autoComplete: "new-password",
    isPassword: true,
  },
  {
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    autoComplete: "new-password",
    isPassword: true,
  },
];

export { loginFields, signupFields };
