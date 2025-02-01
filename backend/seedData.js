const { Employee, Dependant } = require("./models/Employee");
const { sequelize } = require("./config/database");

const employees = [
  {
    empId: "EMP001",
    firstName: "John",
    lastName: "Doe",
    businessUnit: "Engineering",
    dateOfJoiningFullTime: "2023-01-15",
    designation: "Software Engineer",
    dateOfBirth: "1990-05-20",
    mobileNumber: "9876543210",
    personalEmail: "john.doe@personal.com",
    companyEmail: "john.doe@company.com",
    manager: "EMP002",
    dependants: [
      {
        name: "Jane Doe",
        relationship: "Spouse",
        mobileNumber: "9876543211"
      }
    ]
  },
  {
    empId: "EMP002",
    firstName: "Sarah",
    lastName: "Wilson",
    businessUnit: "Engineering",
    dateOfJoiningFullTime: "2022-03-10",
    designation: "Engineering Manager",
    dateOfBirth: "1985-08-15",
    mobileNumber: "9876543212",
    personalEmail: "sarah.wilson@personal.com",
    companyEmail: "sarah.wilson@company.com",
    manager: "EMP003",
    dependants: [
      {
        name: "Tom Wilson",
        relationship: "Son",
        mobileNumber: "9876543213"
      },
      {
        name: "Mike Wilson",
        relationship: "Spouse",
        mobileNumber: "9876543214"
      }
    ]
  },
  // Add more employees...
];

// Function to generate random dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate 28 more employees
for (let i = 3; i <= 30; i++) {
  const empId = `EMP${i.toString().padStart(3, '0')}`;
  const firstName = ['Alex', 'Maria', 'David', 'Lisa', 'Michael', 'Emma', 'James', 'Sofia'][Math.floor(Math.random() * 8)];
  const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][Math.floor(Math.random() * 8)];
  const businessUnits = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const designations = ['Software Engineer', 'Product Manager', 'Sales Executive', 'HR Manager', 'Financial Analyst'];
  
  employees.push({
    empId,
    firstName,
    lastName,
    businessUnit: businessUnits[Math.floor(Math.random() * businessUnits.length)],
    dateOfJoiningFullTime: randomDate(new Date(2020, 0, 1), new Date()).toISOString().split('T')[0],
    designation: designations[Math.floor(Math.random() * designations.length)],
    dateOfBirth: randomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)).toISOString().split('T')[0],
    mobileNumber: Math.floor(Math.random() * 9000000000 + 1000000000).toString(),
    personalEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@personal.com`,
    companyEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
    manager: `EMP${Math.floor(Math.random() * (i-1) + 1).toString().padStart(3, '0')}`,
    dependants: [
      {
        name: `${['Anna', 'John', 'Mary', 'Peter'][Math.floor(Math.random() * 4)]} ${lastName}`,
        relationship: ['Spouse', 'Child', 'Parent'][Math.floor(Math.random() * 3)],
        mobileNumber: Math.floor(Math.random() * 9000000000 + 1000000000).toString()
      }
    ]
  });
}

const seedDatabase = async () => {
  try {
    // Sync database (this will create tables if they don't exist)
    await sequelize.sync({ force: true }); // Be careful with force: true in production!

    // Create employees and their dependants
    for (const employeeData of employees) {
      const { dependants, ...employeeDetails } = employeeData;
      const employee = await Employee.create(employeeDetails);
      
      if (dependants && dependants.length > 0) {
        for (const dependant of dependants) {
          await Dependant.create({
            ...dependant,
            EmployeeId: employee.id
          });
        }
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();