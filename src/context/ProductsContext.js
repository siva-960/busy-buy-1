import { addDoc, collection, deleteDoc, doc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase.configuration";
import { useAuthContext, usePageLoadContext } from "./AuthnticationContext";

const productContext = createContext();

export const ProductContextProvider = ({children}) =>{
    const authContext = useAuthContext();
    const {userDetails} = authContext;
    const [cartProducts, setCartProducts] = useState([]);
    const pageload = usePageLoadContext();

    //initalizing cat afront
    useEffect(()=>{
    //    console.log("getting products at front");


        const initalizeCart = async () =>{
            pageload.setPageLoad(true);
            console.log("getting products for ",userDetails.email);
            const cretRef = collection(db,`userAuthentication/${userDetails.email}/cart`);
            const cartSnapshot = await getDocs(cretRef);
            const cart = cartSnapshot.docs.map(doc => ({
                ...doc.data() 
            }));
            // console.log("cart : ",cart);
            setCartProducts(cart);

            pageload.setPageLoad(false);
        }

        if(userDetails?.email){
            console.log(userDetails.email)
            initalizeCart();
        }
        

    },[userDetails])
    
    useEffect(()=>{
        if(cartProducts)
        {
            // pageload.setPageLoad(true)
            // setTimeout(()=>{
            //     pageload.setPageLoad(false)
            // },1000)
            console.log("Products in Cart are : ",cartProducts);
        }
    },[cartProducts]);


    const addProducts= async (product) =>{
        if(!product?.id){
            console.log("product not exist");
            return;
        }
       //first check if already product there in cart
       console.log("product")
    //    pageload.setPageLoad(true);
       const cartRef = collection(db,`userAuthentication/${userDetails.email}/cart`);
       const q = query(cartRef, where("product.id", "==", product.id));
       const querySnapshot = await getDocs(q);
       if (!querySnapshot.empty) {

        console.log("Product already there in cart so increasing quantity");

        const docId = querySnapshot.docs[0].id; // Get the document ID
        const productDocRef = doc(db, `userAuthentication/${userDetails.email}/cart/${docId}`);
    
        await updateDoc(productDocRef, {
          quantity: increment(1), // Increment the quantity by 1
        });

        setCartProducts((prev)=>prev.map((cart)=>cart.product?.id === product.id ? {...cart , quantity:cart.quantity+1}  : cart))
        // pageload.setPageLoad(false);
        return;
      }

      await addDoc(cartRef, {
       product,
        quantity: 1, // Default quantity
      });

      setCartProducts([...cartProducts ,  {...product , quantity:1}]);
      console.log("Products are added in to the cart successfully");
    //   pageload.setPageLoad(false);
    }

    const removeAll = async (product) =>{
        if (!product?.id) {
            console.log("Product does not exist");
            return;
        }

        const cartRef = collection(db, `userAuthentication/${userDetails.email}/cart`);
        const q = query(cartRef, where("product.id", "==", product.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
    
            const docId = querySnapshot.docs[0].id; // Get the document ID
            const productDocRef = doc(db, `userAuthentication/${userDetails.email}/cart/${docId}`);
            await deleteDoc(productDocRef);
            setCartProducts((prev) =>
                prev.filter((cart) => cart.product?.id !== product.id)
            );

            console.log("Product removed from cart as quantity reached 0");
        }else{
            console.log("Product not there....");
        }
    }

    const removeProducts = async (product) => {
        if (!product?.id) {
            console.log("Product does not exist");
            return;
        }
    
        const cartRef = collection(db, `userAuthentication/${userDetails.email}/cart`);
        const q = query(cartRef, where("product.id", "==", product.id));
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
            console.log("Product found in cart. Checking quantity...");
    
            const docId = querySnapshot.docs[0].id; // Get the document ID
            const productDocRef = doc(db, `userAuthentication/${userDetails.email}/cart/${docId}`);
            const currentQuantity = querySnapshot.docs[0].data().quantity;
    
            if (currentQuantity > 1) {
                // Decrement quantity in Firestore
                await updateDoc(productDocRef, {
                    quantity: increment(-1), // Decrease quantity by 1
                });
    
                // Update state
                setCartProducts((prev) =>
                    prev.map((cart) =>
                        cart.product?.id === product.id
                            ? { ...cart, quantity: cart.quantity - 1 }
                            : cart
                    )
                );
            } else {
                // Quantity is 1, remove the product entirely
                await deleteDoc(productDocRef); // Remove from Firestore
    
                // Update state
                setCartProducts((prev) =>
                    prev.filter((cart) => cart.product?.id !== product.id)
                );
    
                console.log("Product removed from cart as quantity reached 0");
            }
        } else {
            console.log("Product not found in cart");
        }
    };
    

    const clearCart = async (userEmail) => {
        try {
            // Reference to the user's cart subcollection
            const cartRef = collection(db, `userAuthentication/${userEmail}/cart`);
            
            // Retrieve all documents in the cart
            const cartSnapshot = await getDocs(cartRef);
            
            // Loop through the documents and delete them
            const deletePromises = cartSnapshot.docs.map((cartDoc) => {
                return deleteDoc(doc(db, `userAuthentication/${userEmail}/cart`, cartDoc.id));
            });
            
            // Wait for all deletions to complete
            await Promise.all(deletePromises);
            
            console.log("All cart items deleted successfully!");
        } catch (error) {
            console.error("Error deleting cart items:", error);
        }
    };
    
    // Usage example
    // clearCart(userDetails.email);


    return (
        <productContext.Provider value={{addProducts,cartProducts,setCartProducts,removeProducts,removeAll,clearCart}}>
            {children}
        </productContext.Provider>
    )
}


export const useProductContext = () =>{
    return useContext(productContext);
}