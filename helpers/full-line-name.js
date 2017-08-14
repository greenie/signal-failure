const lineIdToName = id => {
  switch (id) {
    case 'tfl-rail':
      return 'TfL Rail';

    case 'waterloo-city':
      return 'Waterloo and City';

    case 'london-overground':
      return 'Overground';

    case 'hammersmith-city':
      return 'Hammersmith and City';

    case 'dlr':
      return 'DLR';

    default:
      return `${id.charAt(0).toUpperCase()}${id.slice(1)}`;
  }
};

export default function fullLineName(id) {
  const noPrefix = ['tfl-rail'];
  const noSuffix = noPrefix.concat(['london-overground', 'dlr']);
  const prefix = !noPrefix.includes(id) ? 'the' : null;
  const suffix = !noSuffix.includes(id) ? 'line' : null;

  return [prefix, lineIdToName(id), suffix].filter(p => p).join(' ');
}
