import mongoose, { PassportLocalSchema, Schema } from 'mongoose';

import bcrypt from 'bcrypt';

import { IUser } from './UserInterface';

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

// tslint:disable: object-literal-sort-keys
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    authorizations: [{
        action: {
            type: String,
            required: true,
        },
        context: {
            type: String,
            required: true,
        },
    }],
});

/**
 * Password hash middleware.
 * Taken from: https://github.com/microsoft/TypeScript-Node-Starter/blob/master/src/models/User.ts
 *  MIT License
 *
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE
 */
userSchema.pre('save', function save(next) {
    const user = this as IUser;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (errr: mongoose.Error, hash) => {
            if (errr) { return next(errr); }
            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFunction = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

userSchema.methods.comparePassword = comparePassword;

export const UserModel = mongoose.model<IUser>('User', userSchema);
