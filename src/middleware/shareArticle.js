export default async (req, res, next) => {
  const { slug, provider } = req.params;
  req.share = { slug, provider };
  next();
};
