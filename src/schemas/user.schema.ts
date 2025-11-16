import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleTypesE } from 'src/types';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false, trim: true })
  password?: string;

  @Prop({
    type: String,
    enum: RoleTypesE,
    default: RoleTypesE.USER,
  })
  role: RoleTypesE;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
