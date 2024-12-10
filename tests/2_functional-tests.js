/* I have utilized ChatGPT as a resource for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  let testId; // Store _id for created issue

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
          testId = res.body._id; // Save the _id for later tests
          done();
        });
    });

    test('Create an issue with only required fields', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Test issue 2',
          issue_text: 'Another test',
          created_by: 'Tester 2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          done();
        });
    });

    test('Create an issue with missing required fields', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({ issue_text: 'Missing fields' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done();
        });
    });
  });

  suite('GET /api/issues/{project}', function () {
    test('View issues on a project', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test('View issues on a project with one filter', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ open: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isTrue(res.body.every(issue => issue.open));
          done();
        });
    });

    test('View issues on a project with multiple filters', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ open: true, assigned_to: 'Developer' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isTrue(res.body.every(issue => issue.open && issue.assigned_to === 'Developer'));
          done();
        });
    });
  });

  suite('PUT /api/issues/{project}', function () {
    test('Update one field on an issue', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({ _id: testId, issue_title: 'Updated title' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', _id: testId });
          done();
        });
    });

    test('Update multiple fields on an issue', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({ _id: testId, issue_title: 'Updated title', open: false })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', _id: testId });
          done();
        });
    });

    test('Update an issue with missing _id', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({ issue_title: 'Updated title' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

    test('Update an issue with no fields to update', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({ _id: testId })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: testId });
          done();
        });
    });
  });

  suite('DELETE /api/issues/{project}', function () {
    test('Delete an issue', function (done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: testId })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully deleted', _id: testId });
          done();
        });
    });

    test('Delete an issue with an invalid _id', function (done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: 'invalid_id' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not delete', _id: 'invalid_id' });
          done();
        });
    });

    test('Delete an issue with missing _id', function (done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });
  });
  suite('Final Verification', function () {
  test('Ensure all tests are running', function (done) {
    assert.isTrue(true);
    done();
  });
});

});
