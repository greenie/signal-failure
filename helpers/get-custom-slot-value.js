export default function getCustomSlotValue(slot) {
  const { resolutions, value } = slot;
  const nonMatchingValue = { name: null, id: value };

  if (resolutions) {
    const { resolutionsPerAuthority } = resolutions;
    const matching = resolutionsPerAuthority.find(r => r.status.code === 'ER_SUCCESS_MATCH');

    return matching ? matching.values[0].value : null;
  }

  return nonMatchingValue;
}
