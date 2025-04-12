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
    TextField,
} from '@material-ui/core';
import {Refresh} from '@material-ui/icons';

import {VideoGrid} from '../src/components/VideoGrid/VideoGrid';
import {Navigation} from '../src/navigation';
import type {VideoType} from '../src/types/video';

import _styles from '../styles/DefaultCrop.module.css';

const Demo = () => {
    const [videos, setVideos] = React.useState<VideoType[]>([]);
    const [instagramToken, setInstagramToken] = React.useState('');
    const [storedToken, setStoredToken] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [hasToken, setHasToken] = React.useState(false);

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
            }
        } catch (error) {
            console.error('Error checking Instagram token:', error);
        }
    }, []);

    const connectInstagram = () => {
        setDialogOpen(true);
    };

    const handleOpenInstagramAuth = () => {
        window.open(
            'https://instagram-video-downloader-e0875c65c071.herokuapp.com/login-instagram',
            '_blank',
        );
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setInstagramToken('');
    };

    const handleSaveToken = async () => {
        if (!instagramToken.trim()) return;
        try {
            setSaving(true);
            const response = await fetch('/api/user/instagram-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({instagramToken}),
            });
            const data = await response.json();
            if (data.ok) {
                setHasToken(true);
                setStoredToken(instagramToken);
                handleCloseDialog();
            } else {
                alert('Failed to save Instagram token. Please try again.');
            }
        } catch (error) {
            console.error('Error saving Instagram token:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Create a masked version of the token for display
    const getMaskedToken = React.useCallback(() => {
        if (!storedToken) return '';
        const firstFive = storedToken.substring(0, 5);
        return `${firstFive}${'*'.repeat(20)}`;
    }, [storedToken]);

    React.useEffect(() => {
        loadCreators();
        checkInstagramToken();
    }, [loadCreators, checkInstagramToken]);

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
                                If you want to update your token, you can obtain a new one and paste
                                it below.
                            </p>
                        </div>
                    ) : (
                        <div style={{marginBottom: '20px'}}>
                            <p>
                                To connect your Instagram account, you need to follow these steps:
                            </p>
                            <ol style={{marginLeft: '20px', lineHeight: '1.6'}}>
                                <li>Click the &quot;Obtain Instagram Token&quot; button below</li>
                                <li>Log in to your Instagram account when prompted</li>
                                <li>Copy the long-lived access token provided</li>
                                <li>
                                    Return to this dialog and paste the token in the field below
                                </li>
                            </ol>
                        </div>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{marginBottom: '20px'}}
                        onClick={handleOpenInstagramAuth}
                        disabled={hasToken}
                    >
                        Obtain Instagram Token
                    </Button>
                    <TextField
                        label="Instagram Access Token"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={instagramToken}
                        onChange={(e) => setInstagramToken(e.target.value)}
                        placeholder={
                            hasToken
                                ? getMaskedToken()
                                : 'Paste your long-lived Instagram access token here'
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveToken}
                        color="primary"
                        disabled={!instagramToken.trim() || saving}
                    >
                        {saving ? <CircularProgress size={24} /> : 'Save Token'}
                    </Button>
                </DialogActions>
            </Dialog>

            <VideoGrid videos={videos} hasInstagramToken={hasToken} />
        </Navigation>
    );
};

export default Demo;
