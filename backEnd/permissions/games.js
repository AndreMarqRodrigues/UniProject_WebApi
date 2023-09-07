const AccessControl = require('role-acl');
const ac = new AccessControl();

ac.grant('user').execute('read').on('game', ['name', 'genre', 'releaseYear', 'description', 'comapny', 'platforms']);
ac.grant('user').execute('read').on('games')
ac.grant('admin').execute('read').on('game');
ac.grant('admin').execute('read').on('games');
ac.grant('admin').execute('add').on('games');
ac.grant('admin').execute('update').on('game');
ac.grant('admin').execute('delete').on('game');

exports.readAll = (requester) => ac.can(requester.role).execute('read').sync().on('game');
exports.add = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('add').sync().on('games');
exports.read = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('read').sync().on('games');
exports.update = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('update').sync().on('game');
exports.delete = (requester, data) => ac.can(requester.role).context({requester:requester.ID, owner:data.ID}).execute('delete').sync().on('game');