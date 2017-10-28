export default function fullLineName ({ name, id }) {
  const noPrefix = ['tfl-rail']
  const noSuffix = ['london-overground', 'dlr'].concat(noPrefix)
  const prefix = !noPrefix.includes(id) ? 'the' : null
  const suffix = !noSuffix.includes(id) ? 'line' : null

  return [prefix, name, suffix].filter(p => p).join(' ')
}
