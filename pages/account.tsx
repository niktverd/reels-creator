/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
} from '@material-ui/core';
import {Refresh} from '@material-ui/icons';
import {useRouter} from 'next/router';

import {VideoGrid} from '../src/components/VideoGrid/VideoGrid';
import {Navigation} from '../src/navigation';
import type {VideoType} from '../src/types/video';

import _styles from '../styles/DefaultCrop.module.css';

const Demo = () => {
    const router = useRouter();
    const [videos, setVideos] = React.useState<VideoType[]>([]);
    const [storedToken, setStoredToken] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [hasToken, setHasToken] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [connecting, setConnecting] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    const loadCreators = React.useCallback(() => {
        const load = async () => {
            const response = await fetch('/api/user/list');
            const json = await response.json();
            setVideos(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                json.data
                    .sort((a: {createdAt: any}, b: {createdAt: any}) => {
                        return b.createdAt?.seconds || 0 - a.createdAt?.seconds || 0;
                    })
                    .map((video: any) => ({
                        ...video,
                        id: video.id || video.name, // Use ID if available, otherwise fallback to name
                    })),
            );
        };

        load();
    }, []);

    const checkInstagramToken = React.useCallback(async () => {
        try {
            const response = await fetch('/api/user/instagram-token');
            const data = await response.json();
            if (data.ok && data.instagramToken) {
                setHasToken(true);
                setStoredToken(data.instagramToken);
            } else {
                setHasToken(false);
                setStoredToken('');
            }
        } catch (error) {
            console.error('Error checking Instagram token:', error);
        }
    }, []);

    const connectInstagram = () => {
        setDialogOpen(true);
    };

    const handleOpenInstagramAuth = () => {
        // Use a redirect flow instead of opening in a new tab
        setConnecting(true);
        window.location.href = `https://instagram-video-downloader-e0875c65c071.herokuapp.com/login-instagram?redirectionUri=${process.env.NEXTAUTH_URL}/api/user/connect-instagram`;
    };

    const handleDeleteInstagramToken = async () => {
        try {
            setDeleting(true);
            const response = await fetch('/api/user/instagram-token', {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.ok) {
                setHasToken(false);
                setStoredToken('');
                setErrorMessage('Instagram account disconnected successfully.');
                setSnackbarOpen(true);
                setDialogOpen(false);
            } else {
                setErrorMessage('Failed to disconnect Instagram account.');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error deleting Instagram token:', error);
            setErrorMessage('An error occurred while disconnecting Instagram.');
            setSnackbarOpen(true);
        } finally {
            setDeleting(false);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // Create a masked version of the token for display
    const getMaskedToken = React.useCallback(() => {
        if (!storedToken) return '';
        const firstFive = storedToken.substring(0, 5);
        return `${firstFive}${'*'.repeat(20)}`;
    }, [storedToken]);

    // Check for error parameters in URL
    React.useEffect(() => {
        const {error} = router.query;
        if (error) {
            let message = '';
            switch (error) {
                case 'auth_failed':
                    message = 'Authentication failed. Please try again.';
                    break;
                case 'connection_failed':
                    message = 'Failed to connect Instagram. Please try again.';
                    break;
                default:
                    message = 'An error occurred during Instagram connection.';
            }
            setErrorMessage(message);
            setSnackbarOpen(true);

            // Remove the error parameter from URL
            const {pathname} = router;
            router.replace(pathname, undefined, {shallow: true});
        }
    }, [router]);

    React.useEffect(() => {
        loadCreators();
        checkInstagramToken();
    }, [loadCreators, checkInstagramToken]);

    // Define button text based on state
    const buttonText = hasToken ? 'Reconnect Now' : 'Connect Now';
    const buttonContent = connecting ? <CircularProgress size={24} /> : buttonText;
    const deleteButtonContent = deleting ? <CircularProgress size={24} /> : 'Disconnect Instagram';

    return (
        <Navigation>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 30,
                    alignItems: 'center',
                }}
            >
                <button
                    onClick={connectInstagram}
                    style={{
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 0 15px #ff69b4, 0 0 30px #ff69b4',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px #ff69b4, 0 0 40px #ff69b4';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 15px #ff69b4, 0 0 30px #ff69b4';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 20px #ff69b4, 0 0 40px #ff69b4';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 15px #ff69b4, 0 0 30px #ff69b4';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    {hasToken ? 'Instagram Connected ✓' : 'Connect Instagram Account'}
                </button>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            paddingRight: 20,
                        }}
                    >
                        Video generation can take time. Please be patient and refresh page in a few
                        minutes
                    </div>
                    <button
                        style={{
                            border: '2px solid #fff',
                            backgroundColor: '#000',
                            color: '#fff',
                            borderRadius: '50%',
                            padding: 12,
                            cursor: 'pointer',
                        }}
                        onClick={loadCreators}
                    >
                        <Refresh />
                    </button>
                </div>
            </div>

            {/* Instagram Token Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {hasToken ? 'Instagram Already Connected' : 'Connect Instagram Account'}
                </DialogTitle>
                <DialogContent>
                    {hasToken ? (
                        <div style={{marginBottom: '20px'}}>
                            <p>Your Instagram account is already connected.</p>
                            <p>
                                Current token: <strong>{getMaskedToken()}</strong>
                            </p>
                            <p>
                                If you want to update your token, you can click the button below to
                                reconnect.
                            </p>
                        </div>
                    ) : (
                        <div style={{marginBottom: '20px'}}>
                            <p>
                                To connect your Instagram account, click the button below. You will
                                be redirected to:
                            </p>
                            <ol style={{marginLeft: '20px', lineHeight: '1.6'}}>
                                <li>Log in to your Instagram account</li>
                                <li>Authorize this application</li>
                                <li>
                                    After authorization, you&apos;ll be redirected back
                                    automatically
                                </li>
                            </ol>
                        </div>
                    )}

                    {hasToken && (
                        <div style={{marginTop: '20px'}}>
                            <p>
                                <strong>Note:</strong> If you reconnect, your existing token will be
                                replaced.
                            </p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    {hasToken && (
                        <Button
                            onClick={handleDeleteInstagramToken}
                            color="secondary"
                            disabled={deleting}
                            style={{marginRight: 'auto'}}
                        >
                            {deleteButtonContent}
                        </Button>
                    )}
                    <Button onClick={handleOpenInstagramAuth} color="primary" disabled={connecting}>
                        {buttonContent}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={errorMessage}
            />

            <VideoGrid videos={videos} hasInstagramToken={hasToken} />
        </Navigation>
    );
};

export default Demo;
