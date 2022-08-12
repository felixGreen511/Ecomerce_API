import StripeCheckout from 'react-stripe-checkout';
import {useState, useEffect} from 'react';
import axios from 'axios';
const KEY = 'pk_test_51LDE2tAUnnDHkSVvBKFErsLT72Z5BLkFH5kLqCt3LslnefwybnWM45XtEixahJrEbfkJ7DQBS8TDrbuqWQQMSY4200KSCDdArF'

const Pay = () => {
    const [stripeToken, setStripeToken] = useState(null);
    const history = useHistory();
    const onToken = (token) => {
        setStripeToken(token)
    };
    useEffect(() =>{
        const makeRequest = async () => {
            try {
                const res = await axios.post('https://localhost:5000/api/checkpout/payment', {
                    tokenId: stripeToken.id,
                    amount: 2000,
                });
                console.log(res.data);
                history.push("/success");
            } catch (err) {
                console.log(err);
            }
        };
        stripeToken && makeRequest();
    }, [stripeToken, history]);
    return (
        <div
            style={{ 
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

             }}
            >
        {stripeToken ? (<span> Please wait!, Your Request is Processing....</span>) : (
            <StripeCheckout 
                name="Online Shop"
                image="" 
                billingAddress
                shippingAddress
                description="You total is $200"
                amount={2000}
                token={onToken}
                stripeKey={KEY}
                >
            <button style={{ 
                border: "none",
                width: 120,
                borderRadius: 5,
                padding: "20px",
                backgroundColor: "black",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
             }}>
                Pay Now
            </button>
        </StripeCheckout>
        )}
        </div>
    );
};

export default Pay
