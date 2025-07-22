import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"

export const Header = () => {
    const navigate = useNavigate()
    
    return(
        <>
            <nav className="flex justify-between items-center px-10 py-3 shadow-md shadow-gray-900 fixed top-0 z-0 w-full">
                <div>
                    <h1 className="font-medium font-serif text-3xl text-white">Muzic</h1>
                </div>
                <div>
                    <Button
                        variant={'outline'}
                        className='bg-blue-500 border-0 rounded-md text-white font-bold cursor-pointer'
                        onClick={()=>navigate('/login')}
                    >
                        Login
                    </Button>
                </div>
            </nav>
        </>
    )
}