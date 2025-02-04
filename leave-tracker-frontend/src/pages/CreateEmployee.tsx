import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/ui/datePicker";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown } from "lucide-react"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useEffect } from "react";

interface Employee {
    id: string;
    empId: string;
    firstName: string;
    lastName: string;
}

interface EmployeeData {
    id?: string;
    _id?: string;
    empId?: string;
    firstName?: string;
    lastName?: string;
}

import { BASE_URL } from '@/main';

interface Dependant {
    name: string;
    relationship: string;
    mobileNumber: string;
}

interface EmployeeFormData {
    empId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    businessUnit: string;
    dateOfJoiningFullTime: Date;
    dateOfJoiningInternship?: Date;
    designation: string;
    dateOfBirth: Date;
    mobileNumber: string;
    personalEmail: string;
    companyEmail: string;
    permanentAddress: string;
    correspondenceAddress?: string;
    bloodGroup: string;
    maritalStatus: string;
    anniversaryDate?: Date;
    bankName: string;
    nameAsOnBankAccount: string;
    accountNumber: string;
    ifscCode: string;
    panNumber: string;
    aadhaarNumber: string;
    manager: string;
    dependants: Dependant[];
}

const CreateEmployee = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset: formReset
    } = useForm<EmployeeFormData>({
        defaultValues: {
            // Add default values if needed
        }
    });
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [, setLoading] = useState(true);

    const [dependants, setDependants] = useState<Dependant[]>([]);

    const addDependant = () => {
        if (dependants.length < 4) {
            setDependants([...dependants, { name: '', relationship: '', mobileNumber: '' }]);
        }
    };

    const removeDependant = (index: number) => {
        setDependants(dependants.filter((_, i) => i !== index));
    };

    const updateDependant = (index: number, field: keyof Dependant, value: string) => {
        const newDependants = [...dependants];
        newDependants[index] = { ...newDependants[index], [field]: value };
        setDependants(newDependants);
        setValue('dependants', newDependants);
    };

    // Fetch employees when component mounts
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/employees`);
                if (!response.ok) throw new Error('Failed to fetch employees');
                const data = await response.json();
                console.log('API Response:', data); // Debug log

                // Ensure data is an array and has the required properties
                if (Array.isArray(data)) {
                    const formattedEmployees = data.map((emp) => ({
                        id: emp.id || emp._id || '',
                        empId: emp.empId || '',
                        firstName: emp.firstName || '',
                        lastName: emp.lastName || ''
                    }));
                    console.log('Formatted Employees:', formattedEmployees); // Debug log
                    setEmployees(formattedEmployees);
                } else if (data.employees && Array.isArray(data.employees)) {
                    // Handle case where data might be wrapped in an object
                    const formattedEmployees = data.employees.map((emp: EmployeeData) => ({
                        id: emp.id || emp._id || '',
                        empId: emp.empId || '',
                        firstName: emp.firstName || '',
                        lastName: emp.lastName || ''
                    }));
                    console.log('Formatted Employees:', formattedEmployees); // Debug log
                    setEmployees(formattedEmployees);
                } else {
                    console.error('Invalid data format:', data); // Debug log
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
                toast({
                    title: "Error",
                    description: "Failed to load employees list",
                    variant: "destructive",
                });
                setEmployees([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleSameAddressCheck = (checked: boolean) => {
        if (checked) {
            const permanentAddr = watch("permanentAddress");
            setValue("correspondenceAddress", permanentAddr);
        } else {
            setValue("correspondenceAddress", "");
        }
    };

    const checkEmployeeIdExists = async (empId: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees/${empId}`);
            return response.ok; // Returns true if employee exists
        } catch (error) {
            return false;
        }
    };

    const onSubmit = async (data: EmployeeFormData) => {
        try {
            // Check if employee ID exists
            const exists = await checkEmployeeIdExists(data.empId);
            if (exists) {
                toast({
                    title: "Error",
                    description: "Employee ID already exists. Please use a different ID.",
                    variant: "destructive",
                });
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create employee');
            }

            toast({
                title: "Success",
                description: "Employee created successfully",
            });

            navigate('/employees');

        } catch (error) {
            console.error('Error creating employee:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create employee",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full p-6 md:w-3/5">
                <div className="flex items-center gap-2 mb-6 w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-muted-foreground hover:text-primary"
                    >
                        <ChevronLeftIcon className="h-8 w-8" />
                    </button>

                    <h1 className="text-2xl font-bold">Create New Employee</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent>

                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Name */}
                                <div className="space-y-2 col-span-2 md:col-span-2">
                                    <Label htmlFor="firstName" className="text-slate-400">Name *</Label>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <Input
                                            id="firstName"
                                            placeholder="First Name"
                                            {...register("firstName", { required: true })}
                                        />
                                        <Input
                                            id="middleName"
                                            placeholder="Middle Name"
                                            {...register("middleName")}
                                        />
                                        <Input
                                            id="lastName"
                                            placeholder="Last Name"
                                            {...register("lastName", { required: true })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <Label htmlFor="empId" className="text-slate-400">Employee ID *</Label>
                                    <Input
                                        id="empId"
                                        {...register("empId", {
                                            required: "Employee ID is required",
                                            pattern: {
                                                value: /^[A-Za-z0-9-]+$/,
                                                message: "Employee ID can only contain letters, numbers, and hyphens"
                                            }
                                        })}
                                    />
                                    {errors.empId && (
                                        <span className="text-sm text-red-500">{errors.empId.message}</span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="businessUnit" className="text-slate-400">Business Unit *</Label>
                                    <Select onValueChange={(value) => setValue("businessUnit", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Business Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Steam-A">Steam-A</SelectItem>
                                            <SelectItem value="Labs">Labs</SelectItem>
                                            <SelectItem value="Infosys">Infosys</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="designation" className="text-slate-400">Designation *</Label>
                                    <Input id="designation" {...register("designation", { required: true })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Employment Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfJoiningFullTime" className="text-slate-400">Date of Joining (Full Time) *</Label>
                                    <DatePicker
                                        id="dateOfJoiningFullTime"
                                        name="dateOfJoiningFullTime"
                                        register={register}
                                        onChange={(date) => setValue("dateOfJoiningFullTime", date || new Date())}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfJoiningInternship" className="text-slate-400">Date of Joining (Internship)</Label>
                                    <DatePicker
                                        id="dateOfJoiningInternship"
                                        name="dateOfJoiningInternship"
                                        register={register}
                                        onChange={(date) => setValue("dateOfJoiningInternship", date || new Date())}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manager" className="text-slate-400">Manager *</Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between"
                                            >
                                                {watch("manager") ?
                                                    `${employees.find((employee) => employee.id === watch("manager"))?.firstName || ''} ${employees.find((employee) => employee.id === watch("manager"))?.lastName || ''}`
                                                    : "Select manager..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                            <Command defaultValue="">
                                                <CommandInput placeholder="Search manager..." />
                                                <CommandList className="max-h-[200px] overflow-y-auto scrollbar-thin">
                                                    <CommandEmpty>No manager found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {employees?.map((employee) => (
                                                            <CommandItem
                                                                key={employee.id}
                                                                value={`${employee.firstName} ${employee.lastName}`}
                                                                onSelect={() => {
                                                                    setValue("manager", employee.id);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                {employee.firstName} {employee.lastName}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth" className="text-slate-400">Date of Birth *</Label>
                                    <DatePicker
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        register={register}
                                        onChange={(date) => setValue("dateOfBirth", date || new Date())}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobileNumber" className="text-slate-400">Mobile Number *</Label>
                                    <Input id="mobileNumber" {...register("mobileNumber", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="personalEmail" className="text-slate-400">Personal Email *</Label>
                                    <Input id="personalEmail" {...register("personalEmail", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="companyEmail" className="text-slate-400">Company Email *</Label>
                                    <Input id="companyEmail" {...register("companyEmail", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bloodGroup" className="text-slate-400">Blood Group *</Label>
                                    <Select onValueChange={(value) => setValue("bloodGroup", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select blood group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maritalStatus" className="text-slate-400">Marital Status *</Label>
                                    <Select onValueChange={(value) => setValue("maritalStatus", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select marital status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="single">Single</SelectItem>
                                            <SelectItem value="married">Married</SelectItem>
                                            <SelectItem value="divorced">Divorced</SelectItem>
                                            <SelectItem value="widowed">Widowed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="anniversaryDate" className="text-slate-400">Anniversary Date</Label>
                                    <DatePicker
                                        id="anniversaryDate"
                                        name="anniversaryDate"
                                        register={register}
                                        onChange={(date) => setValue("anniversaryDate", date || new Date())}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="permanentAddress" className="text-slate-400">Permanent Address *</Label>
                                    <Textarea
                                        id="permanentAddress"
                                        {...register("permanentAddress", { required: true })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="correspondenceAddress" className="text-slate-400">Correspondence Address</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="sameAddress"
                                                onCheckedChange={handleSameAddressCheck}
                                            />
                                            <Label
                                                htmlFor="sameAddress"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Same as Permanent Address
                                            </Label>
                                        </div>
                                    </div>
                                    <Textarea
                                        id="correspondenceAddress"
                                        {...register("correspondenceAddress")}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Bank Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bankName" className="text-slate-400">Bank Name *</Label>
                                    <Input id="bankName" {...register("bankName", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nameAsOnBankAccount" className="text-slate-400">Name as on Bank Account *</Label>
                                    <Input id="nameAsOnBankAccount" {...register("nameAsOnBankAccount", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountNumber" className="text-slate-400">Account Number *</Label>
                                    <Input id="accountNumber" {...register("accountNumber", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ifscCode" className="text-slate-400">IFSC Code *</Label>
                                    <Input id="ifscCode" {...register("ifscCode", { required: true })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Government IDs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Government IDs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="panNumber" className="text-slate-400">PAN Number *</Label>
                                    <Input id="panNumber" {...register("panNumber", { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="aadhaarNumber" className="text-slate-400" >Aadhaar Number *</Label>
                                    <Input id="aadhaarNumber" {...register("aadhaarNumber", { required: true })} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dependants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dependants.map((dependant, index) => (
                                    <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeDependant(index)}
                                        >
                                            ×
                                        </Button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`dependant-${index}-name`}>Name</Label>
                                                <Input
                                                    id={`dependant-${index}-name`}
                                                    value={dependant.name}
                                                    onChange={(e) => updateDependant(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`dependant-${index}-relationship`}>Relationship</Label>
                                                <Select
                                                    onValueChange={(value) => updateDependant(index, 'relationship', value)}
                                                    value={dependant.relationship}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select relationship" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="spouse">Spouse</SelectItem>
                                                        <SelectItem value="child">Child</SelectItem>
                                                        <SelectItem value="father">Father</SelectItem>
                                                        <SelectItem value="mother">Mother</SelectItem>
                                                        <SelectItem value="sibling">Sibling</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`dependant-${index}-mobile`}>Mobile Number</Label>
                                                <Input
                                                    id={`dependant-${index}-mobile`}
                                                    value={dependant.mobileNumber}
                                                    onChange={(e) => updateDependant(index, 'mobileNumber', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {dependants.length < 4 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addDependant}
                                        className="w-full"
                                    >
                                        <div className="flex items-center gap-2">
                                            <PlusIcon className="w-4 h-4" />
                                            Add Dependant
                                        </div>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => formReset()}>
                            Reset
                        </Button>
                        <Button type="submit">Create Employee</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEmployee;
