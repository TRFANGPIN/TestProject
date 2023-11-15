const objectId = require("mongoose").Types.ObjectId;

module.exports.checkobject = (req) => {
  if (req != null && Object.keys(req).length > 0) {
    return true;
  } else {
    return false;
  }
};
