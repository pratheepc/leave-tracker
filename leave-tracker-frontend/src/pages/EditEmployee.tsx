import { EmployeeDetailsForm } from "@/components/employee-details-form";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/main";
import { toast } from "@/hooks/use-toast";
import { formSchema } from "@/lib/validations/employee";
import * as z from "zod";

const EditEmployee = () => {
    const { empId } = useParams();
    const [employee, setEmployee] = useState<z.infer<typeof formSchema>>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!empId) return;

            try {
                const response = await fetch(`${BASE_URL}/employees/${empId}`);
                if (!response.ok) throw new Error();
                const data = await response.json();
                setEmployee(data);
            } catch {
                toast({
                    title: "Error",
                    description: "Failed to fetch employee details",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [empId]);

    if (loading) return <div>Loading...</div>;
    if (!employee) return <div>Employee not found</div>;

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full p-6 md:w-3/5">
                <div className="flex items-center gap-2 mb-6">
                    <h1 className="text-2xl font-bold">Edit Employee</h1>
                </div>
                <EmployeeDetailsForm
                    isEditing
                    initialData={employee}
                    empId={empId}
                />
            </div>
        </div>
    );
};

export default EditEmployee; 