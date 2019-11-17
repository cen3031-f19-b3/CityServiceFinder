import mongoose, { Schema } from 'mongoose';

import { IUser } from './UserInterface';

// tslint:disable: object-literal-sort-keys
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
