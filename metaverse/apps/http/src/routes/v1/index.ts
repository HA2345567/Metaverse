import {Router, Response, Request} from "express"
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";

export const router = Router();

router.post("/signup" ,(req: Request, res: Response) =>{
   res.json({
      message: "signup route",
   })
})

router.post("/signin" ,(req: Request, res: Response) =>{
   res.json({
      message: "signin route",
   })
})

router.get("/elements",(req: Request, res: Response) =>{
   res.json({
      message: "elements route",
   })
})
router.get("/avatars",(req:Request, res: Response) =>{
   res.json({
      message: "avatars route"
   })
})

router.use("/user", userRouter)
router.use("/space", spaceRouter)
router.use("/admin", adminRouter)

