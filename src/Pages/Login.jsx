import React, { useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css'; // Ensure this is imported globally

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserGroup = async () => {
            try {
                const { tokens } = await fetchAuthSession();
                const groups = tokens.accessToken.payload['cognito:groups'] || [];

                if (groups.includes('Suppliers')) {
                    navigate('/admin/viewmedications');
                } else {
                    navigate('/admin/dashboard');
                }
            } catch (error) {
                console.error('Error fetching user groups:', error);
                navigate('/'); // Default navigation if an error occurs
            }
        };

        checkUserGroup();
    }, [navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff',
        }}>
        </div>
    );
}

export default withAuthenticator(Login, { className: 'custom-login' });
