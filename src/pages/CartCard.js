import { useEffect } from "react";
import { usePageLoadContext } from "../context/AuthnticationContext";
import { useProductContext } from "../context/ProductsContext";
import 'react-toastify/dist/ReactToastify.css';



export const CartCard = ({product,quantity,setTotalPrice,setIsEmpty,totalPrice}) =>{
    const productContext = useProductContext();
    const pageLoad = usePageLoadContext();
    console.log(product)

   
    if (!product || !product.product) {
        console.warn("Invalid product data:", product);
        return null; // Skip rendering if the data is invalid
    }
    const {image,title,price} = product.product
    console.log(`image: ${image} price: ${price} title: ${title} quantity:${quantity}`);

    const decrement = async (product) =>{
        pageLoad.setPageLoad(true);
        await productContext.removeProducts(product);
        pageLoad.setPageLoad(false);
        // let price = parseFloat(product.price.toFixed(2));
        let price = parseFloat(product.price);
        setTotalPrice((prev) => prev - price);
    }

    const increment = async (product) => {
        pageLoad.setPageLoad(true);
        await productContext.addProducts(product);
        pageLoad.setPageLoad(false);
        console.log("price.............",product.price);
        // updateTotalPrice(parseFloat(product.price.toFixed(2)));
        updateTotalPrice(parseFloat(product.price));
        // toastMessage("Added Item");
    }

   

    const updateTotalPrice = (price) =>{
        // price = parseFloat(price.toFixed(2)); 
        setTotalPrice((prev)=>prev+price)
    }

    const removeAll = async (product ,qau) =>{
        // console.log("1.product price",product.price)
        pageLoad.setPageLoad(true);
        await productContext.removeAll(product);
        pageLoad.setPageLoad(false);
        // console.log("product price......",product.price)
        console.log("product.price:  ",parseFloat(product.price));
        console.log("product.quantity",parseInt(qau));
        let price = parseFloat(product.price)*parseInt(qau);
        // price = price.toFixed(2);
        console.log("removing price is: ",price)
        if(totalPrice-price<=0){
            console.log("all items are removed price is 0");
            setIsEmpty(true);
        }
         setTotalPrice((prev)=>prev-price);
    }

    return(
        <div className="cart-card" key={product.product.id}>
            <div className="cart-card-image">
                <img src={image} alt="not found"/>
            </div>
            <div className="cart-card-title">
                {title}
            </div>
            <div className="cart-card-price">
                <div className="price">
                    {price}
                </div>
                <div className="add-or-minus">
                    <div className="cart-card-decrement" onClick={()=>decrement(product.product)}>
                        -
                    </div>
                    <div className="quantity">
                        {quantity}
                    </div>
                    <div className="cart-card-increment" onClick={()=>increment(product.product)}>
                        +
                    </div>
                </div>
            </div>
            <div className="remove">
                <button className="remove-button" onClick={()=>removeAll(product.product,product.quantity)}>Remove From Cart</button>
            </div>
        </div>
    )
}