import { Sidebar } from "../sidebar/Sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen container mx-auto grid grid-cols-[8fr_92fr] gap-6 p-[4vh]">
        <Sidebar />
        <main>
            {children}
        </main>
    </div>
  );
}
