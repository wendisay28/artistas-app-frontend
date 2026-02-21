// src/components/home/ArtistDashboard.tsx
// Feed tipo Threads para artistas — conectado al backend via postService

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import { postService, Post } from './services/post.service';
import { FeedPost } from './feed/FeedPost';
import { CreatePostModal } from './modals/CreatePostModal';

// ── Props ────────────────────────────────────────────────────────────────────

interface ArtistDashboardProps {
  onCompleteProfile?: () => void;
}

// ── Main component ───────────────────────────────────────────────────────────

export const ArtistDashboard: React.FC<ArtistDashboardProps> = ({
  onCompleteProfile,
}) => {
  const { user } = useAuthStore();
  const { artistData } = useProfileStore();

  // Feed state
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'siguiendo'>('todos');

  // UI state
  const [createPostVisible, setCreatePostVisible] = useState(false);

  // Profile completion
  const hasSocialLinks = artistData?.info?.some((i) =>
    ['Instagram', 'Twitter', 'YouTube', 'Spotify'].includes(i.label)
  );
  const completionItems = [
    !!(user?.photoURL || artistData?.avatar),
    !!(artistData?.bio || artistData?.description),
    !!(artistData?.role || (artistData?.tags && artistData.tags.length > 0)),
    !!(user?.city || artistData?.location),
    !!hasSocialLinks,
  ];
  const profileCompletion = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  // ── Data loading ───────────────────────────────────────────────────────────

  const loadPosts = useCallback(async (pageNum: number, replace: boolean) => {
    try {
      const { posts: fetched, hasMore: more } = await postService.getPosts(
        pageNum,
        10,
        activeFilter === 'siguiendo'
      );
      setPosts((prev) => replace ? fetched : [...prev, ...fetched]);
      setHasMore(more);
      setPage(pageNum);
    } catch {
      // silenciar
    }
  }, [activeFilter]);

  useEffect(() => {
    setFeedLoading(true);
    loadPosts(1, true).finally(() => setFeedLoading(false));
  }, [activeFilter]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts(1, true);
    setRefreshing(false);
  }, [loadPosts]);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await loadPosts(page + 1, false);
    setLoadingMore(false);
  }, [loadingMore, hasMore, page, loadPosts]);

  // ── Post interactions ──────────────────────────────────────────────────────

  const handleLike = useCallback((postId: number, currentlyLiked: boolean) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !currentlyLiked, likeCount: p.likeCount + (currentlyLiked ? -1 : 1) }
          : p
      )
    );
    if (currentlyLiked) {
      postService.unlikePost(postId).catch(() => {});
    } else {
      postService.likePost(postId).catch(() => {});
    }
  }, []);

  const handleSave = useCallback((postId: number, currentlySaved: boolean) => {
    setPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, isSaved: !currentlySaved } : p)
    );
    if (currentlySaved) {
      postService.unsavePost(postId).catch(() => {});
    } else {
      postService.savePost(postId).catch(() => {});
    }
  }, []);

  const handleNewPost = useCallback((content: string) => {
    const optimisticPost: Post = {
      id: Date.now(),
      type: 'post',
      content,
      author: {
        id: user?.id ?? '',
        name: user?.displayName ?? 'Yo',
        username: user?.displayName?.toLowerCase().replace(/\s+/g, '_'),
        avatar: user?.photoURL ?? undefined,
        verified: false,
      },
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      inspirationCount: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [optimisticPost, ...prev]);
    postService.createPost({ content, type: 'post', isPublic: true }).catch(() => {});
  }, [user]);

  // ── Render helpers ─────────────────────────────────────────────────────────

  const avatarInitials = (user?.displayName ?? 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const ListHeader = useCallback(() => (
    <View>
      {/* Profile completion banner */}
      {profileCompletion < 100 && (
        <LinearGradient
          colors={['#9333ea', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.completionBanner}
        >
          <View style={styles.completionLeft}>
            <Text style={styles.completionTitle}>Completa tu perfil</Text>
            <Text style={styles.completionSub}>
              Un perfil completo recibe 3× más clientes
            </Text>
            <View style={styles.completionBarBg}>
              <View style={[styles.completionBar, { width: `${profileCompletion}%` }]} />
            </View>
            <Text style={styles.completionPct}>{profileCompletion}% completado</Text>
          </View>
          <TouchableOpacity
            style={styles.completionBtn}
            onPress={onCompleteProfile}
            activeOpacity={0.85}
          >
            <Text style={styles.completionBtnText}>Ver portal</Text>
            <Ionicons name="arrow-forward" size={14} color="#9333ea" />
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Separator */}
      <View style={styles.sectionSep} />

      {/* Create post box */}
      <TouchableOpacity
        style={styles.createBox}
        onPress={() => setCreatePostVisible(true)}
        activeOpacity={0.8}
      >
        <View style={styles.createBoxInner}>
          {/* Avatar */}
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.createAvatar} />
          ) : (
            <LinearGradient
              colors={['#9333ea', '#2563eb']}
              style={styles.createAvatarGradient}
            >
              <Text style={styles.createAvatarText}>{avatarInitials}</Text>
            </LinearGradient>
          )}
          {/* Prompt */}
          <Text style={styles.createPrompt}>¿Qué estás creando hoy?</Text>
          {/* Post button */}
          <View style={styles.createPostBtn}>
            <Text style={styles.createPostBtnText}>Publicar</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.createActions}>
          <TouchableOpacity
            style={styles.createAction}
            onPress={() => setCreatePostVisible(true)}
          >
            <Ionicons name="image-outline" size={18} color="#9333ea" />
            <Text style={styles.createActionText}>Foto</Text>
          </TouchableOpacity>
          <View style={styles.createActionDot} />
          <TouchableOpacity
            style={styles.createAction}
            onPress={() => setCreatePostVisible(true)}
          >
            <Ionicons name="document-text-outline" size={18} color="#2563eb" />
            <Text style={styles.createActionText}>Blog</Text>
          </TouchableOpacity>
          <View style={styles.createActionDot} />
          <TouchableOpacity
            style={styles.createAction}
            onPress={() => setCreatePostVisible(true)}
          >
            <Ionicons name="chatbox-ellipses-outline" size={18} color="#f59e0b" />
            <Text style={styles.createActionText}>Cita</Text>
          </TouchableOpacity>
          <View style={styles.createActionDot} />
          <TouchableOpacity
            style={styles.createAction}
            onPress={() => setCreatePostVisible(true)}
          >
            <Ionicons name="sparkles-outline" size={18} color="#ec4899" />
            <Text style={styles.createActionText}>Momento</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Feed filter tabs */}
      <View style={styles.filterTabs}>
        {(['todos', 'siguiendo'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
              {f === 'todos' ? 'Para ti' : 'Siguiendo'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Feed loading skeleton */}
      {feedLoading && (
        <View style={styles.feedLoader}>
          <ActivityIndicator color="#9333ea" size="small" />
          <Text style={styles.feedLoaderText}>Cargando feed…</Text>
        </View>
      )}
    </View>
  ), [profileCompletion, activeFilter, feedLoading, user, avatarInitials]);

  const ListFooter = useCallback(() => {
    if (!loadingMore) return <View style={{ height: 80 }} />;
    return (
      <View style={styles.loadMoreWrap}>
        <ActivityIndicator color="#9333ea" size="small" />
      </View>
    );
  }, [loadingMore]);

  const ListEmpty = useCallback(() => {
    if (feedLoading) return null;
    return (
      <View style={styles.emptyWrap}>
        <LinearGradient colors={['#f3e8ff', '#e9d5ff']} style={styles.emptyIcon}>
          <Ionicons name="sparkles" size={32} color="#9333ea" />
        </LinearGradient>
        <Text style={styles.emptyTitle}>Aún no hay publicaciones</Text>
        <Text style={styles.emptyDesc}>
          {activeFilter === 'siguiendo'
            ? 'Sigue a artistas para ver su contenido aquí.'
            : 'Sé el primero en publicar algo creativo.'}
        </Text>
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={() => setCreatePostVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.emptyBtnText}>Crear publicación</Text>
        </TouchableOpacity>
      </View>
    );
  }, [feedLoading, activeFilter]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <FlatList
        data={feedLoading ? [] : posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FeedPost
            post={item}
            onLike={() => handleLike(item.id, !!item.isLiked)}
            onSave={() => handleSave(item.id, !!item.isSaved)}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#9333ea"
            colors={['#9333ea']}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatContent}
      />

      {/* Create post modal */}
      <CreatePostModal
        visible={createPostVisible}
        onClose={() => setCreatePostVisible(false)}
        onPost={(content) => {
          handleNewPost(content);
          setCreatePostVisible(false);
        }}
        userAvatar={user?.photoURL ?? undefined}
        userName={user?.displayName ?? 'Artista'}
      />
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fafafa' },
  flatContent: { paddingBottom: 20 },

  // Completion banner
  completionBanner: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completionLeft: { flex: 1 },
  completionTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', marginBottom: 3 },
  completionSub: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  completionBarBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  completionBar: { height: 4, backgroundColor: '#fff', borderRadius: 2 },
  completionPct: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(255,255,255,0.85)' },
  completionBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completionBtnText: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#9333ea' },

  sectionSep: { height: 8, backgroundColor: '#f3f4f6', marginTop: 14 },

  // Create post box
  createBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
  },
  createBoxInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  createAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  createAvatarGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAvatarText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  createPrompt: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
  },
  createPostBtn: {
    backgroundColor: '#f3e8ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  createPostBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#9333ea',
  },
  createActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3e8ff',
  },
  createAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 6,
  },
  createActionText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6b7280',
  },
  createActionDot: {
    width: 1,
    height: 16,
    backgroundColor: '#e9d5ff',
  },

  // Filter tabs
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
  },
  filterTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#9333ea',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#9ca3af',
  },
  filterTabTextActive: {
    color: '#4c1d95',
    fontFamily: 'PlusJakartaSans_700Bold',
  },

  // Feed loading
  feedLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 32,
  },
  feedLoaderText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
  },

  // Load more
  loadMoreWrap: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  // Empty state
  emptyWrap: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 48,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#4c1d95',
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 19,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: '#f3e8ff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#9333ea',
  },
});
