const getCustomSlotValue = slot => {
  const { resolutions } = slot
  const nonMatchingValue = { name: null, id: null }

  try {
    const { resolutionsPerAuthority } = resolutions
    const matching = resolutionsPerAuthority.find(r => r.status.code === 'ER_SUCCESS_MATCH')
    return matching.values[0].value
  } catch (e) {
    return nonMatchingValue
  }
}

export default getCustomSlotValue
