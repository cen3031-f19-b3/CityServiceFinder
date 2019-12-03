import { Document, Types } from 'mongoose';

export interface IAuthorization extends Types.Subdocument {
    action: string;
    context: string;
}

export interface IUser extends Document {
    email: string;
    name: string;
    password: string;
    authorizations: IAuthorization[];
}
