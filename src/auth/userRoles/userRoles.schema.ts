import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../enums/userRole.enum';
import { Document } from 'mongoose';

@Schema()
export class UserRoles extends Document {
  @Prop({ required: true, enum: UserRole })
  userRole: UserRole;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRoles);
