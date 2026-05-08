import { Sidebar } from "../sidebar/Sidebar";
import { useLocation } from "react-router-dom";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useLocation()
  const shouldShowSidebar = !["/", "/login", "/register"].includes(pathname)

  return (
    <div className="h-screen w-full overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-[4vh] lg:py-[4vh]">
      <div className={`mx-auto grid h-[calc(100vh-2rem)] max-w-[1800px] grid-cols-1 gap-4 overflow-hidden lg:h-[calc(100vh-8vh)] lg:gap-6 ${
        shouldShowSidebar ? "lg:grid-cols-[96px_minmax(0,1fr)]" : ""
      }`}>
        {shouldShowSidebar ? <Sidebar /> : null}
        <main className="h-full min-h-0 min-w-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
