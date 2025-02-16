import { EmployeeDetailsForm } from "@/components/employee-details-form";

const CreateEmployee = () => {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full p-6 md:w-3/5">
                <div className="flex items-center gap-2 mb-6">
                    <h1 className="text-2xl font-bold">Create New Employee</h1>
                </div>
                <EmployeeDetailsForm />
            </div>
        </div>
    );
};

export default CreateEmployee;