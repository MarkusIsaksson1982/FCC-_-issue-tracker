/* I have utilized ChatGPT as a resource for guidance and learning throughout this project. My approach reflects the growing trend of modern developers using AI tools to enhance their coding processes. However, all the final code presented here is my own work, based on own independently thought out prompts and without copying prompts or code from others other than snippets. I believe this practice aligns with the principles of academic honesty, as it emphasizes learning and using technology responsibly. */

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
    })

    // Get issues for a project
    .get((req, res) => {
      const { project } = req.params;
      const query = req.query;

      if (!issues[project]) {
        return res.json([]); // Return empty array if no issues for the project
      }

      // Filter issues based on query parameters
      let filteredIssues = issues[project];
      for (let key in query) {
        filteredIssues = filteredIssues.filter(issue => String(issue[key]) === String(query[key]));
      }

      res.json(filteredIssues);
    })

    // Update an issue
    .put((req, res) => {
      const { project } = req.params;
      const { _id, ...fieldsToUpdate } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      if (!Object.keys(fieldsToUpdate).length) {
        return res.json({ error: 'no update field(s) sent', _id });
      }

      if (!issues[project]) {
        return res.json({ error: 'could not update', _id });
      }

      const issue = issues[project].find(issue => issue._id === _id);

      if (!issue) {
        return res.json({ error: 'could not update', _id });
      }

      // Update issue fields
      for (let key in fieldsToUpdate) {
        if (fieldsToUpdate[key]) {
          issue[key] = fieldsToUpdate[key];
        }
      }

      issue.updated_on = new Date();
      res.json({ result: 'successfully updated', _id });
    })

    // Delete an issue
    .delete((req, res) => {
      const { project } = req.params;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      if (!issues[project]) {
        return res.json({ error: 'could not delete', _id });
      }

      const issueIndex = issues[project].findIndex(issue => issue._id === _id);

      if (issueIndex === -1) {
        return res.json({ error: 'could not delete', _id });
      }

      issues[project].splice(issueIndex, 1);
      res.json({ result: 'successfully deleted', _id });
    });

};
