import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { UserRole } from 'src/auth/enums/userRole.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, required: true })
  role: UserRole;

  @Prop({ required: false })
  confirmPassword: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId })
  roleId: Types.ObjectId; //i.e Type Mongo-Id

  @Prop({ required: true }) // Default status is "inactive"
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
