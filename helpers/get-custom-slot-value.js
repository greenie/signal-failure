const getCustomSlotValue = slot => {
  const nonMatchingValue = { name: null, id: null }

  try {
    const { resolutions: { resolutionsPerAuthority } } = slot
    const matching = resolutionsPerAuthority.find(r => r.status.code === 'ER_SUCCESS_MATCH')
    return matching.values[0].value
  } catch (error) {
    return nonMatchingValue
  }
}

export default getCustomSlotValue
