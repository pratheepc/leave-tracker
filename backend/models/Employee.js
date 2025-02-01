const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  empId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middleName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  businessUnit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfJoiningFullTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dateOfJoiningInternship: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  relievingDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  personalEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  permanentAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  correspondenceAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bloodGroup: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maritalStatus: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  anniversaryDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nameAsOnBankAccount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ifscCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  panNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  aadhaarNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  manager: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Dependant = sequelize.define("Dependant", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  relationship: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Define one-to-many relationship for dependants
// ... existing model definition ...

Employee.belongsTo(Employee, {
  foreignKey: 'manager',
  targetKey: 'empId',
  as: 'Manager'
});

Employee.hasMany(Dependant, { foreignKey: "EmployeeId", onDelete: "CASCADE" });
Dependant.belongsTo(Employee, { foreignKey: "EmployeeId" });

module.exports = { Employee, Dependant };
