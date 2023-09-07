const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('read').on('review', ['allText', 'dateCreated', 'gamesID', 'userID']);
ac.grant('user').execute('read').on('reviews');
ac.grant('admin').execute('read').on('reviews');
ac.grant('admin').execute('add').on('reviews');
ac.grant('user').condition({Fn: 'EQUALS', args: {'requester': '$.owner'}}).execute('update').on('review');
ac.grant('admin').execute('delete').on('review');
ac.grant('admin').condition({Fn: 'EQUALS', args: {'requester': '$.owner'}}).execute('update').on('review');
ac.grant('user').condition({Fn: 'EQUALS', args: {'requester': '$.owner'}}).execute('delete').on('review');

exports.readAll = (requester) => ac.can(requester.role).execute('read').sync().on('review');
exports.add = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('add').sync().on('reviews');
exports.read = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('read').sync().on('review');
exports.update = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('update').sync().on('review');
exports.delete = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.userID}).execute('delete').sync().on('review');