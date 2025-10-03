// 404 Not Found Component
const NotFound = () => (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-[#004080] mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <a
        href="/"
        className="px-6 py-3 bg-[#004080] text-white rounded hover:bg-[#00264d] transition-all"
      >
        Go Back Home
      </a>
    </div>
  );


  export default NotFound;