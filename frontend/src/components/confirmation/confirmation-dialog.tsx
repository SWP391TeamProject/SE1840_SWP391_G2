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


interface ConfirmationDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  showTrigger?: boolean
  onSuccess: () => void
  message: string
  title: string
  label: string
  description: string
}

export function ConfirmationDialog({
  description,
  showTrigger = true,
  message,
  title,
  label,
  onSuccess,
  ...props
}: ConfirmationDialogProps) {
  // const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog {...props} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="w grid gap-4 py-4">
              {message}
          </div>
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
      </Dialog>
      {/* // : <Button onClick={() => {setOpen(true)}}>
          //   {label}
          // </Button> */}
    </>

  )
}
