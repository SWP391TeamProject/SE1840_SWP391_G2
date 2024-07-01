import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { Button } from './components/ui/button';

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);

    const handleError = (error) => {
        setLoading(false);
        setErrorMessage(error.message);
    }

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }

        // Create the ConfirmationToken using the details collected by the Payment Element
        const { error, confirmationToken } = await stripe.createConfirmationToken({
            elements,
            params: {
                payment_method_data: {
                    billing_details: {
                        name: 'Jenny Rosen',
                    }
                }
            }
        });

        if (error) {
            // This point is only reached if there's an immediate error when
            // creating the ConfirmationToken. Show the error to your customer (for example, payment details incomplete)
            handleError(error);
            return;
        }

        // Now that you have a ConfirmationToken, you can use it in the following steps to render a confirmation page or run additional validations on the server
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline">Register to bid</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>

                        <AlertDialogHeader>
                            <AlertDialogTitle>Register To Bid</AlertDialogTitle>
                            <AlertDialogDescription>
                                <PaymentElement />

                                {errorMessage && <div>{errorMessage}</div>}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            {loading ? <div>Loading...</div> :
                                <Button type="submit" disabled={!stripe || loading}>
                                    Submit  
                                </Button>}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </form>



        </>

    );
}