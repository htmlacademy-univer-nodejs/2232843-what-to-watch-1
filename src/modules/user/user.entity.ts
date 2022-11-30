import typegoose, {defaultClasses, getModelForClass,} from '@typegoose/typegoose';
import { User } from '../../types/user.type.js';
import { createSHA256 } from '../../utils/common.js';

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

  @prop()
  public avatar: string;

  @prop({ required: true, default: '' })
  public username!: string;

  @prop({ required: true, default: '' })
  private password!: string;

  setPassword(password: string, salt: string) {
    if (password.length < 6 || password.length > 12) {
      throw Error('Password length must be between 6 and 12 characters');
    }

    this.password = createSHA256(password, salt);
  }

  getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
