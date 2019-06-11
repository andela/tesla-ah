const converter = (seconds) => {
  if (seconds > 60) {
    return `${Math.ceil(seconds / 60)} min`;
  }
  return 'Less than a minute';
};
const readTime = (body) => {
  const numWords = w => w.split(' ').length;
  const WPS = 4;
  const words = numWords(body);
  const sec = words / WPS;
  return converter(sec);
};
export default readTime;
