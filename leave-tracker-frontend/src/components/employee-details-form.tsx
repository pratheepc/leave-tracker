import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/validations/employee";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "@/main";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePicker } from "./ui/date-picker";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { CommandGroup, CommandItem } from "./ui/command";
import { CommandEmpty } from "./ui/command";
import { CommandList } from "./ui/command";
import { CommandInput } from "./ui/command";
import { Command } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronsUpDown, PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Employee } from "@/lib/validations/employee";

interface EmployeeDetailsFormProps {
    isEditing?: boolean;
    initialData?: z.infer<typeof formSchema>;
    empId?: string;
}

export function EmployeeDetailsForm({ isEditing = false, initialData, empId }: EmployeeDetailsFormProps) {
    const { empId: paramsEmpId } = useParams();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [open, setOpen] = useState(false);
    const [dependants, setDependants] = useState<{ name: string; relationship: string; mobileNumber: string }[]>(initialData?.dependants || []);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            firstName: "",
            lastName: "",
            middleName: "",
            empId: "",
            personalEmail: "",
            companyEmail: "",
            mobileNumber: "",
            designation: "",
            businessUnit: "",
            dateOfJoiningFullTime: "",
            dateOfJoiningInternship: "",
            dateOfBirth: "",
            bloodGroup: "",
            maritalStatus: "",
            anniversaryDate: "",
            permanentAddress: "",
            correspondenceAddress: "",
            bankName: "",
            nameAsOnBankAccount: "",
            accountNumber: "",
            ifscCode: "",
            panNumber: "",
            aadhaarNumber: "",
            manager: "",
            sameAddress: false
        }
    });

    console.log('isEditing:', isEditing);
    console.log('empId from params:', paramsEmpId);
    console.log('initialData:', initialData);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${BASE_URL}/employees`);
                if (!response.ok) throw new Error('Failed to fetch employees');
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            console.log('Fetching employee data. isEditing:', isEditing, 'empId:', empId);
            if (isEditing && empId) {
                try {
                    const response = await fetch(`${BASE_URL}/employees/${empId}`);
                    if (!response.ok) throw new Error('Failed to fetch employee');
                    const data = await response.json();
                    console.log('Fetched employee data:', data);
                    form.reset(data);
                } catch (error) {
                    console.error('Error fetching employee:', error);
                    toast({
                        title: "Error",
                        description: "Failed to fetch employee details",
                        variant: "destructive",
                    });
                }
            }
        };

        fetchEmployeeData();
    }, [isEditing, empId]);

    useEffect(() => {
        if (isEditing && initialData) {
            // Set all form values including select and date inputs
            form.reset({
                ...initialData,
                // Convert date strings to proper format if they exist
                dateOfBirth: initialData.dateOfBirth || "",
                dateOfJoiningFullTime: initialData.dateOfJoiningFullTime || "",
                dateOfJoiningInternship: initialData.dateOfJoiningInternship || "",
                anniversaryDate: initialData.anniversaryDate || "",
                // Set other select values
                bloodGroup: initialData.bloodGroup || "",
                maritalStatus: initialData.maritalStatus || "",
                businessUnit: initialData.businessUnit || "",
                manager: initialData.manager || ""
            });
        }
    }, [isEditing, initialData]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch(`${BASE_URL}/employees${isEditing ? `/${initialData?.empId}` : ''}`, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to save employee');
            }

            toast({
                title: isEditing ? "Employee Updated" : "Employee Created",
                description: isEditing ? "Employee details have been updated successfully." : "New employee has been created successfully.",
            });

            navigate('/employees');
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${isEditing ? 'update' : 'create'} employee`,
                variant: "destructive",
            });
        }
    };

    const handleSameAddressCheck = (checked: boolean) => {
        form.setValue("sameAddress", checked);
        if (checked) {
            const permanentAddress = form.getValues("permanentAddress");
            form.setValue("correspondenceAddress", permanentAddress);
        } else {
            form.setValue("correspondenceAddress", "");
        }
    };

    const addDependant = () => {
        setDependants([...dependants, { name: "", relationship: "", mobileNumber: "" }]);
    };

    const removeDependant = (index: number) => {
        const newDependants = dependants.filter((_, i) => i !== index);
        setDependants(newDependants);
    };

    const updateDependant = (index: number, field: keyof { name: string; relationship: string; mobileNumber: string }, value: string) => {
        const newDependants = [...dependants];
        newDependants[index] = { ...newDependants[index], [field]: value };
        setDependants(newDependants);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                {/* Move all your existing form content here */}
                {/* ... */}
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
                                        {...form.register("firstName", { required: true })}
                                    />
                                    <Input
                                        id="middleName"
                                        placeholder="Middle Name"
                                        {...form.register("middleName")}
                                    />
                                    <Input
                                        id="lastName"
                                        placeholder="Last Name"
                                        {...form.register("lastName", { required: true })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <Label htmlFor="empId" className="text-slate-400">Employee ID *</Label>
                                <Input
                                    id="empId"
                                    disabled={isEditing}
                                    {...form.register("empId", {
                                        required: "Employee ID is required",
                                        pattern: {
                                            value: /^[A-Za-z0-9-]+$/,
                                            message: "Employee ID can only contain letters, numbers, and hyphens"
                                        }
                                    })}
                                />
                                {form.formState.errors.empId && (
                                    <span className="text-sm text-red-500">{form.formState.errors.empId.message}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="businessUnit" className="text-slate-400">Business Unit *</Label>
                                <Select
                                    defaultValue={initialData?.businessUnit}
                                    onValueChange={(value) => form.setValue("businessUnit", value)}
                                >
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
                                <Input id="designation" {...form.register("designation", { required: true })} />
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
                                <FormField
                                    control={form.control}
                                    name="dateOfJoiningFullTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-400">Date of Joining (Full Time) *</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="dateOfJoiningInternship"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-400">Date of Joining (Internship)</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
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
                                            {form.watch("manager") ?
                                                `${employees.find((employee: Employee) => employee.id === form.watch("manager"))?.firstName || ''} ${employees.find((employee: Employee) => employee.id === form.watch("manager"))?.lastName || ''}`
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
                                                                form.setValue("manager", employee.id);
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
                                <FormField
                                    control={form.control}
                                    name="dateOfBirth"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-400">Date of Birth *</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobileNumber" className="text-slate-400">Mobile Number *</Label>
                                <Input id="mobileNumber" {...form.register("mobileNumber", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="personalEmail" className="text-slate-400">Personal Email *</Label>
                                <Input id="personalEmail" {...form.register("personalEmail", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyEmail" className="text-slate-400">Company Email *</Label>
                                <Input id="companyEmail" {...form.register("companyEmail", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bloodGroup" className="text-slate-400">Blood Group *</Label>
                                <Select
                                    defaultValue={initialData?.bloodGroup}
                                    onValueChange={(value) => form.setValue("bloodGroup", value)}
                                >
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
                                <Select
                                    defaultValue={initialData?.maritalStatus}
                                    onValueChange={(value) => form.setValue("maritalStatus", value)}
                                >
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
                                <FormField
                                    control={form.control}
                                    name="anniversaryDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-400">Anniversary Date</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
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
                                    {...form.register("permanentAddress", { required: true })}
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
                                    {...form.register("correspondenceAddress")}
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
                                <Input id="bankName" {...form.register("bankName", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameAsOnBankAccount" className="text-slate-400">Name as on Bank Account *</Label>
                                <Input id="nameAsOnBankAccount" {...form.register("nameAsOnBankAccount", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accountNumber" className="text-slate-400">Account Number *</Label>
                                <Input id="accountNumber" {...form.register("accountNumber", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ifscCode" className="text-slate-400">IFSC Code *</Label>
                                <Input id="ifscCode" {...form.register("ifscCode", { required: true })} />
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
                                <Input id="panNumber" {...form.register("panNumber", { required: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aadhaarNumber" className="text-slate-400" >Aadhaar Number *</Label>
                                <Input id="aadhaarNumber" {...form.register("aadhaarNumber", { required: true })} />
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
                    <Button variant="outline" type="button" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit">
                        {isEditing ? "Update Employee" : "Create Employee"}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 