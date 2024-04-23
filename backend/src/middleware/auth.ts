import { Context, type MiddlewareHandler } from 'hono/';
import { getAuth } from 'firebase-admin/auth';
import { type App } from 'firebase-admin/app';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as F from 'fp-ts/lib/function';
import * as IO from 'fp-ts/IO';

type DecodeTokenError = Readonly<{
  type: 'DecodeTokenError';
  error: Error;
}>;

type TokenNotFoundError = Readonly<{
  type: 'TokenNotFoundError';
  error: Error;
}>;

const getTokenFromContext = (
  ctx: Context,
): E.Either<TokenNotFoundError, string> => {
  const tokenWithBearer = ctx.req.header('Authorization');
  if (tokenWithBearer === undefined) {
    return E.left({
      type: 'TokenNotFoundError',
      error: new Error('Token not found'),
    });
  }
  return E.right(tokenWithBearer);
};

const extractToken = (
  tokenWithBearer: string,
): E.Either<TokenNotFoundError, string> => {
  const splittedToken = tokenWithBearer.split(' ');
  if (splittedToken.length !== 2) {
    return E.left({
      type: 'TokenNotFoundError',
      error: new Error('Invalid token'),
    });
  }
  return E.right(splittedToken[1]);
};

const verifyToken = async (app: App, token: string): Promise<string> => {
  const auth = getAuth(app);
  const decodedToken = await auth.verifyIdToken(token);
  return decodedToken.uid;
};

const convertToTask =
  (app: App) =>
  (token: string): TE.TaskEither<DecodeTokenError, string> =>
    TE.tryCatch(
      () => verifyToken(app, token),
      (r) => ({
        type: 'DecodeTokenError',
        error: E.toError(r),
      }),
    );

export const createAuthMiddleware = (app: App): MiddlewareHandler => {
  return async (ctx, next) => {
    const result = F.pipe(
      ctx,
      getTokenFromContext,
      E.flatMap(extractToken),
      TE.fromEither,
      TE.flatMap(convertToTask(app)),
    );
    await next();
    // const tokenWithBearer = ctx.req.header('Authorization');
    // if (tokenWithBearer === undefined) {
    //   return ctx.json({ error: 'Unauthorized' }, 401);
    // }
    // const splittedToken = tokenWithBearer.split(' ');
    // if (splittedToken.length !== 2) {
    //   return ctx.json({ error: 'Unauthorized' }, 401);
    // }
    // try {
    //   const token = splittedToken[1];
    //   const decodedToken = await auth.verifyIdToken(token);
    //   ctx.set('userId', decodedToken.uid);
    //   await next();
    // } catch (error) {
    //   return ctx.json({ error: 'Unauthorized' }, 401);
    // }
  };
};

export default createAuthMiddleware;
