import { Router, Response, Request } from "express"
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "src/config";


export const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
   const parsedData = SignupSchema.safeParse(req.body);
   if (!parsedData.success) {
      return res.status(400).json({
         message: " validation failed"
      })
   }

   const hashPassword = await bcrypt.hash(parsedData.data.password, 10)
   try {
      const user = await client.user.create({
         data: {
            username: parsedData.data.username,
            password: hashPassword,
            avatarId: parsedData.data.types === "admin" ? "admin" : "user",
            role: parsedData.data.types === "admin" ? "Admin" : "User",

         }
      })
      res.json({
         userId: user.id
      })

   } catch (error) {
      res.status(400).json({
         message: "user already exists"
      });



   }
})

router.post("/signin", async (req: Request, res: Response) => {
   const parseData = SigninSchema.safeParse(req.body)
   if (!parseData.success) {
      return res.status(403).json({
         message: "validation failed"
      });

   }
   try {
      const user = await client.user.findUnique({
         where: {
            username: parseData.data.username,

         }
      })
      if (!user) {
         return res.status(403).json({
            message: "User not found"
         })
      }
      const isValid = await bcrypt.compare(parseData.data.password, user.password)
      if (!isValid) {
         return res.status(403).json({
            message: "Invalid password"
         })
      }
      const token = jwt.sign({
         userId: user?.id,
         role: user?.role,
      },
         JWT_PASSWORD);

      res.json({
         token
      })



   } catch (error) {
      res.status(400).json({
         message: "user already exists"
      });

   }
})


router.get("/elements", (req: Request, res: Response) => {
   res.json({
      message: "elements route",
   })
})
router.get("/avatars", (req: Request, res: Response) => {
   res.json({
      message: "avatars route"
   })
})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)

