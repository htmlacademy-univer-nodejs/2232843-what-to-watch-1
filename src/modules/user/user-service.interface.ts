import {DocumentType} from '@typegoose/typegoose';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {FilmEntity} from '../film/film.entity.js';
import UpdateUserDto from './dto/update-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>
  findInList(userId: string): Promise<DocumentType<FilmEntity>[]>;
  addInList(filmId: string, userId: string): Promise<void | null>;
  deleteInList(filmId: string, userId: string): Promise<void | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
  setUserAvatarPath(userId: string, avatarPath: string): Promise<void | null>;
}
