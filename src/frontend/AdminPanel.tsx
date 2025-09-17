import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";

import './AdminPanel.css';

interface FormType{
    _id: string;
    name: string;
    mail: string;
    message: string;
    date: string;
    read?: boolean;
}

function AdminPanel(){
    const [forms, setForms] = useState<FormType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");


    const filteredForms = [...forms]
        .filter(f => f.mail.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });



    const fetchForms = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/forms");
            const data = await res.json();

            if(!res.ok || !data.success){
                throw new Error(data.msg || "Failed to fetch forms");
            }

            setForms(data.data);
        } catch(err){
            console.error(err);
            setError("Error loading forms");
        } finally{
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(!confirm("Are you sure you want to delete this form?")) return;
        
        try{
            const res = await fetch(`http://localhost:5000/api/forms/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if(data.success){
                setForms((prev) => prev.filter((f) => f._id !== id));
            } else{
                alert(data.msg || "Delete failed");
            }
        } catch(err){
            console.error(`Delete error: ${err}`);
            alert("Server error");
        }
    };

    const handleMarkRead = async (id: string) => {
        try{
            const res = await fetch(`http://localhost:5000/api/forms/${id}/read`, {
                method: "PATCH",
            });
            const data = await res.json();

            if(data.success){
                setForms((prev) =>
                    prev.map((f) =>
                        f._id === id ? {...f, read: true} : f
                    )
                );
            } else {
                alert(data.msg || "Update failed");
            }
        } catch(err){
            console.error(`Mark read error: ${err}`);
            alert("Server error");
        }
    }

    useEffect(() => {
        fetchForms();
    }, [])

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Panel - Forms</h1>

            <div id="tools">
                <label htmlFor="searchInput">Search by email:</label>
                <input 
                    type="text" 
                    id="searchInput" 
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <label htmlFor="sortSelect" className="sort-select"></label>
                <select 
                    id="sortSelect"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                >
                    <option value="desc">Newest</option>
                    <option value="asc">Oldest</option>
                </select>

                <button id="refreshBtn" className="btn" onClick={fetchForms}>Refresh</button>
                <Link to="/" style={{textDecoration: "none"}}><button className="btn">Home</button></Link>
            </div>
            <br />
            <table border={1} cellPadding={5} cellSpacing={0} className="forms-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="formsTable">
                    {forms.length > 0 ? (
                      filteredForms.map((form) => (
                        <tr key={form._id} className={!form.read ? "unread" : ""}>
                          <td>{form.name}</td>
                          <td>{form.mail}</td>
                          <td>{form.message}</td>
                          <td>{new Date(form.date).toLocaleString()}</td>
                          <td>{form.read ? "Read" : "New"}</td>
                          <td>
                            <button onClick={() => handleDelete(form._id)}>Delete</button>
                            {!form.read && (
                                <button onClick={() => handleMarkRead(form._id)}>Mark as read</button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                          No forms found
                        </td>
                      </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default AdminPanel;