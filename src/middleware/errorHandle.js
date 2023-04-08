let { isCelebrateError } = require("celebrate");
const hadleErrorMessage = (err, req, res, next) => {
  try {
    if (isCelebrateError(err)) {
      let errorBody = {};
      if (err.details.get("body")) {
        errorBody = err.details.get("body");
      } else if (err.details.get("query")) {
        errorBody = err.details.get("query");
      } else if (err.details.get("headers")) {
        errorBody = err.details.get("headers");
      }
      return res
        .status(400)
        .send({ status: false, message: errorBody.details[0].message });
    }
  } catch (e) {
    return res.status(400).send({ status: false, message: e.message });
  }
};
module.exports = hadleErrorMessage;
