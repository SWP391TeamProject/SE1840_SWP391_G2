import React from 'react'

export const WhatIs = () => {
    return (
        <div className="flex flex-col px-20 pt-8 pb-20 rounded shadow-sm max-md:px-5 bg-gray-100 dark:bg-gray-800">
            <div className="text-5xl font-bold leading-[62.04px] text-zinc-900 max-md:max-w-full">
                What is Biddify?
            </div>
            <div className="mt-24 max-md:mt-8 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                    <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col text-zinc-900 max-md:mt-10">
                            <img
                                loading="lazy"
                                src="https://cdn-icons-png.flaticon.com/128/3815/3815711.png"
                                className="aspect-[1.25] w-[76px]"
                            />
                            <div className="mt-8 text-2xl leading-9 font-bold">Sophisticated Jewelry Auctions</div>
                            <div className="mt-8 text-xl leading-8 max-md:mt-10">
                                <p>Bid on exclusive jewelry pieces ranging from
                                    timeless classics to modern marvels, curated
                                    from the finest collections spanning the globe.</p>

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col text-zinc-900 max-md:mt-10">
                            <img
                                loading="lazy"
                                src="https://cdn-icons-png.flaticon.com/128/15722/15722759.png"
                                className="aspect-[1.25] w-[76px]"
                            />
                            <div className="mt-8 text-2xl leading-9 font-bold">Transparent Fees</div>
                            <div className="mt-8 text-xl leading-8 max-md:mt-10">
                                <p>With Biddify, sellers enjoy free listing services and retain the complete sale price, while buyers are subject to minimal fees transparently disclosed upfront.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-20 max-md:mt-8 max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                    
                    <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col text-zinc-900 max-md:mt-10">
                            <img
                                loading="lazy"
                                src="https://cdn-icons-png.flaticon.com/128/4233/4233834.png"
                                className="aspect-[1.25] w-[76px]"
                            />
                            <div className="mt-8 text-2xl leading-9 font-bold">Comprehensive Support</div>
                            <div className="mt-8 text-xl leading-8 max-md:mt-10">
                            <p>Every piece of jewelry on auction comes with a detailed appraisal report and is verified for authenticity, providing peace of mind with every transaction.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col text-zinc-900 max-md:mt-10">
                            <img
                                loading="lazy"
                                src="https://cdn-icons-png.flaticon.com/128/10838/10838355.png"
                                className="aspect-[1.25] w-[76px]"
                            />
                            <div className="mt-8 text-2xl leading-9 font-bold">Intuitive Platform</div>
                            <div className="mt-8 text-xl leading-8 max-md:mt-10">
                            <p>Biddify revolutionizes the way fine jewelry is auctioned online with its user-friendly interface and advanced features, making the buying and selling process a breeze for both novices and connoisseurs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
