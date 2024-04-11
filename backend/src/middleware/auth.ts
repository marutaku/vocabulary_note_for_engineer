import { type MiddlewareHandler } from "hono/";
import { getAuth } from "firebase-admin/auth";
import { type App } from "firebase-admin/app";

export const createAuthMiddleware = (app: App): MiddlewareHandler => {
  const auth = getAuth(app);
  return async (ctx, next) => {
    const tokenWithBearer = ctx.req.header("Authorization");
    if (tokenWithBearer === undefined) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }
    const splittedToken = tokenWithBearer.split(" ");
    if (splittedToken.length !== 2) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }
    try {
      const token = splittedToken[1];
      const decodedToken = await auth.verifyIdToken(token);
      ctx.set("userId", decodedToken.uid);
      await next();
    } catch (error) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }
  };
};

export default createAuthMiddleware;
