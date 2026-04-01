import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchPage } from '@/features/dashboard/services/dashboardApi';
import { mapRecentActivity, type RecentActivity } from './recentUpdates.utils';

const SCROLL_THRESHOLD_PX = 120;

export function useRecentUpdates() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const loadingPageRef = useRef<number | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const hasMore = page < totalPages;

  const loadPage = useCallback(async (nextPage: number) => {
    if (loadingPageRef.current === nextPage) return;
    if (loadedPagesRef.current.has(nextPage)) return;

    loadingPageRef.current = nextPage;

    const isFirst = nextPage === 1;
    if (isFirst) {
      setIsInitialLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setError(null);

    try {
      const response = await fetchPage(
        nextPage,
        'dashboard/production_h5',
        'filter=weekly&rel_type=task',
      );

      const mapped = (response.data as any[])
        .map((item, index) => mapRecentActivity(item, { page: nextPage, index }))
        .filter((item): item is RecentActivity => item !== null);

      loadedPagesRef.current.add(nextPage);

      setActivities((current) => {
        if (isFirst) return mapped;
        return [...current, ...mapped];
      });

      setPage(nextPage);
      setTotalPages(response.totalPages || 1);
    } catch (err: any) {
      setError(String(err?.message || 'Failed to load recent updates'));
    } finally {
      loadingPageRef.current = null;

      if (isFirst) {
        setIsInitialLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadPage(1);
  }, [loadPage]);

  const loadNextPage = useCallback(() => {
    if (isInitialLoading || isLoadingMore || !hasMore) return;
    void loadPage(page + 1);
  }, [hasMore, isInitialLoading, isLoadingMore, loadPage, page]);

  const onScrollPositionChange = useCallback(
    ({ y }: { x: number; y: number }) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const distanceToBottom = viewport.scrollHeight - viewport.clientHeight - y;
      if (distanceToBottom <= SCROLL_THRESHOLD_PX) {
        loadNextPage();
      }
    },
    [loadNextPage],
  );

  return useMemo(
    () => ({
      activities,
      error,
      hasMore,
      isInitialLoading,
      isLoadingMore,
      viewportRef,
      onScrollPositionChange,
    }),
    [activities, error, hasMore, isInitialLoading, isLoadingMore, onScrollPositionChange],
  );
}
