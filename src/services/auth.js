import api from '/api'

export const loginUser = async({username,password})=>{
    const response = await api.post("token/",{username,password})
    return response.data
}

export const signupUser = async({username,email,password})=>{
    const response = await api.post("/register",{ username, email, password, password_check: password })
    return response.data
}

export const refreshToken = async(refresh) =>{
    const response = await api.post('token/refresh',{refresh});
    return response.data

}
