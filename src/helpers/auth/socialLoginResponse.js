

const socialResponse = (res, dataValues, displayName, token) => {
  const {
    id, firstName, lastName, email, provider
  } = dataValues;
  const responseData = {
    id, firstName, lastName, email, provider
  };

  res.json({
    message: `Welcome to AuthorsHaven, ${displayName}`,
    token,
    data: responseData
  });
};

export default socialResponse;
