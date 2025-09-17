import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";

import "./App.css";

function LandingPage(){
    const scrollBtnRef = useRef<HTMLButtonElement>(null);
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() =>{
        const scrollBtn = scrollBtnRef.current;
        if(!scrollBtn) return;

        const handleScroll = () => {
            if (window.scrollY > 500) scrollBtn.style.display = "block";
            else scrollBtn.style.display = "none";
        };

        const handleClick = () => {
            window.scrollTo({top: 0, behavior: "smooth"});
        };

        window.addEventListener("scroll", handleScroll);
        scrollBtn.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            scrollBtn.removeEventListener("click", handleClick);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {name, mail, message};

        try{
            const res = await fetch("http://localhost:5000/api/contact", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("Server response: ", data);

            if(data.success){
                setName("");
                setMail("");
                setMessage("");
                alert("Form sent");
            }
        } catch(err){
            console.error(err);
            alert("Error: Couldn't send form");
        }
    }
    

    return (
        <div>
            <header>
            <nav>
            <ul>
                <Link to="/" style={{textDecoration: "none"}}><li>Home</li></Link>
                <li><a href="#about">O nas</a></li>
                <li><a href="#services">Usługi</a></li>
                <li><a href="#contact-form">Kontakt</a></li>
                <Link to="/admin" style={{textDecoration: "none"}}><li>Admin Page</li></Link>
            </ul>
            </nav>
            </header>

            <section id="banner">
                <img src="/logo.png" alt="Logo" />
                <h1>Zwiększaj zasięgi. Zdobądź klientów. Boostuj swój biznes!</h1>
                <br />
            </section>

            <section id="about">
                <br/>
                <h1>O nas</h1>
                <p>
                    Jesteśmy zespołem pasjonatów, którzy pomagają firmom rozwijać się w świecie cyfrowym. 
                    <br />
                    Naszym celem jest zwiększanie zasięgów, zdobywanie nowych klientów i skuteczne wspieranie biznesów w osiąganiu sukcesu. 
                    <br />
                    Łączymy nowoczesne technologie z kreatywnym podejściem, aby dostarczać rozwiązania dopasowane do
                    indywidualnych potrzeb każdego klienta.
                </p>
                <p>
                    Działamy z zaangażowaniem i profesjonalizmem, stawiając na transparentną komunikację i długotrwałą
                    współpracę. Z nami Twój biznes zyska nie tylko widoczność, ale i realne efekty.
                </p>
                <br />
            </section>

            <section id="services">
                <div className="service-card">
                    <img src="/insta.png" alt="Instagram" />
                    <h1>Reklamy na instagramie</h1>
                    <p>
                        Docieraj do tysięcy potencjalnych klientów dzięki dobrze zoptymalizowanym kampaniom reklamowym na
                        Instagramie. 
                        <br />
                        Tworzymy angażujące kreacje i skuteczne strategie, które przyciągają uwagę i zwiększają
                        sprzedaż.
                    </p>
                </div>
                <div className="service-card">
                    <img src="/content.png" alt="Content Marketing" />
                    <h1>Content Marketing</h1>
                    <p>
                        Buduj zaufanie i lojalność poprzez wartościowe treści. 
                        <br />
                        Tworzymy posty, grafiki, artykuły i kampanie
                        dopasowane do Twojej grupy docelowej. 
                        <br />
                        Pomagamy firmom mówić językiem swoich klientów.
                    </p>
                </div>
                <div className="service-card">
                    <img src="/report.png" alt="Raporty i analizy" />
                    <h1>Raporty i analizy</h1>
                    <p>
                        Z nami wiesz, co działa. 
                        <br />
                        Regularnie analizujemy wyniki kampanii i zachowania odbiorców, a dane
                        przedstawiamy w przejrzysty i zrozumiały sposób. 
                        <br />
                        Dzięki temu możesz podejmować trafne decyzje biznesowe.
                    </p>
                </div>
                <br />
            </section>

            <section id="contact-form">
                <h1 style={{textAlign: "center"}}>Napisz do nas!</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Imię:</label>
                    <input 
                        type="text" 
                        id="name" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label htmlFor="mail">Email:</label>
                    <input 
                        type="email" 
                        id="mail" 
                        required 
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />

                    <label htmlFor="message">Wiadomość do nas:</label>
                    <textarea 
                        id="message" 
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button type="submit">Wyślij</button>
                </form>
            </section>

            <footer>
                <div id="footer-container">
                    <div id="footer-left">
                        <h2>Dane kontaktowe:</h2>
                        <p>Email: boostup@gmail.com</p>
                    </div>
                    <div id="footer-center">
                        <h3>&copy; Wszelkie prawa zastrzeżone</h3>
                    </div>
                    <div id="footer-right">
                        <h2>Social media:</h2>
                        <h5>
                            Nasz instagram:
                            <a href="https://instagram.com" target="_blank">
                                <img src="/insta.png" alt="Instagram" width="20" height="20" />
                            </a>
                            <br /><br />
                            Nasz facebook:
                            <a href="https://facebook.com" target="_blank">
                                <img src="/fb.png" alt="Facebook" width="20" height="20" />
                            </a>
                        </h5>
                    </div>
                </div>
            </footer>
            <button id="scrollBtn" ref={scrollBtnRef} style={{display: "none"}}>↑</button>
        </div>
    );
}

export default LandingPage;