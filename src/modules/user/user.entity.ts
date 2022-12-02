import typegoose, {defaultClasses, getModelForClass,} from '@typegoose/typegoose';
import { User } from '../../types/user.type.js';
import { createSHA256, checkPassword } from '../../utils/common.js';

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

  @prop({ required: true, default: [], type: () => String })
  public inList!: string[];

  @prop({ required: true, default: '' })
  public username!: string;

  @prop({ required: true, default: '' })
  private password!: string;

  setPassword(password: string, salt: string) {
    checkPassword(password);
    this.password = createSHA256(password, salt);
  }

  getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
