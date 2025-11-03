import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
    Home,
    FileText,
    Truck,
    Route,
    BarChart3,
    LogOut,
    ChevronDown,
    ChevronRight,
    User,
    Car,
    Building2,
    GraduationCap,
    MapPinned,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarProps {
    className?: string;
}

interface MenuItem {
    title: string;
    icon: any;
    href?: string;
    subItems?: {
        title: string;
        icon: any;
        href: string;
    }[];
}

const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        icon: Home,
        href: "/",
    },
    {
        title: "Trajetos",
        icon: MapPinned,
        href: "/routes",
    },
    {
        title: "Solicitações",
        icon: FileText,
        href: "/requests",
    },
    {
        title: "Frota",
        icon: Truck,
        subItems: [
            {
                title: "Motoristas",
                icon: User,
                href: "/drivers",
            },
            {
                title: "Veículos",
                icon: Car,
                href: "/vehicles",
            },
        ],
    },
    {
        title: "Rotas",
        icon: Route,
        subItems: [
            {
                title: "Universidades",
                icon: Building2,
                href: "/universities",
            },
            {
                title: "Cursos",
                icon: GraduationCap,
                href: "/courses",
            },
            {
                title: "Paradas",
                icon: MapPinned,
                href: "/stops",
            },
        ],
    },
    {
        title: "Relatórios",
        icon: BarChart3,
        href: "/reports",
    },
];

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) =>
            prev.includes(title)
                ? prev.filter((item) => item !== title)
                : [...prev, title]
        );
    };

    const isMenuOpen = (title: string) => openMenus.includes(title);

    const isSubItemActive = (subItems?: { href: string }[]) => {
        if (!subItems) return false;
        return subItems.some((item) => location.pathname === item.href);
    };

    return (
        <div className={cn("flex h-full flex-col border-r bg-background", className)}>
            {/* Logo */}
            <div className="flex h-20 items-center px-6">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                    <img
                        src="/images/blue-typographic-logo.svg"
                        alt="We Move"
                        className="w-full"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                        const hasSubItems = item.subItems && item.subItems.length > 0;
                        const isOpen = isMenuOpen(item.title);
                        const isActive = item.href ? location.pathname === item.href : isSubItemActive(item.subItems);
                        const Icon = item.icon;

                        if (hasSubItems) {
                            return (
                                <div key={item.title}>
                                    <button
                                        type="button"
                                        onClick={() => toggleMenu(item.title)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="flex-1 text-left">{item.title}</span>
                                        {isOpen ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                    {isOpen && (
                                        <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-border pl-2">
                                            {item.subItems?.map((subItem) => {
                                                const isSubActive = location.pathname === subItem.href;
                                                const SubIcon = subItem.icon;

                                                return (
                                                    <Link
                                                        key={subItem.href}
                                                        to={subItem.href}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                            isSubActive
                                                                ? "bg-primary text-primary-foreground"
                                                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                        )}
                                                    >
                                                        <SubIcon className="h-4 w-4" />
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                to={item.href!}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* User Profile */}
            <div className="border-t p-4">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">Administrador</span>
                        <span className="text-xs text-muted-foreground">admin@wemove.com</span>
                    </div>
                </div>
                <Separator className="my-3" />
                <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
}
