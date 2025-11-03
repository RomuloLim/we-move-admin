import { Button } from "@/components/Button";
import { AdminLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Calendar, TrendingUp, Eye, Trash, Clock } from "lucide-react";

export default function Home() {
    const stats = [
        {
            title: "Total de Estudantes",
            value: "1,234",
            // change: "+12.5%",
            icon: Users,
            description: "Estudantes com requisição ativa"
        },
        {
            title: "Requisições Pendentes",
            value: "122",
            // change: "+12.5%",
            icon: Clock,
            description: "Estudantes com requisição pendente"
        },
        {
            title: "Rotas Ativas",
            value: "89/100",
            icon: MapPin,
            description: "em operação atualmente"
        },
        {
            title: "Média de Ocupação Hoje",
            value: "87%",
            change: "8.1%",
            icon: Calendar,
            description: "desde ontem"
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h2>
                    <p className="text-muted-foreground">
                        Aqui está o seu resumo de hoje
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-success-600 font-medium">{stat.change}</span> {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-7">
                        <CardHeader>
                            <CardTitle>Avisos ativos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">Manutenção Programada <span className="text-xs text-muted-foreground">(40 Visualizações)</span></p>
                                        <p className="text-xs text-muted-foreground">O sistema estará indisponível para manutenção em 25/12/2024, das 02:00 às 04:00.</p>
                                    </div>

                                    <Button size="icon-sm" variant="destructive">
                                        <Trash />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">Atualização de Política de Privacidade <span className="text-xs text-muted-foreground">(40 Visualizações)</span></p>
                                        <p className="text-xs text-muted-foreground">Nossa política de privacidade foi atualizada. Por favor, revise as mudanças até 31/12/2024.</p>
                                    </div>

                                    <Button size="icon-sm" variant="destructive">
                                        <Trash />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Solicitações Recentes</CardTitle>
                            <CardDescription>
                                Últimas solicitações realizadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">Rômulo Lima Fonseca</p>
                                        <p className="text-xs text-muted-foreground">Ciência da Computação - UFC (há 5 min)</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        <Button size="icon-sm" variant="primary">
                                            <Eye />
                                        </Button>
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">Rômulo Lima Fonseca</p>
                                        <p className="text-xs text-muted-foreground">Ciência da Computação - UFC (há 5 min)</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        <Button size="icon-sm" variant="primary">
                                            <Eye />
                                        </Button>
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">Rômulo Lima Fonseca</p>
                                        <p className="text-xs text-muted-foreground">Ciência da Computação - UFC (há 5 min)</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        <Button size="icon-sm" variant="primary">
                                            <Eye />
                                        </Button>
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">Rômulo Lima Fonseca</p>
                                        <p className="text-xs text-muted-foreground">Ciência da Computação - UFC (há 5 min)</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        <Button size="icon-sm" variant="primary">
                                            <Eye />
                                        </Button>
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Rotas Populares</CardTitle>
                            <CardDescription>
                                Rotas ativas com maior taxa de ocupação
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                                            1
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Campus → Centro</p>
                                            <p className="text-xs text-muted-foreground">15 alunos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">45%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                                            2
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Centro → Campus</p>
                                            <p className="text-xs text-muted-foreground">12 alunos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">30%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                                            3
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Bairro Sul → Campus</p>
                                            <p className="text-xs text-muted-foreground">8 alunos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">25%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
