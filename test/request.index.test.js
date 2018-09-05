process.env.NODE_ENV = "test";

const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const server = require("../app/index.js");

describe("routes: index", (() => {
    describe("GET /", () => {
        it("should return json", (done) => {
            chai.request(server).get("/").end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql("application/json");
                res.body.status.should.eql("success");
                res.body.message.should.be.a("Array");
                res.body.message[0].should.be.a("Object");
                res.body.message[0].date.should.be.a("Number").and.satisfy(Number.isInteger);
                res.body.message[0].id.should.be.a("Object");
                res.body.message[0].id.중식.should.be.a("Number").and.satisfy(Number.isInteger);
                done();
            });
        });
    });
    describe("GET /:id", () => {
        it("should return json", (done) => {
            chai.request(server).get("/789307").end((err, res) => {
                should.not.exist(err);
                res.status.should.eql(200);
                res.type.should.eql("application/json");
                res.body.status.should.eql("success");
                res.body.message.should.be.a("Object");
                res.body.message.should.eql({ date: '2018년 07월 10일 화요일',
                                              type: '조식',
                                              menu: '울타리콩밥,북어두부국,쇠고기장조림,해물완자전,오이지무침,배추김치,하우스귤,우유',
                                              calories: '914 kcal' });
                done();
            });
        });
    });
}));
