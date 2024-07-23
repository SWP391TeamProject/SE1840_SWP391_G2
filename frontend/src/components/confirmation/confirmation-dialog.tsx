'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  // AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmationAlertDialogProps extends React.ComponentPropsWithoutRef<typeof AlertDialog> {
  showTrigger?: boolean;
  onSuccess: () => void;
  message: string;
  title: string;
  label: string;
  description: string;
}

export function ConfirmationDialog({
  description,
  showTrigger = true,
  message,
  title,
  label,
  onSuccess,
  ...props
}: ConfirmationAlertDialogProps) {
  // const [open, setOpen] = React.useState(false);

  return (
    <>
      <AlertDialog {...props}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground">{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <div
            className="w grid gap-4 py-4"
            dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br/>') }}
          ></div>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <Button
              // aria-label="Delete selected rows"
              // variant="destructive"
              className="text-white"
              onClick={() => onSuccess()}
            >
              {label}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* // : <Button onClick={() => {setOpen(true)}}>
          //   {label}
          // </Button> */}
    </>
  );
}
