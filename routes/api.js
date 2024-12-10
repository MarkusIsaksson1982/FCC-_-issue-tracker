'use strict';

const issues = {}; // Temporary storage, replace with a database later
const { v4: uuidv4 } = require('uuid'); // Use UUID for unique IDs

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    // Create a new issue
    .post((req, res) => {
      const { project } = req.params;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const newIssue = {
        _id: uuidv4(),
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      };

      if (!issues[project]) {
        issues[project] = [];
      }
      issues[project].push(newIssue);
      res.json(newIssue);
    });
};
