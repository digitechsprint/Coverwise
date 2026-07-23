import '../../globals.css'; // Inherit Tailwind

export const metadata = {
  title: 'Admin Login - CoverWise',
  description: 'Sign in to CoverWise Admin',
};

export default function LoginLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
