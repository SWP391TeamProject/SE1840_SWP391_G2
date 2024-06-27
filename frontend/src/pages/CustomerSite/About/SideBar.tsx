

export const Sidebar = ({ about, ourTeam, buy, sell, faq }: { about: number, ourTeam: number, buy: number, sell: number, faq: number }) => {
    return (
        <aside className="w-28 top-16 h-96 sm:w-40 md:w-56 sticky mt-4" aria-label="Sidebar">
            <div className="overflow-y-auto  w-28 md:w-56 sm:w-40 py-4 px-3 bg-gray-50 rounded-xl dark:bg-gray-800 h-96 ">
                <ul className="space-y-4 h-5/6 px-4">
                    <li>
                        <button onClick={() => scrollTo({ top: 0, behavior: "smooth" })} className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">What is Biddify?</button>
                    </li>
                    <li>
                        <button onClick={() => scrollTo({ top: about - 50, behavior: "smooth" })} className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">About Us</button>
                    </li>
                    <li>
                        <button onClick={() => scrollTo({ top: ourTeam - 50, behavior: "smooth" })} className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">Our Team</button>
                    </li>
                    <li>
                        <button onClick={() => scrollTo({ top: buy - 180, behavior: "smooth" })} className="text-lg font-semibold text-gray-700 dark:text-gray-100 ">How It Works?</button>
                    </li>
                    <li>
                        <button onClick={() => scrollTo({ top: buy - 50, behavior: "smooth" })} className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            Buying a Jewelry
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollTo({ top: sell - 50, behavior: "smooth" })} className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            Selling a Jewelry
                        </button>
                    </li>
                    <li>
                        <button onClick={() => scrollTo({ top: faq - 50, behavior: "smooth" })} className="text-lg font-semibold text-gray-700 dark:text-gray-100 ">
                            FAQs
                        </button>
                    </li>
                </ul>

            </div>
        </aside>
    );
}

