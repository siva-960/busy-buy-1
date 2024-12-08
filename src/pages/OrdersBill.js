import { useEffect, useState } from "react"
import { useAuthContext, usePageLoadContext } from "../context/AuthnticationContext";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase.configuration";
import { useBillContext } from "../context/BillContext";

export const OrdersBill = () =>{

    const {userDetails} = useAuthContext();
    const pageLoad = usePageLoadContext();
    const {setBilledItems,billedItems} = useBillContext();
    const [isEmpty,setIsEmpty] = useState(false);
    useEffect(()=>{

        const fetchBilledItems = async () =>{
            pageLoad.setPageLoad(true);
            console.log("billing items are");
            const billRef = collection(db,`userAuthentication/${userDetails.email}/billing`);
            const billSnapShot = await getDocs(billRef);
            if(billSnapShot.empty){
                console.log("No items to bill");
                pageLoad.setPageLoad(false);
                setIsEmpty(true);
                return;
            }else{
                // console.log("billing items are: ",billSnapShot);
                // billSnapShot.docs.forEach(doc =>{
                //     console.log("billed items are : ",doc.data());
                //     setBilledItems([...doc.data()])

                // })

                const billingItems = billSnapShot.docs.map(doc => {
                    return{
                        ...doc.data()
                    }
                })

                setBilledItems(billingItems);
                console.log("billed itmes are fetched success fully..");
            }

            pageLoad.setPageLoad(false);
        }

        if(userDetails?.email){
            console.log(userDetails.email)
            fetchBilledItems();
        }

    },[])
    return(
        <div className="bill-container">
            {
                isEmpty ? <h1>No Bill Genrated</h1> : 
                <>
                    <h1>Your Orders Bill</h1>
                    {
                        billedItems.map((item)=>{
                            console.log("items are :",item);
                            console.log(item.item);
                            console.log(item.item[0].orderedDate);
                            return(
                                <div className="bill-slip"> 
                                    <caption>Ordered On:- {item.item[0].orderedDate}</caption>
                                    <table className="bill-name">
                                        <thead>
                                            <th>Title</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                        </thead>
                                        <tbody>
                                            {
                                                item.item.map((row)=>{
                                                    return(
                                                        <tr>
                                                            <th className="bill-title">{row.productTitle}</th>
                                                            <th>{row.productUnitPrice}</th>
                                                            <th>{row.productQuantity}</th>
                                                            <th>{row.productUnitPrice*row.productQuantity}</th>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            <tr>
                                                <th>Total Amount</th>
                                                <th></th>
                                                <th></th>
                                                <th>
                                                    {
                                                        item.item.reduce((sum, item) => {
                                                            const quantity = parseInt(item.productQuantity) // Default to 0 if quantity is invalid
                                                            const price = parseFloat(item.productUnitPrice)
                                                            console.log("Price",price);
                                                            console.log("quantity",quantity);
                                                            return sum + (quantity * price);
                                                        }, 0)
                                                    }
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })
                    }
                </>
            }
        </div>
    )
}

// need to get or store bill object 
// [{
//     orderedDate,
//     productTitle,
//     productUnitPrice,
//     productQuantity
// }]

// with above object need to calculate individual total price and overall total price 