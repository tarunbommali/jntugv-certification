// 404 Not Found Component
const NotFound = () => (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Page not found.</p>
      <a
        href="/"
        className="px-6 py-3 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primaryDark)] transition-all"
      >
        Go Back Home
      </a>
    </div>
  );


  export default NotFound;