import { useState, useEffect, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";


function AdminLogin(){
    const loginBtnRef = useRef<HTMLButtonElement>(null);
    const [login, setLogin] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if(!login || !pass){
            setError("Please enter username and password");
            return;
        }

        try{
            setLoading(true);
            
            const res = await fetch("http://localhost:5000/api/admin/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ username: login, password: pass }),
            });

            const data = await res.json().catch(() => null);

            if(!res.ok){
                const msg = data?.msg || `Login failed (${res.status})`;
                setError(msg);
                alert(msg);
                setLoading(false);
                return;
            }

            if(data && data.success){
                setError("");
                navigate("/admin-panel");
            } else{
                const msg = data?.msg || "Invalid username or password";
                setError(msg);
                alert(msg);
            }
        } catch(err){
            console.error(`Login error: ${err}`);
            const msg = "Failed to connect to server";
            setError(msg);
            alert(msg);
        } finally{
            setLoading(false);
        }
        
    };

    return (
        <div>
            <form id="admin-login" onSubmit={handleLogin}>
                <header className="admin-header">
                    <h1 style={{textAlign: "center"}}>Admin Panel</h1>
                    <ul className="home">
                        <Link to="/" style={{textDecoration: "none"}}><li>Home</li></Link>
                    </ul>
                </header>
                <h3 style={{textAlign: "center"}}>Login:</h3>
                <input type="text" id="login" value={login} onChange={(e) => setLogin(e.target.value)}/>
                <h3 style={{textAlign: "center"}}>Password:</h3>
                <input type="password" id="pass" value={pass} onChange={(e) => setPass(e.target.value)}/>
                <button type="submit" id="loginBtn">Log in</button>
                {error && <p style={{color: "red", textAlign: "center"}}>{error}</p>}
            </form>
        </div>
    );
}

export default AdminLogin;