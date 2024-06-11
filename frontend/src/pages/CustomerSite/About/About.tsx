
export const About = () => {
    return (
        <section className="py-20 text-foreground">
            <div className="container mx-auto px-4 md:px-6" >
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
    )
}
