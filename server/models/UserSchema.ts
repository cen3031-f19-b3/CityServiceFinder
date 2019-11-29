import mongoose, { PassportLocalSchema, Schema } from 'mongoose';
import * as passportLocalMongoose from 'passport-local-mongoose';

import { IUser } from './UserInterface';

// tslint:disable: object-literal-sort-keys
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.plugin(passportLocalMongoose.default, {
    usernameField: 'email',
});

export const UserModel = mongoose.model<IUser>('User', userSchema as PassportLocalSchema);
