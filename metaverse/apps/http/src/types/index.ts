import z from "zod";

export const SignupSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8),
    types: z.enum(["user", "admin"]),

})

export const SigninSchema = z.object({
    username: z.string().email(),
    password: z.string().min(8),
})

export const updateMetaverseSchema = z.object({
    avatarId: z.string().uuid()
})
export const CreateMetaverseSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^\d+x\d+x$/), // e.g., "100x100"
    mapId: z.string(),

})

export const AddElementSchema = z.object({
    spaceId : z.string(),
    elementId : z.string(),

    x: z.number(),
    y: z.number(),
})

export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(),

})

export const UpdatedElementSchema = z.object({
    imageUrl : z.string(),
})

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
})
export const CreateMapSchema = z.object({
    thumbnail:z.string(),
    dimensions: z.string().regex(/^\d+x\d+x$/), // e.g., "100x100"
    defaultElementId: z.string(),
    x: z.number(),
    y: z.number(),
    

})