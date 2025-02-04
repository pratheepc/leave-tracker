import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { ArrowUpRightIcon } from "lucide-react"
import { BASE_URL } from "@/main"
import { useNavigate } from "react-router-dom"




export interface Employee {
    id: string;
    empId: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth?: string;
    mobileNumber?: string;
    personalEmail?: string;
    bloodGroup?: string;
    maritalStatus?: string;
    anniversaryDate?: string;
    businessUnit?: string;
    designation?: string;
    companyEmail?: string;
    manager?: string;
    dateOfJoiningFullTime?: string;
    dateOfJoiningInternship?: string;
    relievingDate?: string;
    permanentAddress?: string;
    correspondenceAddress?: string;
    bankName?: string;
    nameAsOnBankAccount?: string;
    accountNumber?: string;
    ifscCode?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    createdAt?: string;
    updatedAt?: string;
    department?: string;
    status?: 'ACTIVE' | 'INACTIVE';
}




export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
    const navigate = useNavigate();
    
    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/employees`);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            setEmployees(data);
            setFilteredEmployees(data); // Initialize filtered employees with all employees
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch employees. Please try again.",
                duration: 3000,
            });

        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (employees.length > 0) {
            let result = [...employees]

            // Apply search filter
            if (searchTerm) {
                result = result.filter(employee =>
                    employee.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.personalEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.designation?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            }

            // Apply status filter
            if (statusFilter !== 'ALL') {
                result = result.filter(employee => employee.status === statusFilter)
            }

            setFilteredEmployees(result)
        }
    }, [employees, searchTerm, statusFilter])


    // Update the search input handler
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    // Update the status filter handler
    const handleStatusFilter = (value: string) => {
        setStatusFilter(value as 'ALL' | 'ACTIVE' | 'INACTIVE')
    }


    //UI
    // ... existing code ...


    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
                <Button onClick={() => navigate('/create-employee')}>Add Employee</Button>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Employees</CardTitle>
                    {isLoading && <p className="text-muted-foreground">Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                </CardHeader>

                {/* Filter and Sort */}
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            {/* Search */}
                            <div className="relative w-72">
                                <Input
                                    type="search"
                                    placeholder="Search employees..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            {/* Sort */}
                            <Select onValueChange={(value) => {
                                const sorted = [...employees].sort((a, b) => {
                                    switch (value) {
                                        case "name-asc":
                                            return a.firstName.localeCompare(b.firstName);
                                        case "name-desc":
                                            return b.firstName.localeCompare(a.firstName);
                                        case "date-asc":
                                            return new Date(a.dateOfJoiningFullTime || '').getTime() - new Date(b.dateOfJoiningFullTime || '').getTime();
                                        case "date-desc":
                                            return new Date(b.dateOfJoiningFullTime || '').getTime() - new Date(a.dateOfJoiningFullTime || '').getTime();
                                        case "empId-asc":
                                            return a.empId.localeCompare(b.empId);
                                        case "empId-desc":
                                            return b.empId.localeCompare(a.empId);
                                        default:
                                            return 0;
                                    }
                                });
                                setEmployees(sorted);
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="empId-asc">Employee ID (Ascending)</SelectItem>
                                    <SelectItem value="empId-desc">Employee ID (Descending)</SelectItem>
                                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                                    <SelectItem value="date-asc">Join Date (Oldest)</SelectItem>
                                    <SelectItem value="date-desc">Join Date (Newest)</SelectItem>

                                </SelectContent>
                            </Select>

                            {/* Filter by Status */}
                            <Select onValueChange={handleStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Reporting Manager</TableHead>
                                <TableHead>Joining Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees && filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee) => (
                                    <TableRow
                                        key={employee.empId}
                                        className="cursor-pointer hover:bg-gray-100"
                                        onClick={() => window.location.href = `/employees/${employee.empId}`}
                                    >
                                        <TableCell>{employee.empId}</TableCell>
                                        <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                                        <TableCell>{employee.personalEmail}</TableCell>
                                        <TableCell>{employee.designation}</TableCell>
                                        <TableCell>
                                            {employees.find(e => e.empId === employee.manager)?.firstName || 'No Manager'}
                                        </TableCell>
                                        <TableCell>{employee.dateOfJoiningFullTime ? new Date(employee.dateOfJoiningFullTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</TableCell>
                                        <TableCell>
                                            <ArrowUpRightIcon className="w-8 h-8 text-gray-400" />
                                        </TableCell>
                                    </TableRow>

                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">
                                        {isLoading ? 'Loading...' : 'No employees found'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

