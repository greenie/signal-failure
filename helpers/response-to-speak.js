export default function responseToSpeak (response) {
  return response
    .replace(/&/g, 'and')
    .replace(/DLR/g, '<say-as interpret-as="spell-out">DLR</say-as>')
}
