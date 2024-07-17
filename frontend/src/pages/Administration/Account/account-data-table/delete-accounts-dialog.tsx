"use client"

import * as React from "react"
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons"
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
import { AccountStatus } from "@/constants/enums"
import { activateAccountService, deleteAccountService } from "@/services/AccountsServices"
import { toast } from "react-toastify"

interface DeleteTasksDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  items: Row<any>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteAccountsDialog({
    items,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteTasksDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Suspend ({items.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will suspend your{" "}
            <span className="font-medium">{items.length}</span>
            {items.length === 1 ? " account" : " accounts"} on our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant={items[0].status == AccountStatus.ACTIVE ? "destructive" : "default"}
            onClick={() => {
              startDeleteTransition(() => {
                if(items.length == 1){
                  if(items[0].status == AccountStatus.ACTIVE){
                    try {
                        deleteAccountService(items[0].accountId).then((res) => {
                          if(res)
                            toast.success("Account suspended")
                          else if(res.error)
                            toast.error(res.error)
                          return
                        })
                    } catch (error) {
                      toast.error(error)
                      return
                    }                  
                  } 
                  else if(items[0].status == AccountStatus.DISABLED){
                    try {
                       activateAccountService(items[0].accountId).then((res) => {
                          if(res)
                            toast.success("Account activated")
                          else if(res.error)
                            toast.error(res.error)
                          return
                        })
                    } catch (error) {
                      toast.error(error)
                      return
                    }                  
                  } else if (items[0].status == AccountStatus.DISABLED){
  
                  }
              }
              props.onOpenChange?.(false)
              onSuccess?.()})
            }}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {items[0].status == AccountStatus.ACTIVE ? "Suspend" : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
