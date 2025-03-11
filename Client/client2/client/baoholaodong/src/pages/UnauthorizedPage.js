const UnauthorizedPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
            <img src="https://placehold.co/400x300?text=Unauthorized+Access" alt="Illustration of a lock symbolizing unauthorized access" className="mb-8 shadow-lg rounded-lg"/>
            <h1 className="text-6xl font-bold text-gray-800 mb-4">401</h1>
            <p className="text-2xl text-gray-600 mb-8">Unauthorized Access</p>
            <a href="/" className="text-lg bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
                <i className="fas fa-arrow-left mr-2"></i>Go back to Home
            </a>
        </div>
    );
};
export default UnauthorizedPage;