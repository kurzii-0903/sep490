const PageNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center text-white">
            <img src="https://placehold.co/400x300?text=404+Image" alt="Illustration of a 404 error with a broken link icon" className="mb-8 shadow-lg rounded-lg"/>
            <h1 className="text-8xl font-extrabold mb-4">404</h1>
            <p className="text-2xl mb-8">Oops! The page you're looking for doesn't exist.</p>
            <a href="/" className="text-lg bg-white text-blue-500 px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">
                <i className="fas fa-arrow-left mr-2"></i>Go back to Home
            </a>
        </div>
    );
};
export default PageNotFound;