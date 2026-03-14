import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Heart, MessageCircle, Sparkles, Share2, MoreHorizontal, Bookmark, Edit2, Trash2, Pin, PinOff } from 'lucide-react';
import { collectionsService } from '@/services/collections.service';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  FeedPostProps,
  categoryColors,
  categoryIcons,
  getTimeAgo,
  getFullTimestamp
} from './FeedPost.types';
import { FeedPostContent } from './FeedPostContent';
import { SaveToCollectionModal } from '../modals/SaveToCollectionModal';

export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
  onPin,
  isDetailView = false,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || post.likes || 0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [playingVideoIndex, setPlayingVideoIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isInspired, setIsInspired] = useState(false);
  const [inspirationCount, setInspirationCount] = useState(post.inspirationCount || 0);
  const [isInspirationLoading, setIsInspirationLoading] = useState(false);
  const [showInspirationFeedback, setShowInspirationFeedback] = useState<'added' | 'removed' | null>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const isOwnPost = user?.id === post.author.id;

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };

    if (showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }

    return undefined;
  }, [showOptionsMenu]);

  // Verificar si el post está marcado como inspiración
  useEffect(() => {
    const checkInspiration = async () => {
      if (!user) return;

      const postIdNum = typeof post.id === 'string' ? parseInt(post.id, 10) : Number(post.id);
      if (isNaN(postIdNum) || postIdNum <= 0) return;

      try {
        const result = await collectionsService.checkPostInspiration(postIdNum, post.type);
        console.log(`✨ Check inspiration for post ${postIdNum} (${post.type}):`, result.isInspiration);
        setIsInspired(result.isInspiration);
      } catch (error) {
        console.error('Error checking inspiration:', error);
      }
    };
    checkInspiration();
  }, [post.id, post.type, user]);

  const handlePostClick = () => {
    // No navegar si ya estamos en vista de detalle
    if (isDetailView) {
      return;
    }

    // Shallow routing: preserva el estado del feed y pasa el tipo del post
    router.push({
      query: {
        ...router.query,
        postId: post.id,
        postType: post.type
      }
    }, undefined, { shallow: true });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike?.(post.id, isLiked);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCollectionModal(true);
  };

  const handleInspiration = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Inicia sesión para guardar inspiraciones');
      return;
    }
    if (isInspirationLoading) return;

    // Asegurar que el ID sea un número válido
    const postIdNum = typeof post.id === 'string' ? parseInt(post.id, 10) : Number(post.id);

    if (isNaN(postIdNum) || postIdNum <= 0) {
      console.error('❌ Invalid post ID:', post.id, 'type:', typeof post.id);
      toast.error('Error: ID de post inválido');
      return;
    }
    const wasInspired = isInspired;

    // Actualización optimista inmediata
    setIsInspired(!wasInspired);
    setInspirationCount(prev => wasInspired ? Math.max(0, prev - 1) : prev + 1);
    setShowInspirationFeedback(wasInspired ? 'removed' : 'added');

    // Ocultar feedback después de la animación
    setTimeout(() => setShowInspirationFeedback(null), 1200);

    setIsInspirationLoading(true);

    try {
      if (wasInspired) {
        await collectionsService.removeInspiration(postIdNum, post.type);
      } else {
        await collectionsService.addInspiration({
          postId: postIdNum,
          postType: post.type,
        });
      }
    } catch (error: any) {
      // Si el error es 409 (ya existe), significa que la inspiración ya estaba guardada
      // Actualizamos el estado y no mostramos error
      if (error?.response?.status === 409) {
        if (!wasInspired) {
          // Intentamos agregar pero ya existía - el estado está correcto ahora
          console.log('ℹ️ La inspiración ya existía, estado sincronizado');
          return;
        }
      }
      // Revertir en caso de error real
      setIsInspired(wasInspired);
      setInspirationCount(prev => wasInspired ? prev + 1 : Math.max(0, prev - 1));
      setShowInspirationFeedback(null);
      toast.error(error.message || 'Error al actualizar inspiración');
    } finally {
      setIsInspirationLoading(false);
    }
  };

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingVideoIndex === index) {
      video.pause();
      setPlayingVideoIndex(null);
    } else {
      // Pause other videos
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) v.pause();
      });
      video.play();
      setPlayingVideoIndex(index);
    }
  };

  const CategoryIcon = post.author.category ? categoryIcons[post.author.category] : Sparkles;
  const categoryGradient = post.author.category ? categoryColors[post.author.category] : 'from-purple-500 to-blue-500';

  return (
    <article className="group relative">
      {/* Línea vertical del hilo */}
      <div className="absolute left-[34px] top-16 bottom-0 w-[2px] bg-gradient-to-b from-purple-200 to-transparent dark:from-purple-800 dark:to-transparent" />

      <div
        className={`relative px-4 py-4 transition-colors duration-200 ${
          isDetailView
            ? 'bg-gray-100 dark:bg-black'
            : 'hover:bg-purple-50/50 dark:hover:bg-neutral-900/50 cursor-pointer'
        }`}
        onClick={isDetailView ? undefined : handlePostClick}
      >
        {/* Feedback de inspiración animado */}
        {showInspirationFeedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div
              className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl backdrop-blur-md shadow-2xl animate-bounce-in ${
                showInspirationFeedback === 'added'
                  ? 'bg-purple-500/90 text-white'
                  : 'bg-gray-800/90 text-gray-200'
              }`}
              style={{
                animation: 'inspirationPop 1.2s ease-out forwards',
              }}
            >
              <Sparkles
                className={`h-10 w-10 ${
                  showInspirationFeedback === 'added' ? 'animate-spin-slow' : ''
                }`}
                fill={showInspirationFeedback === 'added' ? 'currentColor' : 'none'}
              />
              <span className="text-sm font-semibold">
                {showInspirationFeedback === 'added' ? '¡Inspiración guardada!' : 'Quitado de inspiraciones'}
              </span>
            </div>
          </div>
        )}
        <style jsx>{`
          @keyframes inspirationPop {
            0% {
              opacity: 0;
              transform: scale(0.5);
            }
            20% {
              opacity: 1;
              transform: scale(1.1);
            }
            40% {
              transform: scale(0.95);
            }
            60% {
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(0.8);
            }
          }
          .animate-spin-slow {
            animation: spin 2s linear infinite;
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div className="flex gap-3">
          {/* Avatar con indicador de categoría */}
          <div className="relative flex-shrink-0">
            <a href={`/profile/${post.author.id}`} className="block" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 overflow-hidden ring-2 ring-white dark:ring-neutral-900 group-hover:ring-purple-300 dark:group-hover:ring-purple-700 transition-all duration-200">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-semibold">
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Badge de categoría artística */}
                {post.author.category && (
                  <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-tr ${categoryGradient} shadow-lg`}>
                    <CategoryIcon className="h-3 w-3 text-white" />
                  </div>
                )}

                {post.author.verified && (
                  <div className="absolute -top-0.5 -right-0.5 bg-white dark:bg-neutral-900 rounded-full p-0.5">
                    <svg className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                )}
              </div>
            </a>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <a href={`/profile/${post.author.id}`} className="hover:underline">
                    <span className="font-bold text-[15px] text-gray-900 dark:text-gray-100">
                      {post.author.name}
                    </span>
                  </a>
                  {post.isPinned && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm flex items-center gap-1">
                      <Pin className="h-2.5 w-2.5" fill="currentColor" />
                      Fijado
                    </span>
                  )}
                  {post.featured && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm">
                      Destacado
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {post.author.username && (
                    <span>@{post.author.username}</span>
                  )}
                  <span>·</span>
                  <span
                    title={getFullTimestamp(post.createdAt)}
                    className="cursor-help"
                  >
                    {getTimeAgo(post.createdAt)}
                  </span>
                </div>
              </div>

              {isOwnPost && (
                <div className="relative" ref={optionsMenuRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptionsMenu(!showOptionsMenu);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-all"
                  >
                    <MoreHorizontal className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  </button>

                  {showOptionsMenu && (
                    <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[180px] z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPin?.(post.id, !!post.isPinned);
                          setShowOptionsMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        {post.isPinned ? (
                          <>
                            <PinOff className="h-4 w-4" />
                            Desfijar
                          </>
                        ) : (
                          <>
                            <Pin className="h-4 w-4" />
                            Fijar en perfil
                          </>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(post.id);
                          setShowOptionsMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(post.id);
                          setShowOptionsMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Content (delegated to FeedPostContent component) */}
            <FeedPostContent
              post={post}
              isExpanded={isExpanded}
              onToggleExpanded={() => setIsExpanded(!isExpanded)}
              playingVideoIndex={playingVideoIndex}
              videoRefs={videoRefs}
              onVideoClick={handleVideoClick}
              isDetailView={isDetailView}
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {/* Like */}
                <button
                  onClick={handleLike}
                  className="group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-all"
                >
                  <Heart
                    className={`h-[18px] w-[18px] transition-all ${
                      isLiked
                        ? 'fill-pink-500 text-pink-500'
                        : 'text-gray-500 dark:text-gray-400 group-hover/btn:text-pink-500'
                    }`}
                  />
                  {likeCount > 0 && (
                    <span className={`text-xs font-medium ${
                      isLiked
                        ? 'text-pink-500'
                        : 'text-gray-500 dark:text-gray-400 group-hover/btn:text-pink-500'
                    }`}>
                      {likeCount}
                    </span>
                  )}
                </button>

                {/* Comment */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onComment?.(post.id);
                  }}
                  className="group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
                >
                  <MessageCircle className="h-[18px] w-[18px] text-gray-500 dark:text-gray-400 group-hover/btn:text-blue-500 transition-colors" />
                  {post.commentCount && post.commentCount > 0 && (
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover/btn:text-blue-500">
                      {post.commentCount}
                    </span>
                  )}
                </button>

                {/* Inspiration */}
                <button
                  onClick={handleInspiration}
                  disabled={isInspirationLoading}
                  className={`group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all ${
                    isInspirationLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={isInspired ? 'Quitar de inspiraciones' : 'Guardar como inspiración'}
                >
                  <Sparkles
                    className={`h-[18px] w-[18px] transition-all ${
                      isInspired
                        ? 'fill-purple-500 text-purple-500'
                        : 'text-gray-500 dark:text-gray-400 group-hover/btn:text-purple-500'
                    }`}
                  />
                  {inspirationCount > 0 && (
                    <span className={`text-xs font-medium ${
                      isInspired
                        ? 'text-purple-500'
                        : 'text-gray-500 dark:text-gray-400 group-hover/btn:text-purple-500'
                    }`}>
                      {inspirationCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1">
                {/* Bookmark - Save to Collection */}
                <button
                  onClick={handleBookmark}
                  className="group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-all"
                  title="Guardar en colección"
                >
                  <Bookmark className="h-[18px] w-[18px] text-gray-500 dark:text-gray-400 group-hover/btn:text-yellow-500 transition-colors" />
                  {post.saveCount !== undefined && post.saveCount > 0 && (
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover/btn:text-yellow-500">
                      {post.saveCount}
                    </span>
                  )}
                </button>

                {/* Share */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare?.(post.id);
                  }}
                  className="p-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all group/btn"
                  title="Compartir post"
                >
                  <Share2 className="h-[18px] w-[18px] text-gray-500 dark:text-gray-400 group-hover/btn:text-purple-600 dark:group-hover/btn:text-purple-400 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-200 dark:via-purple-900/30 to-transparent mx-4" />

      {/* Modals */}
      <SaveToCollectionModal
        open={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        postId={post.id}
        postType={post.type}
      />
    </article>
  );
};

________________________________

import React from 'react';
import { Music, Palette, Camera, Sparkles, Play } from 'lucide-react';
// Re-export unified types from @/types/post
export type { Post, PostAuthor as Author, PostMedia as Media } from '@/types/post';

export interface FeedPostProps {
  post: import('@/types/post').Post;
  onLike?: (postId: number, isLiked: boolean) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onPin?: (postId: number, isPinned: boolean) => void;
  isDetailView?: boolean; // Indica si estamos en vista de detalle
}

export const categoryColors = {
  music: 'from-purple-500 to-pink-500',
  art: 'from-orange-500 to-red-500',
  photography: 'from-blue-500 to-cyan-500',
  writing: 'from-green-500 to-emerald-500',
  performance: 'from-yellow-500 to-orange-500',
};

export const categoryIcons = {
  music: Music,
  art: Palette,
  photography: Camera,
  writing: Sparkles,
  performance: Play,
};

// Helper function to detect and make URLs clickable
export const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

// Time formatting utilities
export const getTimeAgo = (date?: string) => {
  if (!date) return 'Ahora';
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Ahora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

export const getFullTimestamp = (date?: string) => {
  if (!date) return '';
  const postDate = new Date(date);
  return postDate.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '


_____________________________

import React from 'react';
import { Music, Palette, Camera, Sparkles, Play } from 'lucide-react';
// Re-export unified types from @/types/post
export type { Post, PostAuthor as Author, PostMedia as Media } from '@/types/post';

export interface FeedPostProps {
  post: import('@/types/post').Post;
  onLike?: (postId: number, isLiked: boolean) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onEdit?: (postId: number) => void;
  onDelete?: (postId: number) => void;
  onPin?: (postId: number, isPinned: boolean) => void;
  isDetailView?: boolean; // Indica si estamos en vista de detalle
}

export const categoryColors = {
  music: 'from-purple-500 to-pink-500',
  art: 'from-orange-500 to-red-500',
  photography: 'from-blue-500 to-cyan-500',
  writing: 'from-green-500 to-emerald-500',
  performance: 'from-yellow-500 to-orange-500',
};

export const categoryIcons = {
  music: Music,
  art: Palette,
  photography: Camera,
  writing: Sparkles,
  performance: Play,
};

// Helper function to detect and make URLs clickable
export const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

// Time formatting utilities
export const getTimeAgo = (date?: string) => {
  if (!date) return 'Ahora';
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Ahora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

export const getFullTimestamp = (date?: string) => {
  if (!date) return '';
  const postDate = new Date(date);
  return postDate.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

_______________________

import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  Share2,
  MoreHorizontal,
  Bookmark,
  ArrowLeft,
  Music,
  Palette,
  Camera,
  Image,
  Smile,
  X
} from 'lucide-react';
import { postService } from '@/services/post.service';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface Author {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  verified?: boolean;
  category?: 'music' | 'art' | 'photography' | 'writing' | 'performance';
}

interface Comment {
  id: number;
  author: Author;
  content: string;
  createdAt: string;
  likes: number;
  parentId?: number;
  replies?: Comment[];
  depth?: number;
}

interface Post {
  id: number;
  author: Author;
  content: string;
  createdAt: string;
  media?: any[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

interface PostDetailProps {
  postId: number;
  onClose: () => void;
}

const categoryColors = {
  music: 'from-purple-500 to-pink-500',
  art: 'from-orange-500 to-red-500',
  photography: 'from-blue-500 to-cyan-500',
  writing: 'from-green-500 to-emerald-500',
  performance: 'from-yellow-500 to-orange-500',
};

const categoryIcons = {
  music: Music,
  art: Palette,
  photography: Camera,
  writing: Sparkles,
  performance: Sparkles,
};

const CommentItem: React.FC<{
  comment: Comment;
  isLast?: boolean;
  depth?: number;
  onReply: (parentId: number, content: string) => Promise<void>;
  onLike: (commentId: number) => Promise<void>;
}> = ({ comment, isLast = false, depth = 0, onReply, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likes, setLikes] = useState(comment.likes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CategoryIcon = comment.author.category ? categoryIcons[comment.author.category] : Sparkles;
  const categoryGradient = comment.author.category ? categoryColors[comment.author.category] : 'from-gray-500 to-gray-600';

  const maxDepth = 3;
  const canNest = depth < maxDepth;

  const handleLike = async () => {
    try {
      await onLike(comment.id);
      setIsLiked(!isLiked);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText('');
      setIsReplying(false);
      toast.success('Respuesta publicada');
    } catch (error) {
      toast.error('Error al publicar respuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Línea vertical del hilo */}
      {!isLast && (
        <div className="absolute left-[23px] top-14 bottom-0 w-[2px] bg-gradient-to-b from-gray-200 to-transparent dark:from-neutral-800 dark:to-transparent" />
      )}

      <div className="flex gap-3 py-3 group/comment">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <a href={`/profile/${comment.author.id}`}>
            <div className="relative">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${categoryGradient} opacity-0 group-hover/comment:opacity-20 blur-md transition-opacity`} />

              <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden ring-2 ring-white dark:ring-black">
                {comment.author.avatar ? (
                  <img src={comment.author.avatar} alt={comment.author.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold text-sm">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {comment.author.category && (
                <div className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-gradient-to-tr ${categoryGradient} shadow-lg`}>
                  <CategoryIcon className="h-2.5 w-2.5 text-white" />
                </div>
              )}

              {comment.author.verified && (
                <div className="absolute -top-0.5 -right-0.5 bg-white dark:bg-black rounded-full p-0.5">
                  <svg className="h-3 w-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              )}
            </div>
          </a>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <a href={`/profile/${comment.author.id}`} className="hover:underline">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {comment.author.name}
                </span>
              </a>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                @{comment.author.username}
              </span>
            </div>
            <button className="opacity-0 group-hover/comment:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-all">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <p className="text-[15px] text-gray-900 dark:text-white mb-2 leading-relaxed">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 hover:text-red-500 transition-colors group/like"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
              <span className={isLiked ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}>
                {likes}
              </span>
            </button>

            {canNest && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Responder</span>
              </button>
            )}
          </div>

          {/* Reply input */}
          {isReplying && (
            <div className="mt-3 flex gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-900 flex-shrink-0" />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Responder a @${comment.author.username}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit();
                    }
                  }}
                />
                <div className="flex items-center justify-end mt-2 gap-2">
                  <button
                    onClick={() => setIsReplying(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim() || isSubmitting}
                    className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : 'Responder'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {showReplies && (
                <div className="space-y-0">
                  {comment.replies.map((reply, index) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      isLast={index === comment.replies!.length - 1}
                      depth={depth + 1}
                      onReply={onReply}
                      onLike={onLike}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PostDetail({ postId, onClose }: PostDetailProps) {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
    loadComments();
    loadBookmarkStatus();
  }, [postId]);

  const loadBookmarkStatus = async () => {
    try {
      const bookmarked = await postService.isPostBookmarked(postId);
      setIsBookmarked(bookmarked);
    } catch (error) {
      console.error('Error loading bookmark status:', error);
    }
  };

  const loadPost = async () => {
    try {
      const postData = await postService.getPostById(postId);
      setPost(postData as any);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Error al cargar el post');
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await postService.getComments(postId);

      console.log('📥 Comments data from backend:', commentsData);
      console.log('📊 Number of comments:', commentsData.length);

      // Organizar comentarios en estructura de árbol
      const commentMap = new Map<number, Comment>();
      const rootComments: Comment[] = [];

      // Primero crear un mapa de todos los comentarios
      commentsData.forEach((comment: any) => {
        console.log('🔍 Processing comment:', comment);
        commentMap.set(comment.id, {
          ...comment,
          author: {
            id: comment.authorId,
            name: comment.authorName,
            username: comment.username,
            avatar: comment.authorAvatar,
            verified: comment.verified,
          },
          replies: [],
        });
      });

      // Luego organizar en árbol
      commentMap.forEach((comment) => {
        if (comment.parentId) {
          const parent = commentMap.get(comment.parentId);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(comment);
          }
        } else {
          rootComments.push(comment);
        }
      });

      console.log('🌳 Root comments to display:', rootComments);
      console.log('📝 Total root comments:', rootComments.length);
      setComments(rootComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      if (isLiked) {
        await postService.unlikePost(post.id);
        setPost({ ...post, likeCount: post.likeCount - 1 });
      } else {
        await postService.likePost(post.id);
        setPost({ ...post, likeCount: post.likeCount + 1 });
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error('Error al dar like');
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !post) return;

    setIsSubmitting(true);
    try {
      await postService.createComment(post.id, commentText);
      setCommentText('');
      await loadComments();
      setPost({ ...post, commentCount: post.commentCount + 1 });
      toast.success('Comentario publicado');
    } catch (error) {
      toast.error('Error al publicar comentario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: number, content: string) => {
    if (!post) return;
    await postService.createComment(post.id, content, parentId);
    await loadComments();
    setPost({ ...post, commentCount: post.commentCount + 1 });
  };

  const handleCommentLike = async (commentId: number) => {
    try {
      await postService.likeComment(commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await postService.unbookmarkPost(postId);
        setIsBookmarked(false);
        toast.success('Post eliminado de favoritos');
      } else {
        await postService.bookmarkPost(postId);
        setIsBookmarked(true);
        toast.success('Post guardado en favoritos');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Error al actualizar favoritos');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  const CategoryIcon = post.author.category ? categoryIcons[post.author.category] : Sparkles;
  const categoryGradient = post.author.category ? categoryColors[post.author.category] : 'from-gray-500 to-gray-600';

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-900 dark:text-white" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Publicación</h1>
          </div>
        </div>

        {/* Main Post */}
        <div className="px-4 py-4 border-b-8 border-gray-100 dark:border-neutral-900">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${categoryGradient} opacity-20 blur-md`} />
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden ring-2 ring-white dark:ring-black">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {post.author.category && (
                <div className={`absolute -bottom-0.5 -right-0.5 p-1 rounded-full bg-gradient-to-tr ${categoryGradient} shadow-lg`}>
                  <CategoryIcon className="h-3 w-3 text-white" />
                </div>
              )}
              {post.author.verified && (
                <div className="absolute -top-0.5 -right-0.5 bg-white dark:bg-black rounded-full p-0.5">
                  <svg className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <a href={`/profile/${post.author.id}`} className="hover:underline">
                <span className="font-bold text-[15px] text-gray-900 dark:text-white">{post.author.name}</span>
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-500">@{post.author.username}</p>
            </div>
          </div>

          <p className="text-[17px] text-gray-900 dark:text-white mb-4 leading-relaxed">{post.content}</p>

          {post.media && post.media.length > 0 && (
            <div className="mb-4 rounded-3xl overflow-hidden border border-gray-200 dark:border-neutral-800">
              <img src={post.media[0].url} alt="Post" className="w-full" />
            </div>
          )}

          <div className="flex items-center gap-6 py-3 border-y border-gray-200 dark:border-neutral-800 text-sm">
            <button className="hover:underline">
              <span className="font-bold text-gray-900 dark:text-white">{post.likeCount}</span>
              <span className="text-gray-500 dark:text-gray-500 ml-1">Me gusta</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-gray-900 dark:text-white">{post.commentCount}</span>
              <span className="text-gray-500 dark:text-gray-500 ml-1">Comentarios</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-gray-900 dark:text-white">{post.shareCount}</span>
              <span className="text-gray-500 dark:text-gray-500 ml-1">Compartidos</span>
            </button>
          </div>

          <div className="flex items-center justify-around py-2 border-b border-gray-200 dark:border-neutral-800">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
              <MessageCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all">
              <Sparkles className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleBookmark}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-all"
            >
              <Bookmark
                className={`h-5 w-5 ${
                  isBookmarked
                    ? 'fill-yellow-500 text-yellow-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all">
              <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Comment Input */}
        <div className="px-4 py-4 border-b-8 border-gray-100 dark:border-neutral-900">
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-900 flex-shrink-0">
              {user?.photoURL || user?.profileImageUrl ? (
                <img src={(user.photoURL || user.profileImageUrl) ?? ''} alt="Avatar" className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-semibold text-sm">
                  {(user?.firstName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribe un comentario..."
                className="w-full px-0 py-2 text-[15px] bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500"
                rows={3}
              />
              <div className="flex items-center justify-end mt-2">
                <button
                  disabled={!commentText.trim() || isSubmitting}
                  onClick={handleCommentSubmit}
                  className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Publicando...' : 'Comentar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Thread */}
        <div className="px-4">
          {loading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No hay comentarios aún
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Sé el primero en comentar
              </p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isLast={index === comments.length - 1}
                depth={0}
                onReply={handleReply}
                onLike={handleCommentLike}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

_________

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * Fallback page for direct post URLs (/post/123)
 * Redirects to home with postId query to use PostDetailLayer
 */
const PostDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // Redirect to home with postId query parameter
      // This will trigger the PostDetailLayer to open
      router.replace({ pathname: '/', query: { postId: id } }, undefined, { shallow: true });
    }
  }, [id, router]);

  return (
    <>
      <Head>
        <title>Cargando post...</title>
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    </>
  );
};

export default PostDetailPage;