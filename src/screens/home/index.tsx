import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Text, Animated, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';
import TopBar from '../../components/shared/TopBar';

// Components & Services
import { FeedPost } from '../../components/home/feed/FeedPost';
import { CreatePostBox } from '../../components/home/feed/CreatePostBox';
import { SearchBar } from '../../components/home/common/SearchBar';
import { CreatePostModal } from '../../components/home/modals/CreatePostModal';
import { SharePostModal } from '../../components/home/modals/SharePostModal';
import { postService, Post } from '../../components/home/services/post.service';
import { blogService } from '../../components/home/services/blog.service';

const CATEGORY_LABELS: Record<string, string> = { music: 'Música en Vivo', photography: 'Fotografía', design: 'Diseño Gráfico', video: 'Video & Producción', voice: 'Locución & Audio', art: 'Arte & Decoración', performance: 'Performance & Show' };
const SEARCH_SUGGESTIONS = ['Artistas en mi ciudad', 'Eventos este fin de semana', 'Fotografía para evento', 'Música en vivo', 'Diseño gráfico', 'Ideas para mi próximo post'];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = auth.currentUser;
  const firstName = useMemo(() => user?.displayName?.split(' ')[0] ?? 'Artista', [user]);

  // States unificados para reducir líneas
  const [posts, setPosts] = useState<Post[]>([]);
  const [ui, setUi] = useState({ loading: false, refreshing: false, loadingMore: false });
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const [page, setPage] = useState({ current: 1, hasMore: true });
  const [search, setSearch] = useState({ query: '', visible: false });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modals, setModals] = useState({ create: false, sharing: null as Post | null });

  const searchAnim = useRef(new Animated.Value(0)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  // Helper de mapeo corregido para evitar errores de TS
  const mapBlogPost = (b: any): Post => ({
    id: b.id,
    type: 'blog',
    content: b.content || b.excerpt || '',
    author: {
      id: b.author?.id || '',
      name: b.author?.name || b.author?.displayName || 'Usuario',
      avatar: b.author?.profileImageUrl || b.author?.avatar,
    },
    likeCount: b.likeCount || 0,
    commentCount: b.commentCount || 0,
    shareCount: b.shareCount || 0,
    createdAt: b.publishedAt || b.createdAt || new Date().toISOString(),
    // Para evitar el error "excerpt no existe", pasamos los datos extra como metadata si tu tipo Post lo permite
    // o simplemente omitimos lo que no sea necesario para FeedPost.
  } as Post);

  const loadPosts = useCallback(async (pageNum = 1, isRefresh = false) => {
    setUi(prev => ({ ...prev, [isRefresh ? 'refreshing' : pageNum > 1 ? 'loadingMore' : 'loading']: true }));
    
    try {
      const [regRes, blogRes] = await Promise.allSettled([
        postService.getPosts(undefined, pageNum, 10, activeTab === 'following', selectedCategory || undefined),
        blogService.getAllPosts({ page: pageNum, limit: 10 }),
      ]);

      let newPosts: Post[] = [];
      if (regRes.status === 'fulfilled') newPosts = regRes.value.posts;
      if (blogRes.status === 'fulfilled') newPosts = [...newPosts, ...blogRes.value.data.map(mapBlogPost)];

      newPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setPosts(prev => {
        const combined = isRefresh || pageNum === 1 ? newPosts : [...prev, ...newPosts];
        return Array.from(new Map(combined.map(p => [p.id, p])).values()); // Elimina duplicados
      });
      setPage({ current: pageNum, hasMore: newPosts.length > 0 });
    } finally {
      setUi({ loading: false, refreshing: false, loadingMore: false });
    }
  }, [activeTab, selectedCategory]);

  useEffect(() => { loadPosts(1); }, [activeTab, selectedCategory]);

  // Filtrado local para búsqueda instantánea
  const filteredPosts = useMemo(() => {
    const q = search.query.toLowerCase();
    return !q ? posts : posts.filter(p => 
      p.content?.toLowerCase().includes(q) || p.author.name?.toLowerCase().includes(q)
    );
  }, [posts, search.query]);

  const handleTabChange = (tab: 'for-you' | 'following') => {
    setActiveTab(tab);
    Animated.spring(tabIndicatorAnim, { toValue: tab === 'for-you' ? 0 : 1, useNativeDriver: true }).start();
  };

  const toggleSearch = () => {
    const isVisible = !search.visible;
    setSearch(p => ({ ...p, visible: isVisible, query: isVisible ? p.query : '' }));
    Animated.spring(searchAnim, { toValue: isVisible ? 1 : 0, useNativeDriver: false }).start();
  };

  const handleLike = async (postId: number, isLiked: boolean) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likeCount: p.likeCount + (isLiked ? -1 : 1) } : p));
    try { isLiked ? await postService.unlikePost(postId) : await postService.likePost(postId); } catch { loadPosts(1); }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TopBar title={`Hola, ${firstName}`} topInset={insets.top} />

      <View style={styles.header}>
        <View style={styles.tabs}>
          {['for-you', 'following'].map((t, i) => (
            <TouchableOpacity key={t} style={styles.tab} onPress={() => handleTabChange(t as any)}>
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {t === 'for-you' ? 'Para ti' : 'Siguiendo'}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Animated.View style={[styles.tabIndicator, { transform: [{ translateX: tabIndicatorAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 170] }) }] }]} />
        </View>

        <Animated.View style={[styles.searchContainer, { height: searchAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 70] }), opacity: searchAnim }]}>
          <SearchBar value={search.query} onChangeText={(t) => setSearch(p => ({ ...p, query: t }))} suggestions={SEARCH_SUGGESTIONS} />
        </Animated.View>

        {selectedCategory && (
          <View style={styles.categoryFilter}>
            <Text style={styles.categoryFilterText}>Filtrando por: <Text style={styles.categoryFilterLabel}>{CATEGORY_LABELS[selectedCategory] || selectedCategory}</Text></Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}><Ionicons name="close" size={16} color={colors.textSecondary} /></TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item }) => <FeedPost post={item} onLike={() => handleLike(item.id, false)} onShare={() => setModals(m => ({ ...m, sharing: item }))} />}
        ListHeaderComponent={<CreatePostBox onPress={() => setModals(m => ({ ...m, create: true }))} userAvatar={user?.photoURL ?? undefined} userName={firstName} />}
        ListFooterComponent={ui.loadingMore ? <ActivityIndicator style={{ margin: 20 }} color={colors.primary} /> : null}
        refreshControl={<RefreshControl refreshing={ui.refreshing} onRefresh={() => loadPosts(1, true)} tintColor={colors.primary} />}
        onEndReached={() => page.hasMore && !ui.loadingMore && loadPosts(page.current + 1)}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90, flexGrow: 1 }}
        ListEmptyComponent={!ui.loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No hay publicaciones aún</Text>
          </View>
        ) : null}
      />

      <CreatePostModal visible={modals.create} onClose={() => setModals(m => ({ ...m, create: false }))} onPost={loadPosts as any} userAvatar={user?.photoURL ?? undefined} userName={firstName} />
      {modals.sharing && <SharePostModal visible={!!modals.sharing} onClose={() => setModals(m => ({ ...m, sharing: null }))} post={modals.sharing} onShare={async () => {}} userAvatar={user?.photoURL ?? undefined} userName={firstName} />}
    </View>
  );
}

// Estilos se mantienen igual para no alterar la UI...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabs: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  tabText: { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.textSecondary },
  tabTextActive: { color: colors.text, fontFamily: 'PlusJakartaSans_700Bold' },
  searchButton: { position: 'absolute', right: 16, padding: 12 },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, width: '50%', height: 2, backgroundColor: colors.primary },
  searchContainer: { overflow: 'hidden', paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: colors.border, justifyContent: 'center' },
  categoryFilter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  categoryFilterText: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary },
  categoryFilterLabel: { fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.text },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyTitle: { fontSize: 16, color: colors.textSecondary },
});