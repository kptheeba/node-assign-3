const express = require('express');
const request = require('request');

const app = express();
const PORT = 3000;

// API endpoint to fetch employee data
const apiUrl = 'http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees';

// Fetch employee data from the API
const fetchEmployeeData = (callback) => {
  request(apiUrl, { json: true }, (error, response, body) => {
    if (error) {
      console.error('Error fetching employee data:', error);
      callback(error, null);
    } else if (response.statusCode !== 200) {
      console.error('Error fetching employee data. Status code:', response.statusCode);
      callback(new Error(`Failed to fetch employee data. Status code: ${response.statusCode}`), null);
    } else {
      callback(null, body);
    }
  });
};

// Route to display employee list
app.get('/employeelist', (req, res) => {
  fetchEmployeeData((error, employeeData) => {
    if (error) {
      res.status(500).send('Internal Server Error');
    } else {
      const employeeList = employeeData.map((employee) => ({
        name: employee.name,
        id: employee.id,
        createdAt: employee.createdAt,
      }));

      res.json(employeeList);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
