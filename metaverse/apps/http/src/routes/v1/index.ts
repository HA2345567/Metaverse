import { Router, Response, Request } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from '../../config'
// ...existing code...
import { hashPassword, verifyPassword } from "../../utils/crypto";


export const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
   const parsedData = SignupSchema.safeParse(req.body);
   if (!parsedData.success) {
      return res.status(400).json({ message: "validation failed" });
   }

   const { salt, hash } = hashPassword(parsedData.data.password);
   try {
      const user = await client.user.create({
         data: {
            username: parsedData.data.username,
            password: hash,
            salt: salt, // 👈 store salt separately
            avatarId: parsedData.data.types === "admin" ? "admin" : "user",
            role: parsedData.data.types === "admin" ? "Admin" : "User",
         }
      });
      res.json({ userId: user.id });
   } catch (error) {
      res.status(400).json({ message: "user already exists" });
   }
});

router.post("/signin", async (req: Request, res: Response) => {
   const parseData = SigninSchema.safeParse(req.body);
   if (!parseData.success) {
      return res.status(403).json({ message: "validation failed" });
   }

   try {
      const user = await client.user.findUnique({
         where: { username: parseData.data.username },
      });

      if (!user || !verifyPassword(parseData.data.password, user.salt, user.password)) {
         return res.status(403).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign({
         userId: user.id,
         role: user.role,
      }, JWT_PASSWORD);

      res.json({ token });
   } catch (error) {
      res.status(400).json({ message: "Error during login" });
   }
});

router.get("/elements", (req: Request, res: Response) => {
   res.json({ message: "elements route" });
});

router.get("/avatars", (req: Request, res: Response) => {
   res.json({ message: "avatars route" });
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
