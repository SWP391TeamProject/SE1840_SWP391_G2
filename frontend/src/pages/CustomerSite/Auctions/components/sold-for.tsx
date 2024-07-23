import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BadgeDollarSign, StarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Item } from '@/models/Item';
import { AuctionItem } from '@/models/auctionItem';
import { formatDate } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);
interface propsType {
  item: AuctionItem;
  currency: any;
}
function SoldFor({ item, currency }: propsType) {
  const elementRef = useRef();
  const nav = useNavigate();

  const isSold = useCallback(() => {
    if (item?.itemDTO?.status === 'SOLD') {
      return true;
    }
    return false;
  }, [item]);

  useGSAP(() => {
    gsap.fromTo(
      elementRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top bottom 10%',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <Card ref={elementRef} className="bg-white shadow-md border border-gray-200">
      <CardHeader className="flex items-center space-x-2 p-4">
        <Button onClick={() => [nav(`/item/${item.id.itemId}`)]}>view detail</Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="m-auto">
          <span className=" text-sm font-semibold text-gray-600">Sold for: </span>
          {isSold ?
            <span className=" text-xl font-bold text-gray-900">{currency.format(item?.currentPrice)}</span>
            :
            <span className=" text-xl font-bold text-gray-900">Not Sold</span>
          }
        </div>
      </CardContent>
      <CardFooter className="flex justify-end p-4">
        <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 border border-gray-300">
          {formatDate(item.itemDTO.createDate)}
        </span>
      </CardFooter>
    </Card>
  );
}

export default SoldFor;
