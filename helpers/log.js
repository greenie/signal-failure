export default function log(message) {
  if (typeof message === 'object' && message !== null) {
    console.log(JSON.stringify(message, null, 2));
  } else {
    console.log(message);
  }
}
