import { OperatorSidebar } from "@/components/operator-sidebar";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <OperatorSidebar />

      {/* Main Content Area - Needs margin to account for fixed sidebar */}
      {/* Sidebar is w-64 (16rem) when expanded, w-16 (4rem) when collapsed. */}
      {/* We can add a margin-left that matches the sidebar width, 
          but since sidebar is collapsible, it's better to let the main content 
          be flexible and maybe controlled by a context or just has a sufficient 
          margin. Or use the same layout pattern as Officer. */}
      
      <main className="flex-1 ml-16 md:ml-64 transition-all duration-300 p-8">
        {children}
      </main>
    </div>
  );
}
