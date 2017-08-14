export default function getValueForSlot(slot) {
  const { resolutions, value } = slot;

  if (resolutions) {
    const { resolutionsPerAuthority } = resolutions;
    const matching = resolutionsPerAuthority.find(r => r.status.code === 'ER_SUCCESS_MATCH');
    return matching ? matching.values[0].value.id : null;
  }

  return value;
}
