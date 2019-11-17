import { Document } from 'mongoose';

export default interface ICategory extends Document {
    name: string;
    subcategory_of: [ICategory];
    link: string;
    img: string;
}
