import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import {CreateUserDto}  from './dto/create-user.dto.js';
import {UserServiceInterface} from './user-service.interface.js';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import {FilmEntity} from '../film/film.entity.js';
import UpdateUserDto from './dto/update-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.FilmModel) private readonly filmModel: types.ModelType<FilmEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  async findInList(userId: string): Promise<DocumentType<FilmEntity>[]> {
    const filmList = await this.userModel.findById(userId).select('inList');
    if (!filmList) {
      return [];
    }
    return this.filmModel.find({_id: { $in: filmList.inList }}).populate('user');
  }

  async addInList(filmId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, { $addToSet: {inList: filmId}});
  }

  async deleteInList(filmId: string, userId: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, { $pull: {inList: filmId}});
  }

  async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, {new: true}).exec();
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (! user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId);
  }

  async setUserAvatarPath(userId: string, avatar: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {avatar});
  }
}
