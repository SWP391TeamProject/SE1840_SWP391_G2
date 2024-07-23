import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AuctionItem } from '@/models/auctionItem';
import { Table } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Confetti from 'react-confetti-boom';
import { motion } from 'framer-motion';
import { useCurrency } from '@/CurrencyProvider';

interface ResultDialogProps extends React.ComponentProps<typeof Dialog> {
  message: string;
  items?: AuctionItem[];
  title: string;
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function ResultDialog({ message, items, title, ...props }: ResultDialogProps) {
  const nav = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealedItems, setRevealedItems] = useState<number[]>([]);
  const [totalRevealed, setTotalRevealed] = useState(false);
  const currency = useCurrency();

  const revealItem = (index: number) => {
    setRevealedItems([...revealedItems, index]);
    if (revealedItems.length + 1 === items?.length) {
      setTotalRevealed(true);
    }
  };

  return (
    <>
      <Dialog {...props}>
        {/* <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader> */}
        <DialogContent className="w-full">
          <div className="w-full border">
            {items?.map((item, index) => (
              <motion.div
                className="grid grid-cols-3 w-full border"
                key={item.id.itemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: revealedItems.includes(index) ? 1 : 0, y: revealedItems.includes(index) ? 0 : 20 }}
                transition={{ duration: 0.5 }}
              >
                <p className="col-span-2">{item.itemDTO?.name}</p>
                <p className="col-span-1 text-center">{currency.format(item.currentPrice)}</p>
                <Separator className="col-span-1" />
              </motion.div>
            ))}
            <motion.div
              className="grid grid-cols-3 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: totalRevealed ? 1 : 0, y: totalRevealed ? 0 : 20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="col-span-2">Total</p>
              <p className="col-span-1 text-center">
                {currency.format(items?.reduce((a, b) => a + b.currentPrice, 0))}
              </p>
            </motion.div>
          </div>
          {!totalRevealed && <Button onClick={() => revealItem(revealedItems.length)}>Reveal Next Item</Button>}
          {totalRevealed && (
            <Button
              onClick={() => {
                nav('/dashboard/orders');
              }}
            >
              View Orders
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
