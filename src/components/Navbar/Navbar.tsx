import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store/store";


export default function Navbar(){
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return(
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">Main</Link>

                <div className="flex item-start">
                    {isAuthenticated ? (
                        <Link to="/" className="text-white mr-4">Dashboard</Link>
                    ) : (
                        <Link to="/login" className="text-whtie mr-4">Login</Link>
                    )}

                    {isAuthenticated && (
                        <Link to="/logout" className="text-white">Logout</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}