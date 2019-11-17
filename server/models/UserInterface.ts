import { Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password_hash: string;
}
