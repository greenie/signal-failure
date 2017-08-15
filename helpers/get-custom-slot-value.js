export default function getCustomSlotValue(slot) {
  const { resolutions } = slot;
  const noMatchingValue = { name: null, id: null };

  if (resolutions) {
    const { resolutionsPerAuthority } = resolutions;
    const matching = resolutionsPerAuthority.find(r => r.status.code === 'ER_SUCCESS_MATCH');

    return matching ? matching.values[0].value : noMatchingValue;
  }

  return noMatchingValue;
}
