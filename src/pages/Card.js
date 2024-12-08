import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthnticationContext";
import { useProductContext } from "../context/ProductsContext";

export const Card = ({product,successTrigger}) =>{
    const authenticate = useAuthContext();
    const navigate = useNavigate();
    const {addProducts , cartProducts} = useProductContext();

    // add items in to the cart 
    const addItemToCart = async (product)=>{
        console.log(product);
        if(!authenticate.userDetails){
            navigate("/signIn");
        }else{
            console.log("u can able to add items happy shopping");
            await addProducts(product);
            successTrigger();
        }
    }
    return(
        <>
            <div key={product.id}>
                <img src={product.image} alt="not found" />
                <h1 className="description">{product.description}</h1>
                <h1 className="card-price">{product.price}</h1>
                <button className="card-button" onClick={()=>addItemToCart(product)}>Add To Cart</button>
            </div>
            
        </>
    )
}