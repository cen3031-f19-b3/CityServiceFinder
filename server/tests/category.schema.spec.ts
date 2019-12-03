import { expect } from 'chai';

import { CategoryModel } from '../models/CategorySchema';

// tslint:disable: no-unused-expression

describe('Category Schema', () => {
    it('should not save with no parameters', (done) => {
        const category = new CategoryModel();
        category.validate((err) => {
            expect(err).to.exist;
            done();
        });
    });

    it('should require name', (done) => {
        const category = new CategoryModel({subcategory_of: []});
        category.validate((err) => {
            expect(err.errors.name).to.exist;
            done();
        });
    });
});
