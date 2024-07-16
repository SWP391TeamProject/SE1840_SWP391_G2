import { useState } from 'react'
import logo from "@/assets/icon.png";
export const Contact = () => {
    const [contactMethod, setContactMethod] = useState('phone'); // Default contact method

    const handleContactChange = (event: any) => {
        setContactMethod(event.target.value);
    };

    const validateEmail = (email: any) => {
        const re = /^(([^<>()[\\.,;:\s@"]+(\.[^<>()[\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const name = event.target.name.value;
        const contactValue = event.target[contactMethod].value;

        if (contactMethod === 'email' && !validateEmail(contactValue)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Submit form data (name and contactValue)
        console.log('Submitted:', name, contactValue); // Replace with your form submission logic (e.g., sending data to backend)
    };

    return (
        <div className="contact-us flex flex-col items-center justify-center bg-gradient-to-r p-8  text-foreground">
            <h1 className="text-5xl font-bold text-center  mb-8">Biddify - Contact Us</h1>
            <div className="block sm:flex justify-center md:flex-row md:space-x-16 w-full mb-16">
                <div className="contact-info flex flex-col space-y-4 w-5/12 ">
                    <img src={logo} alt="Biddify Logo" className=" mx-auto mb-4" />
                </div>
                {/* <div className="contact-form mx-auto  sm:mx-0  w-4/12">
                        <h3 className="text-3xl font-semibold  mb-4">Have a Question?</h3>
                        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                            <div className="flex items-center space-x-2">
                                <label htmlFor="contact-method" className=' font-medium'>Contact By:</label>
                                <select id="contact-method" value={contactMethod} onChange={handleContactChange}>
                                    <option value="phone">Phone</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>
                            <label className="flex items-center space-x-2">
                                <span className=" font-medium">{contactMethod === 'phone' ? 'Phone:' : 'Email:'}</span>
                                <input
                                    type={contactMethod === 'phone' ? 'phone' : 'email'}
                                    name={contactMethod}
                                    className="rounded-md border border-gray-700 px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    required
                                />
                            </label>
                            <label className="flex items-center space-x-2">
                                <span className=" font-medium">Inquiry:</span>
                                <textarea
                                    name="message"
                                    className="rounded-md border border-gray-700 px-3 py-2 h-24  focus:outline-none focus:border-indigo-500"
                                    required
                                ></textarea>
                            </label>
                            <button type="submit" className="bg-indigo-500 hover:bg-indigo-700  font-bold py-2 px-4 rounded-md shadow-sm w-72">
                                Submit Inquiry
                            </button>
                        </form>
                    </div> */}
            </div>
            <div className=' block md:flex justify-evenly w-full'>
                <div className='md:w-2/5 mb-6'>
                    <address className="font-medium  sm:mr-8">
                        <p>
                            <span className=" font-bold">Address:</span> Lot E2a-7, Street D1 High-Tech Park, Long Thanh My Ward, City. Thu Duc, City. Ho Chi Minh
                        </p>
                        <p>
                            <span className=" font-bold">Hours:</span> Mon-Fri 10am-6pm EST
                        </p>
                    </address>
                    <ul className="list-none space-y-2  sm:mr-8">
                        <li>
                            <span className=" font-bold">Phone:</span> (+84) 123-456-789
                        </li>
                        <li>
                            <span className=" font-bold">Email:</span> info@BiddifyAuction.com
                        </li>
                    </ul>
                </div>
                <iframe className='rounded-sm border-2' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.61001089798!2d106.80501207961838!3d10.841127561752279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1719675100726!5m2!1svi!2s" width="400" height="300" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps"></iframe>
            </div>
        </div>

    )
}
