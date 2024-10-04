import SidebarCMS from "@/components/Sidebar";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        <div className="flex h-screen bg-gray-100 dark:bg-neutral-800">
          <SidebarCMS />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
