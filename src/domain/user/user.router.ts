import { router, publicProcedure, protectedProcedure } from "@/server/trpc/router";
import { z } from "zod";

export const userRouter = router({
    list: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findMany();
    }),

    create: protectedProcedure
        .input(
            z.object({
                input: z.object({
                    name: z.string(),
                    email: z.string().email(),
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.create({ data: input.input });
        }),
});