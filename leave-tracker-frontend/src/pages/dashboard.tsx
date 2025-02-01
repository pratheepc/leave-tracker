const WorkInProgress = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] p-4">
            <div className="text-center space-y-6">
                {/* You can replace this with any icon from your preferred icon library */}
                <div className="text-9xl mb-4">🚧</div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Work in Progress
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    We're currently building something awesome here.
                    Check back soon to see what's new!
                </p>
            </div>
        </div>
    );
};

export default WorkInProgress;