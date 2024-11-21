import useInfiniteScroll from 'react-infinite-scroll-hook';

interface DefaultScrollList {
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
  hasError: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export const CommonScrollList: React.FC<DefaultScrollList> = ({
  loading,
  onLoadMore,
  hasMore,
  hasError,
  children,
}) => {
  const [sentryRef] = useInfiniteScroll({
    loading: loading,
    hasNextPage: hasMore,
    onLoadMore: onLoadMore,

    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: hasError,

    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });

  const endOfInfiniteScrollListHiddenDiv = (
    <div
      aria-hidden={true}
      style={{ height: 0, width: 0, padding: 0, margin: 0 }}
      ref={sentryRef}
    />
  );

  return (
    <div>
      {children}
      {(loading || hasMore) && endOfInfiniteScrollListHiddenDiv}
    </div>
  );
};
