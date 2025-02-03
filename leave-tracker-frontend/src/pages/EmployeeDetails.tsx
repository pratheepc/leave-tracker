import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { BriefcaseIcon, PhoneIcon, HomeIcon, CreditCardIcon, UserIcon, ChevronLeftIcon } from "lucide-react";
import { Employee } from './employees';
import { toast } from '@/hooks/use-toast';
import { BASE_URL } from '@/main';



const EmployeeDetails = () => {
    const navigate = useNavigate();
    const { empId } = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchEmployee = async () => {
            if (!empId) return;
            try {
                console.log('Fetching from:', `${BASE_URL}/employees/${empId}`);
                const response = await fetch(`${BASE_URL}/employees/${empId}`);
                if (!response.ok) {
                    const errorData = await response.text();
                    console.error('API Error:', errorData);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to fetch employee details",
                        duration: 3000
                    });
                    throw new Error(errorData);
                }

                const data = await response.json();
                console.log('Employee data:', data);
                setEmployee(data);
            } catch (error) {
                console.error('Error fetching employee:', error);
                setError(error instanceof Error ? error.message : 'Failed to fetch employee details');
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: 'Failed to fetch employee details',
                    duration: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [empId]);

    console.log({
        empId,
        loading,
        employee,
        error,
        apiUrl: `${BASE_URL}/employees/${empId}`
    });

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <Skeleton className="h-8 w-[250px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-[200px] rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!employee) {
        return <div>No employee data found</div>;
    }



    const formatDate = (date: string | undefined) => {
        if (!date) return 'Not specified';
        return format(new Date(date), 'dd MMM yyyy');
    };



    return (
        <div className="container p-4 space-y-6">
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-muted-foreground hover:text-primary"
                >
                    <ChevronLeftIcon className="h-8 w-8" />
                </button>
                <h1 className="text-3xl font-bold">Employee Profile</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Basic Info Card */}
                <Card className="col-span-full md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p>{`${employee.firstName} ${employee.middleName || ''} ${employee.lastName}`.trim()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                            <p>{employee.empId}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                            <p>{formatDate(employee.dateOfBirth)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                            <p>{employee.bloodGroup || 'Not specified'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PhoneIcon className="h-5 w-5" />
                            Contact Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                            <p>{employee.mobileNumber || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Personal Email</p>
                            <p className="break-words">{employee.personalEmail}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Company Email</p>
                            <p className="break-words">{employee.companyEmail}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BriefcaseIcon className="h-5 w-5" />
                            Professional Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Designation</p>
                            <p>{employee.designation}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Business Unit</p>
                            <p>{employee.businessUnit}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Manager</p>
                            <p>{employee.manager || 'Not assigned'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Joining Date</p>
                            <p>{formatDate(employee.dateOfJoiningFullTime)}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Address Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HomeIcon className="h-5 w-5" />
                            Address Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Permanent Address</p>
                            <p className="whitespace-pre-wrap">{employee.permanentAddress || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Correspondence Address</p>
                            <p className="whitespace-pre-wrap">{employee.correspondenceAddress || 'Not specified'}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Banking Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCardIcon className="h-5 w-5" />
                            Banking Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                            <p>{employee.bankName || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Account Holder</p>
                            <p>{employee.nameAsOnBankAccount || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                            <p>{employee.accountNumber || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
                            <p>{employee.ifscCode || 'Not specified'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmployeeDetails;
