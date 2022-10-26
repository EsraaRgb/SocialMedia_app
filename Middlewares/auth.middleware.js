import jwt from "jsonwebtoken";
import UserModel from "../DB/Models/User.model.js";

export const auth = ()=>{
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (authorization.startsWith(process.env.BEARER_KEY)) {
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.TOKENSIGNATURE);
        if (decoded && decoded.id) {
          const user = await UserModel.findOne({
            _id: decoded.id,
            isBlocked: false,
            isDeleted: false,
            confirmEmail: true,
          });
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(404).json({ message: "In-valid Token ID" });
          }
        } else {
          res.status(403).json({ message: "In-valid Token" });
        }
      } else {
        res.status(403).json({ message: "In-valid Token signature" });
      }
    } catch (error) {
      if (error.message === "jwt expired") {
        res.status(401).json({ message: "token expired request new Token"});
      } else {
        res.status(500).json({ message: "catch error", error });
      }
    }
  };
}
