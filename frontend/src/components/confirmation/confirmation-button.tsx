"use client"

import * as React from "react"
import { type Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ConfirmationDialog } from "./confirmation-dialog"


interface ConfirmationButtonProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  onSuccess?: () => void
  message: string
  title: string
  label: string
  description: string
  className?: string
  variant?: string
}

export function ConfirmationButton({
  message,
  title,
  label,
  onSuccess,
  className,
  description,
  variant,
  ...props
}: ConfirmationButtonProps) {
  const [open, setOpen] = React.useState(false);
  const onConfirm = () => {
    onSuccess();
    setOpen(false)
  }

  return (
    <>
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        message={message}
        label={label}
        onSuccess={onConfirm}
        description={description}
      />
      {/* <Dialog {...props} >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                  {message}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:space-x-0">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  // aria-label="Delete selected rows"
                  // variant="destructive"
                  onClick={() => onSuccess()}
                >
                  {label}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
      <Button type="button" variant={variant} className={className} onClick={() => { setOpen(true) }}>
        {props.children}
      </Button>
    </>

  )
}
