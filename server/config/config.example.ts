// This file holds any configuration variables we may need
// 'config.ts' is usually ignored by git to protect sensitive information, such as your database's username and password

export default {
    db: {
        uri: '', // place the URI of your mongo database here.
    },
    mail: {
        domain: '',
        from: '',
        key: '',
        public_key: '',
        to: [''],
        username: '',
    },
};
