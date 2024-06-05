import NavBar from "@/components/NavBar/NavBar";
import AuctionProcessSection from "../LandingPage/AuctionProcessSection";
import Footer from "@/components/footer/Footer";

export default function About() {
    return (
        <>
            <NavBar />
            <AuctionProcessSection />
            <section className="py-20 bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">About Our Auction House</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Founded in 1985, our auction house has become a renowned destination for collectors and enthusiasts
                                seeking the rarest and most valuable jewelry pieces. With a rich history and a commitment to excellence,
                                we have built a reputation for curating the finest selection of jewelry from around the world.
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                Our mission is to provide a platform for our clients to discover and acquire the most exceptional
                                jewelry pieces, while maintaining the highest standards of professionalism and integrity. We take pride
                                in our expertise, our dedication to customer service, and our unwavering commitment to the art of
                                jewelry.
                            </p>
                        </div>
                        <div>
                            <img
                                src="https://www.generalauction.com/wp-content/uploads/2023/09/online-auto-auction-3-1200-555.jpg"
                                width={600}
                                height={400}
                                alt="About Our Auction House"
                                className="rounded-lg object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.15752-9/446057549_1183542262782588_739918089689676065_n.png?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeG-ijE1yBAFmYPUH1n5Nfl3I9psmOUbTBQj2myY5RtMFPKfCiLQpVXguvzlOBBjCSFtd3EtfOUDcPz2CK9SJpLD&_nc_ohc=jZoUZjZHDNgQ7kNvgEtkFqB&_nc_ht=scontent.fsgn2-5.fna&oh=03_Q7cD1QFEAammJwzzD0Qvqp2_Lfb_xIxpIhA041ucAC67KXeMkg&oe=6686C08A"
                                    width="200"
                                    height="200"
                                    alt="Team Member"
                                    className="aspect-square overflow-hidden rounded-full object-cover"
                                />
                                <h3 className="text-lg font-bold">Vi Lee</h3>
                                <p className="text-gray-500 dark:text-gray-400">Senior Jewelry Specialist</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t1.15752-9/446018397_491818609851834_7024958988380731178_n.png?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEJZR12Jil5qTBruLLsWu-lj9JHyXulYu2P0kfJe6Vi7TE-W7XqFDZoOueFsbcNjRqRCjfVbGCNuNmBGtPIcRys&_nc_ohc=Pl3kMvfMrG8Q7kNvgEPunIW&_nc_ht=scontent.fsgn2-9.fna&oh=03_Q7cD1QEsxlcWSlD0lRdlb5dyggyHetY8T2pHvfPMhQ31UP1Tsg&oe=6686B928"
                                    width="200"
                                    height="200"
                                    alt="Team Member"
                                    className="aspect-square overflow-hidden rounded-full object-cover"
                                />
                                <h3 className="text-lg font-bold">Fox Vuck</h3>
                                <p className="text-gray-500 dark:text-gray-400">Chief Auctioneer</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.15752-9/440957517_997484047997405_1419956590655065098_n.png?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeF-Fvcoa7bsadOrvvwn-bXhGaQ4zvjBpUYZpDjO-MGlRoBHQc3kQ8sw5Fb98zQM4RbBj_cE2sZq6pOsuivbbhLZ&_nc_ohc=9TS_qdhNYlUQ7kNvgEUwMKy&_nc_ht=scontent.fsgn2-7.fna&oh=03_Q7cD1QFercgegQt8HtnY5L047kHBO7nNLWWnsafau11MrJJrnw&oe=6686A9EE"
                                    width="200"
                                    height="200"
                                    alt="Team Member"
                                    className="aspect-square overflow-hidden rounded-full object-cover"
                                />
                                <h3 className="text-lg font-bold">Khe Huyn</h3>
                                <p className="text-gray-500 dark:text-gray-400">Head of Client Relations</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src="https://scontent.fsgn2-11.fna.fbcdn.net/v/t1.15752-9/445381942_1424069858313105_1596971466450631268_n.png?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHinmPeWua7Bkf9Zj80srKoBw9nOuidpasHD2c66J2lq-ObqoJ_8uKQ3NHWwbikSE6wfynxO5tkdJpC00WB6VNf&_nc_ohc=N_0q74jhomsQ7kNvgHCNVIe&_nc_ht=scontent.fsgn2-11.fna&oh=03_Q7cD1QHHoUHUMB0S7KuQgmPfbbrQbrm-AAO0rJOzjnsQ8r5sqA&oe=6686A18F"
                                    width="200"
                                    height="200"
                                    alt="Team Member"
                                    className="aspect-square overflow-hidden rounded-full object-cover"
                                />
                                <h3 className="text-lg font-bold">Chee Ann</h3>
                                <p className="text-gray-500 dark:text-gray-400">Jewelry Appraiser</p>
                            </div>
                        </div>
                        <div className="space-y-4 h-fit my-auto">
                            <h2 className="text-3xl font-bold mb-4">Meet Our Experienced Team</h2>
                            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                                Our team of jewelry experts, appraisers, and auctioneers are the best in the industry. With decades of
                                experience and a deep passion for their craft, they are dedicated to ensuring that every item that
                                crosses the auction block receives the attention and care it deserves.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}