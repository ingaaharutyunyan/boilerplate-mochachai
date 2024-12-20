const chai = require("chai");
const assert = chai.assert;

const server = require("../server");

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);
  suite("Integration tests with chai-http", function () {
    // #1
    test("Test GET /hello with no name", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello Guest");
          done();
        });
    });
    // #2
    test("Test GET /hello with your name", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello?name=xy_z")
        .end(function (err, res) {
          assert.equal(res.status, 200, "Response status should be 200");
          assert.equal(
            res.text,
            "hello xy_z",
            'Response should be "hello xy_z"',
          );

          done();
        });
    });

    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({
          surname: "Colombo",
        })

        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.name, "Cristoforo");
          assert.equal(res.body.surname, "Colombo");

          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({
          surname: "da Verrazzano",
        })

        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.name, "Giovanni");
          assert.equal(res.body.surname, "da Verrazzano");

          done();
        });
    });
  });
});

const Browser = require("zombie");

suite("Functional Tests with Zombie.js", function () {
  this.timeout(5000);

  Browser.site =
    "https://172d5471-6b8e-4846-a95e-5364b4716243-00-    2s6n3gwefbopq.sisko.replit.dev/";

  suite("Headless browser", function () {
    const browser = new Browser();

    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);

      suiteSetup(function (done) {
        return browser.visit("/", done);
      });
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    const url =
      "https://172d5471-6b8e-4846-a95e-5364b4716243-00-2s6n3gwefbopq.sisko.replit.dev/";
    Browser.site = url;
    const browser = new Browser();

    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser
        .visit(url)
        .then(() => {
          return browser.fill("surname", "Colombo");
        })
        .then(() => {
          return browser.pressButton("submit");
        })
        .then(() => {
          browser.assert.success();
          browser.assert.text("span#name", "Cristoforo");
          browser.assert.text("span#surname", "Colombo");
          browser.assert.elements("span#dates", 1);
          done();
        })
        .catch(done);
    });

    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
        browser
          .visit(url)
          .then(() => {
            return browser.fill("surname", "Vespucci");
          })
          .then(() => {
            return browser.pressButton("submit");
          })
          .then(() => {
            browser.assert.success();
            browser.assert.text("span#name", "Amerigo");
            browser.assert.text("span#surname", "Vespucci");
            browser.assert.elements("span#dates", 1);
            done();
          })
          .catch(done);
    });
  });
});
