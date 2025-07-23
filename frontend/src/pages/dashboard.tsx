import axios from "axios"

export const Dashboard = () =>{
    return <div className="text-white pt-17">DashBoard
    <button
    onClick={()=>{
        const response = axios.get('http://localhost:8080/streams', { withCredentials: true })
    }}
    >get</button>
    </div>
}