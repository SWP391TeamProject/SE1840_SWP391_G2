export const OurTeam = () => {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800 rounded-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://scontent.fhan14-5.fna.fbcdn.net/v/t1.15752-9/446057549_1183542262782588_739918089689676065_n.png?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_ohc=K6_a9YBBP6sQ7kNvgEMYIna&_nc_ht=scontent.fhan14-5.fna&oh=03_Q7cD1QExhenAys4VoN6sMuv4b2o05vbcMjZ0Sg3vBefxrAiHfA&oe=66BC254A"
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
                src="https://scontent.fhan14-3.fna.fbcdn.net/v/t1.15752-9/446018397_491818609851834_7024958988380731178_n.png?_nc_cat=103&ccb=1-7&_nc_sid=9f807c&_nc_ohc=AgusKa5S9ycQ7kNvgHK_L6e&_nc_ht=scontent.fhan14-3.fna&oh=03_Q7cD1QGH0-SCyD7rkle5gyk8dIB9k6w4KUdPMaY5W6sBAINWuQ&oe=66BC5628"
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
                src="https://scontent.fhan14-2.fna.fbcdn.net/v/t1.15752-9/440957517_997484047997405_1419956590655065098_n.png?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_ohc=Xl06Xk900DkQ7kNvgHyvku-&_nc_ht=scontent.fhan14-2.fna&oh=03_Q7cD1QHdiqDtYobNNW3NcL9vGdMhPj7Zr9a8YZewtOa-GR_7_g&oe=66BC46EE"
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
                src="https://scontent.fhan14-1.fna.fbcdn.net/v/t1.15752-9/445381942_1424069858313105_1596971466450631268_n.png?_nc_cat=105&ccb=1-7&_nc_sid=9f807c&_nc_ohc=GjA1g7IC0b8Q7kNvgEKU5_g&_nc_ht=scontent.fhan14-1.fna&oh=03_Q7cD1QH-ubtgciTV2hVFcMIeb1vSWjfoQpmv0nK9LIVmkpuqrw&oe=66BC3E8F"
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
              experience and a deep passion for their craft, they are dedicated to ensuring that every item that crosses
              the auction block receives the attention and care it deserves.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
