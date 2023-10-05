const Token = require("../models/token.model.js");

const createTokenRepo = async ({ user, token }) => {
  const createdToken = await Token.create({
    user,
    token,
  });
  return createdToken;
};

const searchTokenByQueryRepo = async ({ query }) => {
  const token = await Token.findOne(query);
  return token;
};

const deleteTokenByIdRepo = async ({ id }) => {
  const deletedToken = await Token.deleteOne({ id });
  return deletedToken;
};

module.exports = {
  createTokenRepo,
  searchTokenByQueryRepo,
  deleteTokenByIdRepo,
};
