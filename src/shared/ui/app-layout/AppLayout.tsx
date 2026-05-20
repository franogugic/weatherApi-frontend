import { Sidebar } from "../sidebar/Sidebar";
import { useLocation } from "react-router-dom";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation()
  const shouldShowSidebar = !["/", "/login", "/register"].includes(pathname)

  return (
    <div className="min-h-screen w-full overflow-x-hidden px-3 py-3 sm:px-5 sm:py-5 lg:h-screen lg:overflow-hidden lg:px-[4vh] lg:py-[4vh]">
      <div className={`mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1800px] grid-cols-1 gap-4 lg:h-[calc(100vh-8vh)] lg:min-h-0 lg:gap-6 lg:overflow-hidden ${
        shouldShowSidebar ? "lg:grid-cols-[96px_minmax(0,1fr)]" : ""
      }`}>
        {shouldShowSidebar ? <Sidebar /> : null}
        <main className="min-h-0 min-w-0 lg:h-full lg:overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
