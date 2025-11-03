import { MobileSidebar } from "./mobile-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

type HeaderProps = {
    title?: string;
}

export function Header({ title = "Dashboard" }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
                <MobileSidebar />

                <div className="flex flex-1 items-center justify-between">
                    <h1 className="text-xl font-semibold">{title}</h1>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
