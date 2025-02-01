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
    const employee = await Employee.create({
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
    console.error(err.message);
    res.status(500).json({ message: "Failed to create employee" });
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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
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
      dependants,
    } = req.body;

    // Update the employee
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.update({
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
    });

    // Update dependants
    if (dependants && Array.isArray(dependants)) {
      await Dependant.destroy({ where: { EmployeeId: employee.id } }); // Remove old dependants
      for (const dependant of dependants) {
        await Dependant.create({ ...dependant, EmployeeId: employee.id });
      }
    }

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to update employee" });
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

module.exports = router;
