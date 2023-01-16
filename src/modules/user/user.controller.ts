import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import { UploadFileMiddleware } from '../../middlewares/upload-files.middleware.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validate-objectid.middleware.js';
import { HttpError } from '../../errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.types.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDTO } from '../../utils/dto.js';
import { createJWT } from '../../utils/common.js';
import LoggedUserResponse from './response/logged-user.response.js';
import { JWT_ALGORITM } from './user.constant.js';
import { FilmResponse } from '../film/response/film.response.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import UserResponse from './response/user.response.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserRoute } from './user.model.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface
  ) {
    super(logger, configService);
    this.logger.info('Register UserController ');
    this.addRoute<UserRoute>({
      path: UserRoute.REGISTER,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new UploadFileMiddleware('avatar', this.configService.get('UPLOAD_DIRECTORY')),
        new ValidateDtoMiddleware(CreateUserDto),
      ]
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto)
      ],
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGIN,
      method: HttpMethod.Get,
      handler: this.get,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.LOGOUT,
      method: HttpMethod.Delete,
      handler: this.logout,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Get,
      handler: this.getToWatch,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Post,
      handler: this.postToWatch,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.TO_WATCH,
      method: HttpMethod.Delete,
      handler: this.deleteToWatch,
    });
    this.addRoute<UserRoute>({
      path: UserRoute.AVATAR,
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  async create(req: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const {body} = req;
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» already exists`,
        'UserController'
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT')
    );
    const createdUser: UserResponse = result;
    if (req.file) {
      const avatar = req.file.filename;
      await this.userService.setUserAvatarPath(result.id, avatar);
      createdUser.avatar = avatar;
    }
    this.created(res, fillDTO(UserResponse, createdUser));
  }

  public async login({
    body,
  }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
  res: Response):
    Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const token = await createJWT(
      JWT_ALGORITM,
      this.configService.get('JWT_SECRET'),
      {id: user.id, email: user.email}
    );
    this.ok(res, {
      ...fillDTO(LoggedUserResponse, user),
      token
    });
  }


  async get(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    const user = await this.userService.findByEmail(req.user.email);
    this.ok(res, fillDTO(LoggedUserResponse, user));
  }

  async logout(): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  async getToWatch(req:
      Request,
  _res: Response):
    Promise<void> {
    const {user} = req;
    const result = await this.userService.findInList(user.id);
    this.ok(_res, fillDTO(FilmResponse, result));
  }

  async postToWatch(req:
      Request<object, object, { filmId: string }>,
  res: Response):
    Promise<void> {
    const {body, user} = req;
    await this.userService.addInList(body.filmId, user.id);
    this.noContent(res, {message: 'Movie was successfully added to In List'});
  }

  async deleteToWatch(req:
      Request<object, object, { filmId: string }>,
  res: Response):
    Promise<void> {
    const {body, user} = req;
    await this.userService.deleteInList(body.filmId, user.id);
    this.noContent(res, {message: 'Movie was successfully removed from In List'});
  }

  async uploadAvatar(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} doesn't exist`,
        'UploadFileMiddleware'
      );
    }

    if (req.file) {
      const createdFileName = req.file.filename;
      await this.userService.setUserAvatarPath(req.params.userId, createdFileName);
      this.created(res, {
        avatarPath: createdFileName
      });
    }
  }
}

