const express = require("express");
const { Employee, Dependant } = require("../models/Employee");
const router = express.Router();


//POST

// Create a new employee with dependants
router.post("/", async (req, res) => {
  try {
    const {
      empId,
      firstName,
      middleName,
      lastName,
      businessUnit,
      dateOfJoiningFullTime,
      dateOfJoiningInternship,
      relievingDate,
      designation,
      dateOfBirth,
      mobileNumber,
      personalEmail,
      companyEmail,
      permanentAddress,
      correspondenceAddress,
      bloodGroup,
      maritalStatus,
      anniversaryDate,
      bankName,
      nameAsOnBankAccount,
      accountNumber,
      ifscCode,
      panNumber,
      aadhaarNumber,
      manager,
      dependants, // Array of dependants
    } = req.body;

    // Create employee record
    const maxIdRecord = await Employee.findOne({
      order: [['id', 'DESC']]
    });
    
    const nextId = maxIdRecord ? maxIdRecord.id + 1 : 1;

    // Create employee record with the next available ID
    const employee = await Employee.create({
      id: nextId,  // Explicitly set the ID
      ...req.body
    });

    // Add dependants if provided
    if (dependants && Array.isArray(dependants)) {
      for (const dependant of dependants) {
        await Dependant.create({ ...dependant, EmployeeId: employee.id });
      }
    }

    res
      .status(201)
      .json({ message: "Employee created successfully", employee });
  } catch (err) {
    console.error('Detailed error:', {
      name: err.name,
      message: err.message,
      errors: err.errors?.map(e => ({
        field: e.path,
        message: e.message,
        value: e.value
      }))
    });

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: "Employee ID already exists",
        errors: err.errors.map(e => ({
          field: e.path,
          message: "This ID is already taken. Please use a different ID."
        }))
      });
    }

    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    res.status(500).json({ 
      message: "Failed to create employee",
      error: err.message 
    });
  }
});

//GET

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: {
        model: Dependant,
        attributes: ["name", "relationship", "mobileNumber"],
      },
    });

    res.status(200).json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});

//PUT

router.put("/:empId", async (req, res) => {
  try {
    const { empId } = req.params;
    console.log('Updating employee with empId:', empId);
    console.log('Request body:', req.body);

    const employee = await Employee.findOne({ 
      where: { empId: empId }
    });
    
    if (!employee) {
      console.log('Employee not found with empId:', empId);
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log('Found employee:', employee.toJSON());

    await employee.update(req.body);
    console.log('Employee updated successfully');

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ 
      message: "Failed to update employee",
      error: err.message 
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete the dependants first
    await Dependant.destroy({ where: { EmployeeId: employee.id } });

    // Now delete the employee
    await employee.destroy();
    res.status(200).json({
      message: "Employee and associated dependants deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Failed to delete employee and dependants" });
  }
});

// GET employee by ID
router.get("/:id", async (req, res) => {
  try {
      const { id } = req.params;
      
      const employee = await Employee.findOne({
          where: { 
              empId: id  // Using empId instead of id
          },
          include: [{
              model: Employee,
              as: 'Manager',
              attributes: ['firstName', 'lastName', 'empId']
          }]
      });

      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(200).json(employee);
  } catch (err) {
      console.error('Error details:', err);
      res.status(500).json({ 
          message: 'Failed to fetch employee details',
          error: err.message 
      });
  }
});

// Add this route alongside your other employee routes
router.patch('/:empId', async (req, res) => {
    try {
        const { empId } = req.params;
        const { relievingDate } = req.body;
        
        const employee = await Employee.findOne({ where: { empId } });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.update({ relievingDate });
        
        const updatedEmployee = await employee.reload();
        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
