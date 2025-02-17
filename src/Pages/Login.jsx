import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css'; // This should be in your main entry point (e.g., App.js or index.js)

function Login() {
    const navigate = useNavigate();

    // Redirect the user to the dashboard after login
    React.useEffect(() => {
        navigate('/admin/dashboard');
    }, [navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff',
        }}
        >
        </div>
    );
}

// Wrap the LoginPage with the Authenticator
export default withAuthenticator(Login, { hideSignUp: true, className:'custom-login' });
