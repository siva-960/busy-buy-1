import { createContext, useContext, useState } from "react";
import { useProductContext } from "./ProductsContext";
import { useAuthContext, usePageLoadContext } from "./AuthnticationContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.configuration";

const billContext = createContext();

export const BillContext = ({children}) =>{

    const [billedItems, setBilledItems] = useState([]);
    const {cartProducts,setCartProducts,clearCart} = useProductContext();
    const pageLoad = usePageLoadContext();
    const {userDetails} = useAuthContext();


    const addItemsTOBill =  async () =>{
        //1.get all cart products
        pageLoad.setPageLoad(true);
        let billedItems = [];
        
        cartProducts.forEach(({product,quantity})=>{
            billedItems= [...billedItems,
                {
                    orderedDate: new Date().toLocaleDateString("en-CA"),
                    productId:product.id,
                    productTitle:product.title,
                    productQuantity:quantity,
                    productUnitPrice:product.price,
                }
            ]
        })

        console.log("billed Items are ",billedItems);
        const billRef = collection(db,`userAuthentication/${userDetails.email}/billing`);
        await addDoc(billRef,{
            item:billedItems
        })

        setCartProducts([]);
        clearCart(userDetails.email);
        console.log("items added to billing and cleared the cart");
        pageLoad.setPageLoad(false);

    }
    return(
        <billContext.Provider value={{billedItems,setBilledItems,addItemsTOBill}}>
            {children}
        </billContext.Provider>
    )
}

export const useBillContext = () =>{
    return useContext(billContext);
}