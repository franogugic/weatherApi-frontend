import { Sidebar } from "../sidebar/Sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-[4vh] lg:py-[4vh]">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1800px] grid-cols-1 gap-4 xl:min-h-[calc(100vh-8vh)] xl:grid-cols-[96px_minmax(0,1fr)] xl:gap-6">
        <Sidebar />
        <main className="min-h-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
