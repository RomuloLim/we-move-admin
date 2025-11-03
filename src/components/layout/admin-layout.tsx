import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:w-64 md:flex-col">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header title={title} />

                <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
