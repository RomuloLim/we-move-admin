import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Card } from '@/components/ui/card';

type TablePaginationProps = {
    pagination: PaginationMeta;
    onPageChange: (page: number) => void;
};

export function TablePagination({ pagination, onPageChange }: TablePaginationProps) {
    function getPageNumbers() {
        const { current_page, last_page } = pagination;
        const pages: (number | string)[] = [];

        pages.push(1);

        const startPage = Math.max(2, current_page - 1);
        const endPage = Math.min(last_page - 1, current_page + 1);

        if (startPage > 2) {
            pages.push('ellipsis-start');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < last_page - 1) {
            pages.push('ellipsis-end');
        }

        if (last_page > 1) {
            pages.push(last_page);
        }

        return pages;
    }

    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Pagination>
                    <PaginationContent>
                        {/* Previous Button */}
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (pagination.current_page > 1) {
                                        onPageChange(pagination.current_page - 1);
                                    }
                                }}
                                className={
                                    pagination.current_page === 1
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) => (
                            <PaginationItem key={`${page}-${index}`}>
                                {typeof page === 'number' ? (
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(page);
                                        }}
                                        isActive={pagination.current_page === page}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                ) : (
                                    <PaginationEllipsis />
                                )}
                            </PaginationItem>
                        ))}

                        {/* Next Button */}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (pagination.current_page < pagination.last_page) {
                                        onPageChange(pagination.current_page + 1);
                                    }
                                }}
                                className={
                                    pagination.current_page === pagination.last_page
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </Card>
    );
}
