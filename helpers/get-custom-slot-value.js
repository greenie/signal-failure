export default function getCustomSlotValue(slot) {
  const { resolutions, value } = slot;

  if (resolutions) {
    const { resolutionsPerAuthority } = resolutions;
    const matching = resolutionsPerAuthority.find(r => r.status.code === 'ER_SUCCESS_MATCH');

    if (matching) {
      return matching.values.shift().map(({ value: { name, id } }) => ({ name, id }));
    }

    return null;
  }

  return { name: null, id: value };
}
