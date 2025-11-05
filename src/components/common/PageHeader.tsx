import { type ReactNode } from 'react';

import { Button } from '@/components/Button';

type PageHeaderProps = {
    title: string;
    description?: string;
    action?: {
        label: string;
        icon?: ReactNode;
        onClick: () => void;
    };
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">
                    {title}
                </h1>
                {description && (
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="flex items-center gap-2"
                >
                    {action.icon}
                    {action.label}
                </Button>
            )}
        </div>
    );
}
