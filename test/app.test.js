const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const appTest = res.body[0];
                expect(appTest).to.include.all.keys(
                    "App",
                    "Category",
                    "Rating",
                    "Reviews",
                    "Size",
                    "Installs",
                    "Type",
                    "Price",
                    "Content Rating",
                    "Genres",
                    "Last Updated",
                    "Current Ver",
                    "Android Ver"
                );
            })
    });

    it('should return 400 if sort query is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'incorrect' })
            .expect(400, 'Sort must be rating or app');
    });

    it('should sort by app name', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'app' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;

                let i = 0;
                // iterate once less than the length of the array
                // because we're comparing 2 items in the array at a time
                while (i < res.body.length - 1) {
                    // compare app at 'i' with next app at 'i + 1'
                    const appFirst = res.body[i];
                    const appNext = res.body[i + 1];
                    // if the next app is less than the app at i...
                    if (appNext.App < appFirst.App) {
                    // the apps were not sorted properly
                    sorted = false;
                    break; // exit the loop
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should filter by genre Card', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'Card' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                const cardTest = res.body[0].Genres;
                expect(cardTest).to.equal('Card');
        });
    });
});