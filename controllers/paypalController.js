const paypal = require('paypal-rest-sdk');

try {

    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': '####yourclientid######',
        'client_secret': '####yourclientsecret#####'
    });
}
catch (err) {
    console.log("😭 something wrong!!!")
}

class PaypalController {

    pay = async (req, res) => {

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:9660/paypal/success",
                "cancel_url": "http://localhost:9660/paypal/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Red Sox Hat",
                        "sku": "001",
                        "price": "25.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                },
                "description": "Hat for the best team ever"
            }]
        }


        try {
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });
        }
        catch (err) {
            console.log("ERROR", err)
        }
    }

    success = async (req, res) => {

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "25.00"
                }
            }]
        };
        // paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        //     if (error) {
        //         console.log(error.response);
        //         throw error;
        //     } else {
        //         console.log(JSON.stringify(payment));
        //         res.send('Success');
        //     }
        // });
    }


    cancel = async (req, res) => res.send('Cancelled')

}

const paypalController = new PaypalController();
module.exports = paypalController;

  // app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));


