import { expect } from 'chai';

import { ServiceModel } from '../models/ServiceSchema';

// tslint:disable: no-unused-expression

describe('Category Schema', () => {
    it('should not save with no parameters', (done) => {
        const service = new ServiceModel();
        service.validate((err) => {
            expect(err).to.exist;
            done();
        });
    });

    it('should require name', (done) => {
        const service = new ServiceModel();
        service.validate((err) => {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should require all address information', (done) => {
        const service = new ServiceModel({
            name: 'test',
            // tslint:disable-next-line: object-literal-sort-keys
            addresses: [{}],
        });
        service.validate((err) => {
            expect(err.errors['addresses.0.line_1']).to.exist;
            expect(err.errors['addresses.0.city']).to.exist;
            expect(err.errors['addresses.0.state']).to.exist;
            expect(err.errors['addresses.0.zip']).to.exist;
            done();
        });
    });

    it('should require number for phone numbers', (done) => {
        const service = new ServiceModel({
            name: 'test',
            phone_numbers: [{}],
        });
        service.validate((err) => {
            expect(err.errors['phone_numbers.0.number']).to.exist;
            done();
        });
    });
});
