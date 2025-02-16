import * as z from "zod";

export const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    middleName: z.string().optional(),
    empId: z.string().min(1, "Employee ID is required"),
    personalEmail: z.string().email("Invalid email address"),
    companyEmail: z.string().email("Invalid email address"),
    mobileNumber: z.string().min(1, "Mobile number is required"),
    designation: z.string().optional(),
    businessUnit: z.string().optional(),
    dateOfJoiningFullTime: z.string().optional(),
    dateOfJoiningInternship: z.string().optional(),
    dateOfBirth: z.string().optional(),
    bloodGroup: z.string().optional(),
    maritalStatus: z.string().optional(),
    anniversaryDate: z.string().optional(),
    permanentAddress: z.string().min(1, "Permanent address is required"),
    correspondenceAddress: z.string().optional(),
    bankName: z.string().min(1, "Bank name is required"),
    nameAsOnBankAccount: z.string().min(1, "Account name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    ifscCode: z.string().min(1, "IFSC code is required"),
    panNumber: z.string().min(1, "PAN number is required"),
    aadhaarNumber: z.string().min(1, "Aadhaar number is required"),
    manager: z.string().optional(),
    dependants: z.array(z.object({
        name: z.string(),
        relationship: z.string(),
        mobileNumber: z.string()
    })).optional(),
    sameAddress: z.boolean().optional()
});

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    // Add other relevant fields as needed
} 