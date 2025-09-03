function isNullOrEmpty(value) {
  if (!value) return true
  else {
    if (typeof value === 'string' && value.trim() === '') return true
    else return false
  }
}

export { isNullOrEmpty }