import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ToBeImplemented = () => {
    const loc = useLocation();
    const nav = useNavigate();
    const goBack = () => {
        nav(loc.state?.from || '/');

    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <Card className="p-8 max-w-md w-full text-foreground">
                <h1 className="text-2xl font-bold  mb-4 ">Feature Under Construction</h1>
                <p className=" mb-6">
                    This feature is currently under construction. Please check back later.
                </p>
                <Button
                    onClick={goBack}
                    variant="default"
                >
                    Go Back
                </Button>
            </Card>
        </div>
    );
};

export default ToBeImplemented;
