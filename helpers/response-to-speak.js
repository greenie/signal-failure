export default function responseToSpeak(response) {
  return response.replace(/DLR/, '<say-as interpret-as="spell-out">DLR</say-as>');
}
