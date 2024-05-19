import React from 'react'

type CollectionCardProps = {
    src: string;
    alt: string;
    collection: string;
    title: string;
    showAllText: string;
};

const CollectionCard: React.FC<CollectionCardProps> = ({
    src,
    alt,
    collection,
    title,
    showAllText,
}) => (
    <section className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
        <article className="flex overflow-hidden relative flex-col grow items-start pt-6 pr-20 pb-3.5 pl-4 text-sm leading-5 text-white min-h-[272px] max-md:pr-5 max-md:mt-2 max-md:max-w-full">
            <img loading="lazy" src={src} alt={alt} className="object-cover absolute inset-0 size-full" />
            <div className="relative">{collection}</div>
            <header className="relative mt-3.5 text-xl font-bold leading-8">{title}</header>
            <button className="relative justify-center px-3 py-3.5 mt-40 bg-gray-300 rounded text-zinc-900 max-md:mt-10">
                {showAllText}
            </button>
        </article>
    </section>
);

type AuctionCardProps = {
    src: string;
    alt: string;
    title: string;
    startingPrice: string;
    registrationDeadline: string;
    detailsSrc1: string;
    detailsSrc2: string;
    detailsAlt1: string;
    detailsAlt2: string;
};

const AuctionCard: React.FC<AuctionCardProps> = ({
    src,
    alt,
    title,
    startingPrice,
    registrationDeadline,
    detailsSrc1,
    detailsAlt1,
    detailsSrc2,
    detailsAlt2,
}) => (
    <section className="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
        <article className="grow py-2.5 pr-6 pl-2.5 w-full bg-white rounded shadow-sm max-md:pr-5 max-md:mt-3 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <img loading="lazy" src={src} alt={alt} className="flex flex-col w-[39%] max-md:ml-0 max-md:w-full grow shrink-0 max-w-full aspect-[0.76] w-[150px] max-md:mt-6" />
                <div className="flex flex-col ml-5 w-[61%] max-md:ml-0 max-md:w-full">
                    <header className="flex flex-col max-md:mt-7">
                        <h3 className="text-xl font-bold leading-8 text-zinc-900">{title}</h3>
                        <div className="flex gap-3 mt-4">
                            <div className="flex flex-col items-center text-sm leading-5 text-orange-500 whitespace-nowrap">
                                <img loading="lazy" src={detailsSrc1} alt={detailsAlt1} className="aspect-square w-[34px]" />
                                <img loading="lazy" src={detailsSrc2} alt={detailsAlt2} className="mt-5 aspect-square w-[34px]" />
                                <button className="justify-center self-stretch px-3 py-3.5 mt-6 bg-white rounded-2xl border border-orange-500 border-solid">Details</button>
                            </div>
                            <div className="flex flex-col self-start text-base leading-6 text-zinc-400">
                                <p>Starting Price</p>
                                <p className="mt-2 text-xl font-bold text-zinc-900">{startingPrice}</p>
                                <p className="mt-4">Registration deadlines</p>
                                <p className="mt-2.5 text-xl font-bold leading-8 text-zinc-900">{registrationDeadline}</p>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
        </article>
    </section>
);

export default function Home() {
    const collectionCards = [
        {
            src: "https://cdn.builder.io/api/v1/image/assets/TEMP/f9bd4c076edc0cfac585708723479df9eb6b7a49ff7520cd9a176e11e7825fae?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            alt: "Luxury Ring",
            collection: "Collection",
            title: "Luxury Ring",
            showAllText: "Show all",
        },
        {
            src: "https://cdn.builder.io/api/v1/image/assets/TEMP/48c8e88d588593b53566a18d7b337109fe89088473fd46d37f0bb720f6227dda?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            alt: "Luxury Watch",
            collection: "Collection",
            title: "Luxury Watch",
            showAllText: "Show all",
        },
        {
            src: "https://cdn.builder.io/api/v1/image/assets/TEMP/49334a1093742ca606fee64c4bd671e402106f1bdd279d446abddc44db1a4b83?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            alt: "Luxury Necklace",
            collection: "Collection",
            title: "Luxury Necklace",
            showAllText: "Show all",
        },
    ];

    const auctionCards = [
        {
            src: "https://cdn.builder.io/api/v1/image/assets/TEMP/e647f9b54bdd430f73167011ad18cb12221013a0282d52751b445f5d041162ff?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            alt: "ROLEX continental GT image 1",
            title: "ROLEX continental GT",
            startingPrice: "$6,318",
            registrationDeadline: "02:36 AM",
            detailsSrc1: "https://cdn.builder.io/api/v1/image/assets/TEMP/abf19eebc6a357c1d3ff283c1e6ecd2674c854422ec83bdbb8961e3924bd7094?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            detailsAlt1: "Detail Image 1",
            detailsSrc2: "https://cdn.builder.io/api/v1/image/assets/TEMP/aa8c2adedd15e2b2e012b4cba46112077a8714c534cdaa3f26a548696f12acf8?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            detailsAlt2: "Detail Image 2",
        },
        {
            src: "https://cdn.builder.io/api/v1/image/assets/TEMP/e647f9b54bdd430f73167011ad18cb12221013a0282d52751b445f5d041162ff?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            alt: "ROLEX continental GT image 2",
            title: "ROLEX continental GT",
            startingPrice: "$6,318",
            registrationDeadline: "02:36 AM",
            detailsSrc1: "https://cdn.builder.io/api/v1/image/assets/TEMP/abf19eebc6a357c1d3ff283c1e6ecd2674c854422ec83bdbb8961e3924bd7094?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            detailsAlt1: "Detail Image 3",
            detailsSrc2: "https://cdn.builder.io/api/v1/image/assets/TEMP/aa8c2adedd15e2b2e012b4cba46112077a8714c534cdaa3f26a548696f12acf8?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            detailsAlt2: "Detail Image 4",
        },
        {
            src: "https://cdn.builder.io/api/v1/image/assets/TEMP/e647f9b54bdd430f73167011ad18cb12221013a0282d52751b445f5d041162ff?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            alt: "ROLEX continental GT image 3",
            title: "ROLEX continental GT",
            startingPrice: "$6,318",
            registrationDeadline: "02:36 AM",
            detailsSrc1: "https://cdn.builder.io/api/v1/image/assets/TEMP/abf19eebc6a357c1d3ff283c1e6ecd2674c854422ec83bdbb8961e3924bd7094?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            detailsAlt1: "Detail Image 5",
            detailsSrc2: "https://cdn.builder.io/api/v1/image/assets/TEMP/aa8c2adedd15e2b2e012b4cba46112077a8714c534cdaa3f26a548696f12acf8?apiKey=40cd77fa48c34fae9866559ef84b0f27&",
            detailsAlt2: "Detail Image 6",
        },
    ];

    return (
        <div className="flex flex-col pb-20 bg-white shadow-sm">

            <section className="flex flex-col pt-4 pb-1.5 pl-2 mt-20 w-full bg-white rounded shadow-sm max-md:mt-10 max-md:max-w-full">
                <div className="flex gap-5 w-full max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
                    <h2 className="flex-auto my-auto text-2xl font-bold leading-10 text-zinc-900">New this week</h2>
                    <div className="flex gap-4 text-sm leading-5 text-white whitespace-nowrap">
                        <button className="justify-center items-start px-6 py-3.5 bg-orange-500 rounded-2xl max-md:px-5">
                            &lt;
                        </button>
                        <button className="justify-center items-start px-6 py-3.5 bg-orange-500 rounded-2xl max-md:px-5">
                            &gt;
                        </button>
                    </div>
                </div>
                <div className="mt-5 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                        {collectionCards.map((card, index) => (
                            <CollectionCard key={index} {...card} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="flex flex-col pt-12 pr-20 pl-2 mt-5 w-full bg-white rounded shadow-sm max-md:pr-5 max-md:max-w-full">
                <h2 className="text-xl leading-7 text-zinc-900 max-md:mr-2 max-md:max-w-full">Starting in the next 6 hours</h2>
                <div className="mt-2.5 max-md:pr-5 max-md:mr-2 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                        {auctionCards.map((card, index) => (
                            <AuctionCard key={index} {...card} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
