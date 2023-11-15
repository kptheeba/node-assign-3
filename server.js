const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Read employee and project data from JSON files
const readJSONFile = (filename) => {
    try {
      console.log("inside readJSONFile function");
      const data = fs.readFileSync(filename, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading ${filename}: ${err.message}`);
      return null;
    }
  };

app.get("/", (req, res) => {
  res.send("Hello from node js");
});

// New API to get all employees
app.get("/getallemployees", async (req, res) => {
  const employees = await readJSONFile("./data/employees.json");

  if (employees) {
    res.json(employees);
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// New API to get all employees
app.get("/getallprojects", async (req, res) => {
  const projects = await readJSONFile("./data/projects.json");

  if (projects) {
    res.json(projects);
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//First API would take the Employee Id as Input and Queries the underlying JSON File to fetch Employee Data at:(localhost:3000/employee/:id)
app.get("/employee/:id", async (req, res) => {
  const eId = req.params.id;
  const employees = await readJSONFile("./data/employees.json");
    if (employees){
        const emp = employees.find((e) => e.id === eId);
        if(emp){
            res.json(emp);
        }else{
            res.status(404).json({error: ' Employee not found'});
        }
    }else{        
        res.status(500).json({error: ' Internal server error'});
    }  
});

//Second API would take the Project ID as input and Query the JSON File to fetch Project Information at:(localhost:3000/project/:id)
app.get("/project/:id", async (req, res) => {
    const pId = req.params.id;
    const projects = await readJSONFile("./data/projects.json");
    if(projects){
        const proj = projects.find((p) => p.id === pId);
        if(proj){
            res.json(proj);
        }else{
            res.status(404).json({error: ' Project not found'});
        }
    }else{
        res.status(500).json({error: ' Internal server error'});
    }
});

// Third API to get employee details along with project details

app.get('/getemployeedetails/:id', async (req, res) => {
    const employeeId = req.params.id;

    try{
         // Fetch employee data
    const employeeResponse = await fetch(`http://localhost:${PORT}/employee/${employeeId}`);
    const employeeData = await employeeResponse.json();

    // Check if employee data is found
    if (employeeData.error) {
      res.status(404).json(employeeData);
      return;
    }

    // Fetch project data using the ProjectID from employee data
    const projectId = employeeData.projectId;
    const projectResponse = await fetch(`http://localhost:${PORT}/project/${projectId}`);
    const projectData = await projectResponse.json();

    // Combine employee and project data
    const result = { employee: employeeData, project: projectData };

    res.json(result);
    }catch(err){
        console.error(`Error fetching data: ${err.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
