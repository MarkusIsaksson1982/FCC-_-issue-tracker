const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  suite('POST /api/issues/{project}', function () {
    test('Create an issue with every field', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test issue',
          issue_text: 'This is a test',
          created_by: 'Tester',
          assigned_to: 'Developer',
          status_text: 'In QA'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Test issue');
          assert.equal(res.body.assigned_to, 'Developer');
          done();
        });
    });

    test('Create an issue with only required fields', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test issue 2',
          issue_text: 'Another test',
          created_by: 'Tester 2',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Test issue 2');
          assert.equal(res.body.assigned_to, '');
          done();
        });
    });

    test('Create an issue with missing required fields', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_text: 'Missing title and created_by',
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done();
        });
    });
  });
});
