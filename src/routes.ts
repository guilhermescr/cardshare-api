/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from './controllers/users.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UploadController } from './controllers/upload.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CommentsController } from './controllers/comments.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CardsController } from './controllers/cards.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './controllers/auth.controller';
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from 'express';
import { expressAuthenticationRecasted } from './middlewares/auth.middleware';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  CardVisibilityEnum: {
    dataType: 'refEnum',
    enums: ['private', 'public', 'unlisted'],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AuthorDto: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      username: { dataType: 'string' },
      profilePicture: { dataType: 'string' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CardDto: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      title: { dataType: 'string', required: true },
      description: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'string' },
          { dataType: 'enum', enums: [null] },
        ],
      },
      imageUrl: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'string' },
          { dataType: 'enum', enums: [null] },
        ],
      },
      visibility: { ref: 'CardVisibilityEnum', required: true },
      author: { ref: 'AuthorDto', required: true },
      isLiked: { dataType: 'boolean' },
      isFavorited: { dataType: 'boolean' },
      likes: {
        dataType: 'array',
        array: { dataType: 'string' },
        required: true,
      },
      favorites: {
        dataType: 'array',
        array: { dataType: 'string' },
        required: true,
      },
      comments: {
        dataType: 'array',
        array: { dataType: 'string' },
        required: true,
      },
      createdAt: { dataType: 'datetime', required: true },
      updatedAt: { dataType: 'datetime', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UserRefDto: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      username: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UserDto: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      fullName: { dataType: 'string', required: true },
      username: { dataType: 'string', required: true },
      email: { dataType: 'string' },
      profilePicture: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'string' },
          { dataType: 'enum', enums: [null] },
        ],
        required: true,
      },
      bio: { dataType: 'string', required: true },
      cards: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'CardDto' },
        required: true,
      },
      favorites: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'CardDto' },
        required: true,
      },
      likes: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'CardDto' },
        required: true,
      },
      isFollowing: { dataType: 'boolean', required: true },
      following: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'UserRefDto' },
        required: true,
      },
      followers: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'UserRefDto' },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PaginatedResponseDto_CardDto_: {
    dataType: 'refObject',
    properties: {
      items: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'CardDto' },
        required: true,
      },
      nextCursor: { dataType: 'string' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CommentDto: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      cardId: { dataType: 'string', required: true },
      author: { ref: 'AuthorDto', required: true },
      content: { dataType: 'string', required: true },
      likes: {
        dataType: 'array',
        array: { dataType: 'string' },
        required: true,
      },
      createdAt: { dataType: 'datetime', required: true },
      updatedAt: { dataType: 'datetime', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreateCommentDto: {
    dataType: 'refObject',
    properties: {
      cardId: { dataType: 'string', required: true },
      content: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PopulatedCardDto: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      title: { dataType: 'string', required: true },
      description: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'string' },
          { dataType: 'enum', enums: [null] },
        ],
      },
      imageUrl: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'string' },
          { dataType: 'enum', enums: [null] },
        ],
      },
      visibility: { ref: 'CardVisibilityEnum', required: true },
      author: { ref: 'AuthorDto', required: true },
      isLiked: { dataType: 'boolean' },
      isFavorited: { dataType: 'boolean' },
      likes: {
        dataType: 'array',
        array: { dataType: 'string' },
        required: true,
      },
      favorites: {
        dataType: 'array',
        array: { dataType: 'string' },
        required: true,
      },
      comments: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'CommentDto' },
        required: true,
      },
      createdAt: { dataType: 'datetime', required: true },
      updatedAt: { dataType: 'datetime', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreateCardDto: {
    dataType: 'refObject',
    properties: {
      title: { dataType: 'string', required: true },
      description: { dataType: 'string' },
      imageUrl: { dataType: 'string' },
      visibility: { ref: 'CardVisibilityEnum' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UpdateCardDto: {
    dataType: 'refObject',
    properties: {
      title: { dataType: 'string' },
      description: { dataType: 'string' },
      imageUrl: { dataType: 'string' },
      visibility: { ref: 'CardVisibilityEnum' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  RegisterDto: {
    dataType: 'refObject',
    properties: {
      fullName: { dataType: 'string', required: true },
      username: { dataType: 'string', required: true },
      email: { dataType: 'string', required: true },
      password: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  LoginDto: {
    dataType: 'refObject',
    properties: {
      identifier: { dataType: 'string', required: true },
      password: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: 'throw-on-extras',
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsUsersController_getUserById: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
  };
  app.get(
    '/users/:id',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(UsersController.prototype.getUserById),

    async function UsersController_getUserById(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_getUserById,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: 'getUserById',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_getUserByUsername: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    username: {
      in: 'path',
      name: 'username',
      required: true,
      dataType: 'string',
    },
  };
  app.get(
    '/users/username/:username',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(
      UsersController.prototype.getUserByUsername
    ),

    async function UsersController_getUserByUsername(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_getUserByUsername,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: 'getUserByUsername',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_toggleFollowUser: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
  };
  app.post(
    '/users/:id/follow',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(
      UsersController.prototype.toggleFollowUser
    ),

    async function UsersController_toggleFollowUser(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_toggleFollowUser,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: 'toggleFollowUser',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_getMyCards: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    limit: { in: 'query', name: 'limit', dataType: 'double' },
    cursor: { in: 'query', name: 'cursor', dataType: 'string' },
    sortBy: {
      in: 'query',
      name: 'sortBy',
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['latest'] },
        { dataType: 'enum', enums: ['most-liked'] },
      ],
    },
  };
  app.get(
    '/users/me/cards',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(UsersController.prototype.getMyCards),

    async function UsersController_getMyCards(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_getMyCards,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: 'getMyCards',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_getMyLikedCards: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    limit: { in: 'query', name: 'limit', dataType: 'double' },
    cursor: { in: 'query', name: 'cursor', dataType: 'string' },
    sortBy: {
      in: 'query',
      name: 'sortBy',
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['latest'] },
        { dataType: 'enum', enums: ['most-liked'] },
      ],
    },
  };
  app.get(
    '/users/me/liked',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(
      UsersController.prototype.getMyLikedCards
    ),

    async function UsersController_getMyLikedCards(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_getMyLikedCards,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: 'getMyLikedCards',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUploadController_uploadProfilePicture: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
  };
  app.post(
    '/upload/profile-picture',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(UploadController),
    ...fetchMiddlewares<RequestHandler>(
      UploadController.prototype.uploadProfilePicture
    ),

    async function UploadController_uploadProfilePicture(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUploadController_uploadProfilePicture,
          request,
          response,
        });

        const controller = new UploadController();

        await templateService.apiHandler({
          methodName: 'uploadProfilePicture',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCommentsController_createComment: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    body: { in: 'body', name: 'body', required: true, ref: 'CreateCommentDto' },
  };
  app.post(
    '/comments',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CommentsController),
    ...fetchMiddlewares<RequestHandler>(
      CommentsController.prototype.createComment
    ),

    async function CommentsController_createComment(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCommentsController_createComment,
          request,
          response,
        });

        const controller = new CommentsController();

        await templateService.apiHandler({
          methodName: 'createComment',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCommentsController_toggleLikeComment: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
  };
  app.post(
    '/comments/:id/like',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CommentsController),
    ...fetchMiddlewares<RequestHandler>(
      CommentsController.prototype.toggleLikeComment
    ),

    async function CommentsController_toggleLikeComment(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCommentsController_toggleLikeComment,
          request,
          response,
        });

        const controller = new CommentsController();

        await templateService.apiHandler({
          methodName: 'toggleLikeComment',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCommentsController_deleteComment: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
  };
  app.delete(
    '/comments/:id',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CommentsController),
    ...fetchMiddlewares<RequestHandler>(
      CommentsController.prototype.deleteComment
    ),

    async function CommentsController_deleteComment(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCommentsController_deleteComment,
          request,
          response,
        });

        const controller = new CommentsController();

        await templateService.apiHandler({
          methodName: 'deleteComment',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 204,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCardsController_getCards: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    limit: { in: 'query', name: 'limit', dataType: 'double' },
    cursor: { in: 'query', name: 'cursor', dataType: 'string' },
    search: { in: 'query', name: 'search', dataType: 'string' },
    sortBy: {
      in: 'query',
      name: 'sortBy',
      dataType: 'union',
      subSchemas: [
        { dataType: 'enum', enums: ['latest'] },
        { dataType: 'enum', enums: ['most-liked'] },
      ],
    },
  };
  app.get(
    '/cards',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CardsController),
    ...fetchMiddlewares<RequestHandler>(CardsController.prototype.getCards),

    async function CardsController_getCards(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCardsController_getCards,
          request,
          response,
        });

        const controller = new CardsController();

        await templateService.apiHandler({
          methodName: 'getCards',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCardsController_getCardById: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
  };
  app.get(
    '/cards/:id',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CardsController),
    ...fetchMiddlewares<RequestHandler>(CardsController.prototype.getCardById),

    async function CardsController_getCardById(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCardsController_getCardById,
          request,
          response,
        });

        const controller = new CardsController();

        await templateService.apiHandler({
          methodName: 'getCardById',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCardsController_createCard: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    body: { in: 'body', name: 'body', required: true, ref: 'CreateCardDto' },
  };
  app.post(
    '/cards',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CardsController),
    ...fetchMiddlewares<RequestHandler>(CardsController.prototype.createCard),

    async function CardsController_createCard(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCardsController_createCard,
          request,
          response,
        });

        const controller = new CardsController();

        await templateService.apiHandler({
          methodName: 'createCard',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCardsController_updateCard: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
    body: { in: 'body', name: 'body', required: true, ref: 'UpdateCardDto' },
  };
  app.put(
    '/cards/:id',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CardsController),
    ...fetchMiddlewares<RequestHandler>(CardsController.prototype.updateCard),

    async function CardsController_updateCard(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCardsController_updateCard,
          request,
          response,
        });

        const controller = new CardsController();

        await templateService.apiHandler({
          methodName: 'updateCard',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCardsController_deleteCard: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
  };
  app.delete(
    '/cards/:id',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CardsController),
    ...fetchMiddlewares<RequestHandler>(CardsController.prototype.deleteCard),

    async function CardsController_deleteCard(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCardsController_deleteCard,
          request,
          response,
        });

        const controller = new CardsController();

        await templateService.apiHandler({
          methodName: 'deleteCard',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 204,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCardsController_toggleLikeCard: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
  };
  app.post(
    '/cards/:id/like',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CardsController),
    ...fetchMiddlewares<RequestHandler>(
      CardsController.prototype.toggleLikeCard
    ),

    async function CardsController_toggleLikeCard(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCardsController_toggleLikeCard,
          request,
          response,
        });

        const controller = new CardsController();

        await templateService.apiHandler({
          methodName: 'toggleLikeCard',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCardsController_toggleFavoriteCard: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: 'request', name: 'req', required: true, dataType: 'object' },
    id: { in: 'path', name: 'id', required: true, dataType: 'string' },
  };
  app.post(
    '/cards/:id/favorite',
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CardsController),
    ...fetchMiddlewares<RequestHandler>(
      CardsController.prototype.toggleFavoriteCard
    ),

    async function CardsController_toggleFavoriteCard(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCardsController_toggleFavoriteCard,
          request,
          response,
        });

        const controller = new CardsController();

        await templateService.apiHandler({
          methodName: 'toggleFavoriteCard',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> =
    {
      body: { in: 'body', name: 'body', required: true, ref: 'RegisterDto' },
    };
  app.post(
    '/auth/register',
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.register),

    async function AuthController_register(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_register,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: 'register',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_confirmEmail: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    token: { in: 'query', name: 'token', required: true, dataType: 'string' },
  };
  app.get(
    '/auth/confirm-email',
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.confirmEmail),

    async function AuthController_confirmEmail(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_confirmEmail,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: 'confirmEmail',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
    body: { in: 'body', name: 'body', required: true, ref: 'LoginDto' },
  };
  app.post(
    '/auth/login',
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.login),

    async function AuthController_login(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_login,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: 'login',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return async function runAuthenticationMiddleware(
      request: any,
      response: any,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      // keep track of failed auth attempts so we can hand back the most
      // recent one.  This behavior was previously existing so preserving it
      // here
      const failedAttempts: any[] = [];
      const pushAndRethrow = (error: any) => {
        failedAttempts.push(error);
        throw error;
      };

      const secMethodOrPromises: Promise<any>[] = [];
      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          const secMethodAndPromises: Promise<any>[] = [];

          for (const name in secMethod) {
            secMethodAndPromises.push(
              expressAuthenticationRecasted(
                request,
                name,
                secMethod[name]
              ).catch(pushAndRethrow)
            );
          }

          // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

          secMethodOrPromises.push(
            Promise.all(secMethodAndPromises).then((users) => {
              return users[0];
            })
          );
        } else {
          for (const name in secMethod) {
            secMethodOrPromises.push(
              expressAuthenticationRecasted(
                request,
                name,
                secMethod[name]
              ).catch(pushAndRethrow)
            );
          }
        }
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      try {
        request['user'] = await Promise.any(secMethodOrPromises);

        // Response was sent in middleware, abort
        if (response.writableEnded) {
          return;
        }

        next();
      } catch (err) {
        // Show most recent error as response
        const error = failedAttempts.pop();
        error.status = error.status || 401;

        // Response was sent in middleware, abort
        if (response.writableEnded) {
          return;
        }
        next(error);
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
