import { useCallback, useState } from 'react';
import type { FeedPost as FeedPostType } from '../data/feedData';

type UseFeedPostActionsArgs = {
  onOpenDetail: (post: FeedPostType, focusComments?: boolean) => void;
  onOpenSave: (post: FeedPostType) => void;
};

export function useFeedPostActions({ onOpenDetail, onOpenSave }: UseFeedPostActionsArgs) {
  const [likedById, setLikedById] = useState<Record<string, boolean>>({});
  const [inspiredById, setInspiredById] = useState<Record<string, boolean>>({});

  const toggleLike = useCallback((postId: string) => {
    setLikedById(prev => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const toggleInspiration = useCallback((postId: string) => {
    setInspiredById(prev => ({ ...prev, [postId]: !prev[postId] }));
  }, []);

  const openComments = useCallback(
    (post: FeedPostType) => {
      onOpenDetail(post, true);
    },
    [onOpenDetail]
  );

  const openDetail = useCallback(
    (post: FeedPostType) => {
      onOpenDetail(post, false);
    },
    [onOpenDetail]
  );

  const openSave = useCallback(
    (post: FeedPostType) => {
      onOpenSave(post);
    },
    [onOpenSave]
  );

  const sharePost = useCallback(async (_post: FeedPostType) => {
    // TODO: integrar Share API nativa. De momento, no hacemos side-effects.
  }, []);

  return {
    likedById,
    inspiredById,
    toggleLike,
    toggleInspiration,
    openComments,
    openDetail,
    openSave,
    sharePost,
  };
}
