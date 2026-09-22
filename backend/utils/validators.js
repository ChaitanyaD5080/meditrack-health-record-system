export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isStrongPassword = (password) => {
  return password && password.length >= 6
}
