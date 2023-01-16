import typegoose, {defaultClasses, getModelForClass,} from '@typegoose/typegoose';
import { User } from '../../types/user.type.js';
import { createSHA256, checkPassword } from '../../utils/common.js';
import { DEFAULT_AVATAR } from './user.model.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.username = data.username;
    this.email = data.email;
    this.avatar = data.avatar;
  }

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({default: DEFAULT_AVATAR})
  public avatar?: string;

  @prop({ required: true, default: [], type: () => String })
  public inList!: string[];

  @prop({ required: true })
  public username!: string;

  @prop({ required: true})
  private password!: string;

  setPassword(password: string, salt: string) {
    checkPassword(password);
    this.password = createSHA256(password, salt);
  }

  getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
