export const validateEmail = email =>{
  //RegEx email validation
  const emailRegEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  if(!emailRegEx.test(email)) return false
  return true
}

export const validateUsername = username => {
  if(username.length < 5)return false
  return true
}

export const validatePassword = password =>{
  if(password.length < 4) return "short"
  //RegEx pass validation
  const pass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})");
  if(!pass.test(password)) return false
  return true
}