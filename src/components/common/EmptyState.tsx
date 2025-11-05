import { type ReactNode } from 'react';

import { Button } from '@/components/Button';
import { Card } from '@/components/ui/card';

type EmptyStateProps = {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: {
        label: string;
        icon?: ReactNode;
        onClick: () => void;
    };
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <Card className="p-12">
            <div className="text-center">
                {icon && (
                    <div className="flex justify-center mb-4">
                        {icon}
                    </div>
                )}
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {title}
                </h3>
                {description && (
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {description}
                    </p>
                )}
                {action && (
                    <Button onClick={action.onClick}>
                        {action.icon}
                        {action.label}
                    </Button>
                )}
            </div>
        </Card>
    );
}
