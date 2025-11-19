import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

type SidebarProps = {
    className?: string;
}

type MenuItem = {
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
        title: "Solicitações",
        icon: FileText,
        href: "/requests",
    },
    {
        title: "Rotas",
        icon: Route,
        subItems: [
            {
                title: "Veículos",
                icon: Car,
                href: "/vehicles",
            },
            {
                title: "Rotas",
                icon: MapPinned,
                href: "/routes",
            },
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
        ],
    },
    {
        title: "Usuários",
        icon: User,
        href: "/users",
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
    const { user, logout } = useAuth();

    // Abre automaticamente o menu que contém a rota atual
    useEffect(() => {
        const menusToOpen: string[] = [];

        menuItems.forEach((item) => {
            if (item.subItems) {
                const hasActiveSubItem = item.subItems.some(
                    (subItem) => location.pathname === subItem.href
                );
                if (hasActiveSubItem) {
                    menusToOpen.push(item.title);
                }
            }
        });

        if (menusToOpen.length > 0) {
            setOpenMenus((prev) => {
                const newMenus = [...new Set([...prev, ...menusToOpen])];
                return newMenus;
            });
        }
    }, [location.pathname]);

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

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
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
                        <AvatarFallback>
                            {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">{user?.name || 'Administrador'}</span>
                        <span className="text-xs text-muted-foreground">{user?.email || 'admin@wemove.com'}</span>
                    </div>
                </div>
                <Separator className="my-3" />
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
}
