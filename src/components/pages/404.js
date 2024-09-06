import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";

const Page404 = () => {
    return (
        <div>
            <ErrorMessage/>
            <h1 style={{"textAlign": "center", "marginTop": "15px", "color": "red"}}>A non-existent page</h1>
            <Link style={{"display": 'block', "textAlign": "center", "fontWeight": "bold", "fontSize": "24px", "marginTop": "30px", "color": "blueviolet"}} to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;