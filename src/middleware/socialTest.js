export default (req, res, next) => {
  req.user = {
    id: req.body.id,
    displayName: 'Mireille Niwemuhuza',
    name: { familyName: 'Niwemuhuza', givenName: 'Mireille' },
    emails:
            [{ value: req.body.email, verified: true }],
    photos:
            [{
              value:
                    'https://lh4.googleusercontent.com/-FZSypt5JyRU/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3repeJYC3C7JQWReWg7zqfLcOxh0Qg/mo/photo.jpg'
            }],
    provider: 'google'
  };
  next();
};
