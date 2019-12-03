import { expect } from 'chai';

import { UserModel } from '../models/UserSchema';

// tslint:disable: no-unused-expression

describe('Category Schema', () => {
    it('should require all authorization information', (done) => {
        const service = new UserModel({
            authorizations: [{}],
        });
        service.validate((err) => {
            expect(err.errors['authorizations.0.action']).to.exist;
            expect(err.errors['authorizations.0.context']).to.exist;
            done();
        });
    });
});
