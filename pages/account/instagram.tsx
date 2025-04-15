/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Typography,
} from '@material-ui/core';
import {useRouter} from 'next/router';

import {AccountLayout} from '../../src/components/AccountLayout/AccountLayout';

import styles from '../../styles/Account.module.css';

interface InstagramContent {
    account: string;
    ig_user_id: string;
    user_info: {
        username: string;
        biography: string;
        followers_count: number;
        follows_count: number;
        media_count: number;
        profile_picture_url: string;
        website: string;
    };
    media: any[];
    paging: any;
}

// eslint-disable-next-line complexity
const InstagramPage = () => {
    const router = useRouter();
    const [storedToken, setStoredToken] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [hasToken, setHasToken] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [connecting, setConnecting] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);
    const [instagramProfile, setInstagramProfile] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [mediaLoading, setMediaLoading] = React.useState(false);
    const [instagramContent, setInstagramContent] = React.useState<InstagramContent | null>(null);

    const checkInstagramToken = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/instagram-token');
            const data = await response.json();
            if (data.ok && data.instagramToken) {
                setHasToken(true);
                setStoredToken(data.instagramToken);

                // Get profile data if token exists
                try {
                    const profileResponse = await fetch('/api/user/instagram-profile');
                    const profileData = await profileResponse.json();
                    if (profileData.ok && profileData.profile) {
                        setInstagramProfile(profileData.profile);
                    }
                } catch (profileError) {
                    console.error('Error fetching Instagram profile:', profileError);
                }
            } else {
                setHasToken(false);
                setStoredToken('');
            }
        } catch (error) {
            console.error('Error checking Instagram token:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchInstagramMedia = React.useCallback(async () => {
        if (!hasToken) return;
        try {
            setMediaLoading(true);
            const response = await fetch(`/api/instagram/media?accessToken=${storedToken}`);
            if (!response.ok) {
                throw new Error('Failed to fetch Instagram media');
            }
            const contentData = await response.json();
            setInstagramContent(contentData);
        } catch (error) {
            console.error('Error fetching Instagram media:', error);
            setErrorMessage('Failed to load Instagram media.');
            setSnackbarOpen(true);
        } finally {
            setMediaLoading(false);
        }
    }, [hasToken, storedToken]);

    const connectInstagram = () => {
        setDialogOpen(true);
    };

    const handleOpenInstagramAuth = () => {
        // Use a redirect flow instead of opening in a new tab
        setConnecting(true);
        window.location.href = `${process.env.NEXT_PUBLIC_INSTAGRAM_INTEGRATION_BACKEND}/login-instagram?redirectionUri=${process.env.NEXT_PUBLIC_HOST}/api/user/connect-instagram`;
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
                setInstagramProfile(null);
                setInstagramContent(null);
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
        checkInstagramToken();
    }, [checkInstagramToken]);

    React.useEffect(() => {
        if (hasToken && storedToken) {
            fetchInstagramMedia();
        }
    }, [hasToken, storedToken, fetchInstagramMedia]);

    // Define button text based on state
    const buttonText = hasToken ? 'Reconnect Now' : 'Connect Now';
    const buttonContent = connecting ? <CircularProgress size={24} /> : buttonText;
    const deleteButtonContent = deleting ? <CircularProgress size={24} /> : 'Disconnect Instagram';

    return (
        <AccountLayout>
            <div className={styles.headerContainer}>
                <button onClick={connectInstagram} className={styles.connectButton}>
                    {hasToken ? 'Instagram Connected ✓' : 'Connect Instagram Account'}
                </button>
            </div>

            {/* eslint-disable-next-line no-nested-ternary */}
            {loading ? (
                <div style={{textAlign: 'center', padding: '50px 0'}}>
                    <CircularProgress />
                    <Typography variant="body1" style={{marginTop: 16}}>
                        Loading Instagram data...
                    </Typography>
                </div>
            ) : hasToken && (instagramProfile || instagramContent) ? (
                <div>
                    <Card>
                        <CardContent>
                            <div className={styles.instagramProfile}>
                                {instagramContent?.user_info?.profile_picture_url ? (
                                    <img
                                        src={instagramContent.user_info.profile_picture_url}
                                        alt={instagramContent.user_info.username}
                                        className={styles.profileAvatar}
                                    />
                                ) : (
                                    instagramProfile?.profile_picture && (
                                        <img
                                            src={instagramProfile.profile_picture}
                                            alt={instagramProfile.username}
                                            className={styles.profileAvatar}
                                        />
                                    )
                                )}
                                <div className={styles.profileInfo}>
                                    <Typography variant="h4">
                                        {instagramContent?.user_info?.username ||
                                            instagramProfile?.username}
                                    </Typography>
                                    <Typography variant="body1">
                                        {instagramContent?.user_info?.biography ||
                                            instagramProfile?.full_name ||
                                            ''}
                                    </Typography>
                                    <div style={{marginTop: 10}}>
                                        <Typography variant="body2">
                                            <strong>Followers:</strong>{' '}
                                            {instagramContent?.user_info?.followers_count || 0}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Following:</strong>{' '}
                                            {instagramContent?.user_info?.follows_count || 0}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Posts:</strong>{' '}
                                            {instagramContent?.user_info?.media_count || 0}
                                        </Typography>
                                    </div>
                                    <Typography variant="caption">
                                        User ID:{' '}
                                        {instagramContent?.ig_user_id || instagramProfile?.id}
                                    </Typography>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* eslint-disable-next-line no-nested-ternary */}
                    {mediaLoading ? (
                        <div style={{textAlign: 'center', padding: '30px 0'}}>
                            <CircularProgress size={30} />
                            <Typography variant="body1" style={{marginTop: 10}}>
                                Loading Instagram media...
                            </Typography>
                        </div>
                    ) : instagramContent?.media && instagramContent.media.length > 0 ? (
                        <div style={{marginTop: 30}}>
                            <Typography variant="h5" gutterBottom>
                                Instagram Media
                            </Typography>
                            <div className={styles.mediaGrid}>
                                {instagramContent.media.map((item: any) => (
                                    <div key={item.id} className={styles.mediaItem}>
                                        <img
                                            src={item.media_url || item.thumbnail_url}
                                            alt={item.caption || 'Instagram media'}
                                        />
                                        {item.media_type && (
                                            <div className={styles.mediaType}>
                                                {/* eslint-disable-next-line no-nested-ternary */}
                                                {item.media_type === 'IMAGE'
                                                    ? 'Photo'
                                                    : // eslint-disable-next-line no-nested-ternary
                                                      item.media_type === 'VIDEO'
                                                      ? 'Video'
                                                      : item.media_type === 'CAROUSEL_ALBUM'
                                                        ? 'Album'
                                                        : item.media_type}
                                            </div>
                                        )}
                                        {item.caption && (
                                            <div className={styles.mediaCaption}>
                                                {item.caption.length > 100
                                                    ? `${item.caption.substring(0, 100)}...`
                                                    : item.caption}
                                            </div>
                                        )}
                                        {(item.likes || item.like_count || item.comments_count) && (
                                            <div className={styles.mediaStats}>
                                                {(item.likes || item.like_count) > 0 && (
                                                    <span>❤️ {item.likes || item.like_count}</span>
                                                )}
                                                {item.comments_count > 0 && (
                                                    <span>💬 {item.comments_count}</span>
                                                )}
                                                {item.reach && <span>👁️ {item.reach}</span>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{marginTop: 30, textAlign: 'center'}}>
                            <Typography variant="h6">No Instagram Media Found</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={fetchInstagramMedia}
                                style={{marginTop: 16}}
                                disabled={mediaLoading}
                            >
                                {mediaLoading ? <CircularProgress size={24} /> : 'Refresh Media'}
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{textAlign: 'center', padding: '50px 0'}}>
                    <Typography variant="h5" gutterBottom>
                        No Instagram Account Connected
                    </Typography>
                    <Typography variant="body1">
                        Connect your Instagram account to view your profile data and media.
                    </Typography>
                </div>
            )}

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
        </AccountLayout>
    );
};

export default InstagramPage;
