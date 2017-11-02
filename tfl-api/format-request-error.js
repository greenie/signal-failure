const formatRequestError = error => {
  const { response } = error

  if (response) {
    const { status, data, headers } = response
    return { status, data, headers }
  }

  return error
}

export default formatRequestError
