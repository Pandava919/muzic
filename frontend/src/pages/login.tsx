import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

interface CredentialsResponse {
  clientId: string;
  credential: string;
  select_by: string;
}


const Login = () => {
  // const [isLogedIn, setIsLogedIn] = useState(false);
  const navigate = useNavigate()

    const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const onSuccess = async(credentials: CredentialsResponse) => {
      try {
        // const response = await axios.post('http://localhost:8080/login', credentials);
        // setIsLogedIn(true);  
        navigate('/dashboard')
        
      } catch (error) {
        console.log(error)
      }
    }
  const onError = () => {
    console.log('login failed');
  }
  return (
    <div className=' flex items-center justify-center h-screen'>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <GoogleLogin 
                onSuccess={onSuccess}
                onError={onError}
                theme='outline'
                type='standard'
                
            />
        </GoogleOAuthProvider>

    </div>
  )
}

export default Login
