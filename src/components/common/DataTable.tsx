import { type ReactNode } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type DataTableProps = {
    loading?: boolean;
    error?: string | null;
    emptyState?: ReactNode;
    children: ReactNode;
};

type DataTableHeaderProps = {
    children: ReactNode;
};

type DataTableBodyProps = {
    children: ReactNode;
};

export function DataTable({
    loading = false,
    error = null,
    emptyState,
    children,
}: DataTableProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Carregando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (emptyState) {
        return <>{emptyState}</>;
    }

    return (
        <Table>
            {children}
        </Table>
    );
}

DataTable.Header = function DataTableHeader({ children }: DataTableHeaderProps) {
    return (
        <TableHeader>
            <TableRow>
                {children}
            </TableRow>
        </TableHeader>
    );
};

DataTable.Head = TableHead;

DataTable.Body = function DataTableBody({ children }: DataTableBodyProps) {
    return (
        <TableBody>
            {children}
        </TableBody>
    );
};

DataTable.Row = TableRow;

DataTable.Cell = TableCell;
