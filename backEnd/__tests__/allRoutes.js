const request = require('supertest');
const app = require('../app.js');
//testing the users
describe('Post new user', () => {
    it('Should create a new user', async() => {
        const res = await request(app.callback())
        .post('/api/v1/users')
        .send({
            role: 'user',
            username: 'unique_1',
            password: 'password',
            email: 'unique_email1@example.com'
        })
        expect(res.statusCode).toEqual(201)
    })
})
describe('Get all users with admin account', () => {
    it('Should get all users', async() => {
        const res = await request(app.callback())
        .get('/api/v1/users')
        .auth('admin','admin')
        expect(res.statusCode).toEqual(200)
    })
})
describe('Get all users without the admin account', () => {
    it('Should not be able to get all users', async() => {
        const res = await request(app.callback())
        .get('/api/v1/users')
        .auth('colin','1234')
        expect(res.statusCode).toEqual(403)
    })
})
describe('Admin can get an account by ID', () => {
    it('Should be able to get an users account by its ID', async() => {
        const res = await request(app.callback())
        .get('/api/v1/users/6')
        .auth('admin','admin')
        expect(res.statusCode).toEqual(200)
    })
})
describe('Update an users account', () => {
    it('Should be able to update an users account', async() => {
        const res = await request(app.callback())
        .put('/api/v1/users/6')
        .auth('admin', 'admin')
        .send({
            username : "Updated_account",
            password : "1234",
            email : "updated@updated.com"
        })
        expect(res.statusCode).toEqual(200)
    })
})
describe('Delete a user account', () => {
    it('Admin should be able to delete an account', async() => {
        const res = await request(app.callback())
        .delete('/api/v1/users/6')
        .auth('admin','admin')
        expect(res.statusCode).toEqual(200)
    })
})
// testing the games
describe('Get all games', () => {
    it('Should be able to get all games', async() => {
        const res = await request(app.callback())
        .get('/api/v1/games')
        expect(res.statusCode).toEqual(200)
    })
})
describe('Get a game by its ID', () => {
    it('Should be able to get a game by its ID', async() => {
        const res = await request(app.callback())
        .get('/api/v1/games/1')
        .auth("colin", "1234")
        expect(res.statusCode).toEqual(200)
    })
})
describe('Post a new game', () => {
    it('Should be able to post a new game', async() => {
        const res = await request(app.callback())
        .post('/api/v1/games')
        .auth('admin', 'admin')
        .send({
            name: "HearthStone",
            genre: "Card game",
            releaseYear: 2010
        })
        expect(res.statusCode).toEqual(201)
    })
})
describe('Update an existing game record', () => {
    it('Admin should to update a game entry', async() => {
        const res = await request(app.callback())
        .put('/api/v1/games/1')
        .auth('admin', 'admin')
        .send({
            name: "UpdatedGameTitle",
            genre: "UpdatedGenreCat",
            releaseYear: 1738
        })
        expect(res.statusCode).toEqual(200)
    })
})
describe('Delete a game entry', () => {
    it('Admin should be able to delete a existing game record', async() => {
        const res = await request(app.callback())
        .delete('/api/v1/games/1')
        .auth('admin','admin')
        expect(res.statusCode).toEqual(204)
    })
})
// testing all the reviews
describe('Get all reviews', () => {
    it('Should be able to get all reviews', async() => {
        const res = await request(app.callback())
        .get('/api/v1/games/1/reviews') 
        .auth('colin', '1234')
        expect(res.statusCode).toEqual(200)
    })
})
describe('Update an existing review by its owner', () =>{
    it('Only the admin can update an existing review if the owner', async() =>{
        const res = await request(app.callback())
        .put('/api/v1/games/1/reviews/2')
        .auth('colin', '1234')
        .send({
            alltext: 'changing the review alltext'
        })
        expect(res.statusCode).toEqual(400)
        })
})
// teting ratings
describe('Get all rates', () => {
    it('Should be able to get all rates', async() => {
        const res = await request(app.callback())
        .get('/api/v1/games/1/rates') 
        .auth('colin', '1234')
        expect(res.statusCode).toEqual(200)
    })
})




