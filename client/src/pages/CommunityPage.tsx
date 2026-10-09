import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  IconButton,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutlineOutlined as ChatBubbleOutline,
  Share,
  Add,
  Send,
  DirectionsBike,
  Timer,
  Speed,
  Terrain,
  PersonAdd,
  Check,
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { Post, Ride } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  // New post dialog state
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedRideId, setSelectedRideId] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const [postsData, ridesData] = await Promise.all([
          apiService.getPosts(),
          apiService.getRides(),
        ]);
        setPosts(postsData);
        setRides(ridesData);
      } catch (err) {
        console.error('Failed to load community', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunity();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const updated = await apiService.toggleLikePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? updated : p));
    } catch (err) {
      console.error('Error liking post', err);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const updated = await apiService.addComment(postId, text);
      setPosts(prev => prev.map(p => p.id === postId ? updated : p));
      setCommentInputs({ ...commentInputs, [postId]: '' });
      showToast('Comment posted! 💬', 'success');
    } catch (err) {
      console.error('Error adding comment', err);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;

    try {
      const newPost = await apiService.createPost(postContent, selectedRideId || undefined);
      setPosts([newPost, ...posts]);
      setPostContent('');
      setSelectedRideId('');
      setCreatePostOpen(false);
      showToast('Post shared with the CycleMate community! (+25 XP) 🚀', 'success');
    } catch (err) {
      showToast('Failed to create post', 'error');
    }
  };

  if (loading) {
    return <LoadingSkeleton type="cards" count={4} />;
  }

  return (
    <Box sx={{ maxWidth: 840, mx: 'auto', pb: 4 }}>
      {/* Header with Prominent Create Post Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Outfit', sans-serif" }}>
            Peloton Community Feed 🤝
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect with fellow cyclists, celebrate big miles, and share route advice.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setCreatePostOpen(true)}
          sx={{ fontWeight: 800, px: 2.5 }}
        >
          Create Post
        </Button>
      </Box>

      {/* Feed Stream */}
      <Stack spacing={3}>
        {posts.map(post => (
          <Card key={post.id} sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Post Author Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={post.author.avatar} alt={post.author.name} sx={{ width: 44, height: 44 }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      {post.author.name}
                    </Typography>
                    {post.author.badge && (
                      <Chip label={post.author.badge} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {post.timestamp}
                  </Typography>
                </Box>
              </Box>

              {post.author.id !== user?.id && (
                <Button
                  size="small"
                  variant={post.author.isFollowing ? 'outlined' : 'text'}
                  startIcon={post.author.isFollowing ? <Check fontSize="small" /> : <PersonAdd fontSize="small" />}
                  sx={{ fontWeight: 600 }}
                >
                  {post.author.isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </Box>

            {/* Post Content */}
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.02rem', lineHeight: 1.6 }}>
              {post.content}
            </Typography>

            {/* Embedded Ride Telemetry Snippet Card if attached */}
            {post.rideSnippet && (
              <Box
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2.5,
                  bgcolor: 'action.hover',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DirectionsBike color="primary" fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={700}>
                    {post.rideSnippet.title}
                  </Typography>
                </Box>
                <Grid container spacing={1} sx={{ textAlign: 'center' }}>
                  <Grid size={3}>
                    <Typography variant="caption" color="text.secondary" display="block">Distance</Typography>
                    <Typography variant="body2" fontWeight={800} color="primary.main">{post.rideSnippet.distance} km</Typography>
                  </Grid>
                  <Grid size={3}>
                    <Typography variant="caption" color="text.secondary" display="block">Duration</Typography>
                    <Typography variant="body2" fontWeight={700}>{post.rideSnippet.duration}</Typography>
                  </Grid>
                  <Grid size={3}>
                    <Typography variant="caption" color="text.secondary" display="block">Avg Speed</Typography>
                    <Typography variant="body2" fontWeight={700}>{post.rideSnippet.avgSpeed} km/h</Typography>
                  </Grid>
                  <Grid size={3}>
                    <Typography variant="caption" color="text.secondary" display="block">Elevation</Typography>
                    <Typography variant="body2" fontWeight={700}>{post.rideSnippet.elevation} m</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Interactions Bar: Like & Comment Counts */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                size="small"
                startIcon={post.hasLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                onClick={() => handleLike(post.id)}
                sx={{ fontWeight: 700, color: post.hasLiked ? 'error.main' : 'inherit' }}
              >
                {post.likes} Likes
              </Button>

              <Button
                size="small"
                startIcon={<ChatBubbleOutline />}
                sx={{ fontWeight: 600, color: 'text.secondary' }}
              >
                {post.comments.length} Comments
              </Button>

              <Button
                size="small"
                startIcon={<Share />}
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Post link copied!', 'success');
                }}
                sx={{ ml: 'auto', color: 'text.secondary' }}
              >
                Share
              </Button>
            </Box>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={1.5}>
                  {post.comments.map(c => (
                    <Box key={c.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Avatar src={c.userAvatar} sx={{ width: 28, height: 28 }} />
                      <Box sx={{ bgcolor: 'action.hover', p: 1.2, px: 2, borderRadius: 2.5, flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" fontWeight={800}>
                            {c.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {c.timestamp}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 0.2 }}>
                          {c.text}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Write a comment input */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment or ride kudos..."
                value={commentInputs[post.id] || ''}
                onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddComment(post.id);
                }}
              />
              <IconButton color="primary" onClick={() => handleAddComment(post.id)}>
                <Send fontSize="small" />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Stack>

      {/* Create Post Dialog */}
      <Dialog
        open={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Create Community Post 🚴</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="What's on your cycling mind?"
            fullWidth
            multiline
            rows={4}
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
            placeholder="Share an accomplishment, route review, or gear setup..."
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            label="Attach a Recent Ride (Optional)"
            value={selectedRideId}
            onChange={e => setSelectedRideId(e.target.value)}
          >
            <MenuItem value="">None (Text post only)</MenuItem>
            {rides.map(r => (
              <MenuItem key={r.id} value={r.id}>
                {r.title} ({r.distance} km • {r.date})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setCreatePostOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePost}
            disabled={!postContent.trim()}
            sx={{ fontWeight: 700 }}
          >
            Publish Post (+25 XP)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
