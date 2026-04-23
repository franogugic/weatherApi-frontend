import { Sidebar } from "../sidebar/Sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-screen container mx-auto grid grid-cols-[8fr_92fr] gap-6 overflow-hidden p-[4vh]">
        <Sidebar />
        <main className="min-h-0">
            {children}
        </main>
    </div>
  );
}
