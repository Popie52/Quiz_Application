export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);
export const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>
);
export const CardTitle = ({ children, className = "" }) => (
  <h2
    className={`text-2xl font-bold tracking-tight text-gray-900 ${className}`}
  >
    {children}
  </h2>
);
export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
);
export const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
export const CardFooter = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export const Label = ({ children, htmlFor, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);
export const Input = (props) => (
  <input
    {...props}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className}`}
  />
);
export const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-900/90 h-10 px-4 py-2 w-full ${className}`}
  >
    {children}
  </button>
);
