import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BuyerFaqs from "./BuyerFaqs";
import SellerFaqs from "./SellerFaqs";
export default function Faq() {
    return (<section className="p-5 py-20 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <h1 className="text-4xl font-bold text-center mb-10">FAQs</h1>
        <BuyerFaqs />
        <SellerFaqs />

    </section>
    )
}
