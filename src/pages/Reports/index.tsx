import { useState } from "react";
import { AdminLayout } from "@/components/layout";
import { PageHeader } from "@/components/common";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/Button";
import { Calendar, Download, BarChart3, Users, TrendingUp } from "lucide-react";

// Mock data
const mockRoutes = [
    { id: 1, name: "Rota 01 - Centro/Campus Principal" },
    { id: 2, name: "Rota 02 - Zona Norte/Campus Tecnológico" },
    { id: 3, name: "Rota 03 - Zona Sul/Campus Saúde" },
    { id: 4, name: "Rota 04 - Zona Leste/Campus Exatas" },
];

const mockInstitutions = [
    { id: 1, name: "Universidade Federal", students: 1234 },
    { id: 2, name: "Instituto Tecnológico", students: 856 },
    { id: 3, name: "Faculdade de Medicina", students: 645 },
    { id: 4, name: "Universidade Estadual", students: 523 },
    { id: 5, name: "Centro Universitário", students: 412 },
];

const mockBoardingsByRoute = [
    { date: "01/11", embarques: 45 },
    { date: "02/11", embarques: 48 },
    { date: "03/11", embarques: 42 },
    { date: "04/11", embarques: 50 },
    { date: "05/11", embarques: 47 },
    { date: "08/11", embarques: 46 },
    { date: "09/11", embarques: 49 },
    { date: "10/11", embarques: 51 },
    { date: "11/11", embarques: 44 },
    { date: "12/11", embarques: 48 },
];

const mockAttendanceByRoute = [
    { date: "01/11", presentes: 45, ausentes: 5 },
    { date: "02/11", presentes: 46, ausentes: 4 },
    { date: "03/11", presentes: 42, ausentes: 8 },
    { date: "04/11", presentes: 48, ausentes: 2 },
    { date: "05/11", presentes: 47, ausentes: 3 },
    { date: "08/11", presentes: 44, ausentes: 6 },
    { date: "09/11", presentes: 49, ausentes: 1 },
    { date: "10/11", presentes: 50, ausentes: 0 },
    { date: "11/11", presentes: 43, ausentes: 7 },
    { date: "12/11", presentes: 48, ausentes: 2 },
];

export default function Reports() {
    const [selectedRoute, setSelectedRoute] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("last-30-days");
    const [selectedRouteFrequency, setSelectedRouteFrequency] = useState("");
    const [selectedPeriodFrequency, setSelectedPeriodFrequency] = useState("last-30-days");

    const maxBoardings = Math.max(...mockBoardingsByRoute.map(d => d.embarques));
    const maxAttendance = Math.max(...mockAttendanceByRoute.map(d => d.presentes + d.ausentes));
    const maxInstitutionStudents = Math.max(...mockInstitutions.map(i => i.students));

    return (
        <AdminLayout>
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Relatórios"
                    description="Visualize estatísticas e dados do sistema"
                    icon={BarChart3}
                />

                {/* Embarques por Rota */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Embarques por Rota
                        </CardTitle>
                        <CardDescription>
                            Visualize a quantidade de embarques realizados em uma rota específica
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="route-boarding" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rota</label>
                                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                                    <SelectTrigger id="route-boarding">
                                        <SelectValue placeholder="Selecione uma rota" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockRoutes.map((route) => (
                                            <SelectItem key={route.id} value={route.id.toString()}>
                                                {route.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="period-boarding" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Período</label>
                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                    <SelectTrigger id="period-boarding">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
                                        <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
                                        <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                                        <SelectItem value="custom">Personalizado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {selectedRoute && (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Total de embarques no período
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {mockBoardingsByRoute.reduce((acc, curr) => acc + curr.embarques, 0)}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Exportar
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>Embarques diários</span>
                                        <span>0 - {maxBoardings}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {mockBoardingsByRoute.map((day) => (
                                            <div key={day.date} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium">{day.date}</span>
                                                    <span className="text-muted-foreground">{day.embarques} embarques</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${(day.embarques / maxBoardings) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {!selectedRoute && (
                            <div className="flex items-center justify-center py-12 text-muted-foreground">
                                <div className="text-center space-y-2">
                                    <Calendar className="h-12 w-12 mx-auto opacity-50" />
                                    <p>Selecione uma rota e período para visualizar os dados</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Alunos por Universidade */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Quantidade de Alunos por Universidade
                        </CardTitle>
                        <CardDescription>
                            Distribuição de estudantes cadastrados por instituição de ensino
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Total de estudantes cadastrados
                                </p>
                                <p className="text-3xl font-bold">
                                    {mockInstitutions.reduce((acc, curr) => acc + curr.students, 0)}
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {mockInstitutions.map((institution, index) => {
                                const percentage = (institution.students / mockInstitutions.reduce((acc, curr) => acc + curr.students, 0)) * 100;
                                return (
                                    <div key={institution.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full bg-primary`}
                                                    style={{
                                                        opacity: 1 - (index * 0.15)
                                                    }}
                                                />
                                                <span className="font-medium">{institution.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold">{institution.students}</span>
                                                <span className="text-sm text-muted-foreground ml-2">
                                                    ({percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{
                                                    width: `${(institution.students / maxInstitutionStudents) * 100}%`,
                                                    opacity: 1 - (index * 0.15)
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Frequência de Alunos por Rota */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Frequência de Alunos por Rota
                        </CardTitle>
                        <CardDescription>
                            Acompanhe a presença e ausência dos estudantes nas rotas
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="route-frequency" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rota</label>
                                <Select value={selectedRouteFrequency} onValueChange={setSelectedRouteFrequency}>
                                    <SelectTrigger id="route-frequency">
                                        <SelectValue placeholder="Selecione uma rota" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockRoutes.map((route) => (
                                            <SelectItem key={route.id} value={route.id.toString()}>
                                                {route.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="period-frequency" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Período</label>
                                <Select value={selectedPeriodFrequency} onValueChange={setSelectedPeriodFrequency}>
                                    <SelectTrigger id="period-frequency">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
                                        <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
                                        <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                                        <SelectItem value="custom">Personalizado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {selectedRouteFrequency && (
                            <>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Total de Presenças
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {mockAttendanceByRoute.reduce((acc, curr) => acc + curr.presentes, 0)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Total de Ausências
                                        </p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {mockAttendanceByRoute.reduce((acc, curr) => acc + curr.ausentes, 0)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Taxa de Presença
                                        </p>
                                        <p className="text-2xl font-bold">
                                            {(
                                                (mockAttendanceByRoute.reduce((acc, curr) => acc + curr.presentes, 0) /
                                                    (mockAttendanceByRoute.reduce((acc, curr) => acc + curr.presentes, 0) +
                                                        mockAttendanceByRoute.reduce((acc, curr) => acc + curr.ausentes, 0))) *
                                                100
                                            ).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>

                                <Button variant="outline" size="sm" className="w-full md:w-auto">
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar Relatório
                                </Button>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Legenda:</span>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-sm bg-green-500" />
                                                <span className="text-muted-foreground">Presentes</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-sm bg-red-500" />
                                                <span className="text-muted-foreground">Ausentes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {mockAttendanceByRoute.map((day) => {
                                        const total = day.presentes + day.ausentes;
                                        const presentPercentage = (day.presentes / total) * 100;
                                        const absentPercentage = (day.ausentes / total) * 100;

                                        return (
                                            <div key={day.date} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium">{day.date}</span>
                                                    <span className="text-muted-foreground">
                                                        {day.presentes} presentes / {day.ausentes} ausentes
                                                    </span>
                                                </div>
                                                <div className="flex h-8 rounded-lg overflow-hidden border">
                                                    <div
                                                        className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                                                        style={{ width: `${presentPercentage}%` }}
                                                    >
                                                        {presentPercentage.toFixed(0)}%
                                                    </div>
                                                    <div
                                                        className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                                                        style={{ width: `${absentPercentage}%` }}
                                                    >
                                                        {absentPercentage > 10 && `${absentPercentage.toFixed(0)}%`}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {!selectedRouteFrequency && (
                            <div className="flex items-center justify-center py-12 text-muted-foreground">
                                <div className="text-center space-y-2">
                                    <Calendar className="h-12 w-12 mx-auto opacity-50" />
                                    <p>Selecione uma rota e período para visualizar a frequência</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
