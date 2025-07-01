import api from './api'
import Cookies from 'js-cookie'

export const loginUser = async({username,password})=>{
    const response = await api.post("token/",{username,password})
    return response.data
}

export const signupUser = async({username,email,password})=>{
    const response = await api.post("/register/",{ username, email, password, password_check: password })
    return response.data
}

export const refreshToken = async(refresh) =>{
    const response = await api.post('token/refresh',{refresh});
    return response.data

}
export const changePassword = async ({ new_password, confirm_password }) => {
  const csrfToken = Cookies.get("csrftoken");

  const response = await api.post(
    "change-password/",
    {
      new_password,
      confirm_password,
    },
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
      withCredentials: true,
    }
  );

  return response.data;
};
