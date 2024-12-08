import { useEffect, useState } from "react"
import { useAuthContext, usePageLoadContext } from "../context/AuthnticationContext"
import { useProductContext } from "../context/ProductsContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.configuration";
import 'react-toastify/dist/ReactToastify.css';
import { Bounce, toast, ToastContainer } from "react-toastify";
import { CartCard } from "./CartCard";
import { useBillContext } from "../context/BillContext";

export const Cart = () =>{

    const pageLoad = usePageLoadContext();
    const {userDetails} = useAuthContext();
    const {cartProducts,setCartProducts} = useProductContext();
    const [totalPrice, setTotalPrice] = useState(0); 
    const [isEmpty,setIsEmpty] = useState(false);
    const {addItemsTOBill} = useBillContext();
    useEffect(()=>{
        const fetchCartItems = async () =>{
            let price =0;
            console.log("fetching cart items");
            pageLoad.setPageLoad(true);
            const cretRef = collection(db,`userAuthentication/${userDetails.email}/cart`);
            const cartSnapshot = await getDocs(cretRef);
            if(cartSnapshot.empty){
                console.log("cart is empty");
                setIsEmpty(true);
                pageLoad.setPageLoad(false);
                // toast.success('Cart is Empty', {
                //     position: "top-right",
                //     autoClose: 1000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "light",
                //     transition: Bounce,
                //     });
                   
                return;
            }
            const cart = cartSnapshot.docs.map(doc => {
                console.log("quantity: ",doc.data().quantity,"price: ",doc.data().product.price);
                price=price+(parseFloat(doc.data().product.price)*parseInt(doc.data().quantity));
                
                return {
                ...doc.data() 
                }


        });

            // price = parseFloat(price.toFixed(2)); 
            price = parseFloat(price); 
            console.log("total price of items is : ",price);
            setTotalPrice(price);
            setCartProducts(cart);
            pageLoad.setPageLoad(false);
        }

        if(userDetails?.email){
            console.log(userDetails.email)
            fetchCartItems();
        }
    },[])

    const toastMessage = (message)=>{
        toast.success(message, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            });
    }

    const purchaseItems = async () =>{
        await addItemsTOBill();
        setTotalPrice(0);
        setIsEmpty(true);
    }


    // useEffect(()=>{
    //     if(totalPrice<=0){
    //         setIsEmpty(true);
    //     }
    // },[totalPrice])


        return (
        <div className="cart-body">
            { !isEmpty ?
            <>
                <div className="cart-left-pannel">

                    <div className="price-box">
                        <h1>Total Price:- <span className="price-tag">{totalPrice}/-</span></h1>
                        <button className="purchase" onClick={()=>purchaseItems()}><h1>Purchase</h1></button>
                    </div>
                </div>
                <div className="cart-right-pannel">
                    {
                        cartProducts.map((product) => {
                            return(
                                <CartCard key={product.id} product={product} quantity={product.quantity} totalPrice={totalPrice} setTotalPrice={setTotalPrice} setIsEmpty={setIsEmpty}/>
                            )
                        })
                    }
                </div>
            </>: <h1>Cart is Empty</h1>}
        {/* <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
            />
                
        <ToastContainer /> */}
        </div>
    )
}