const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('read').on('rating', ['rating','gamesID','userID']);
ac.grant('user').execute('read').on('ratings');
ac.grant('admin').execute('read').on('ratings');
ac.grant('admin').execute('add').on('ratings');
ac.grant('admin').execute('delete').on('rating');
ac.grant('user').condition({Fn: 'EQUALS', args: {'requester': '$.owner'}}).execute('delete').on('rating');

exports.readAll = (requester) => ac.can(requester.role).execute('read').sync().on('rating');
exports.add = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('add').sync().on('ratings');
exports.read = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('read').sync().on('rating');
exports.delete = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('delete').sync().on('rating');