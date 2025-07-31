import React, { useCallback, useEffect, useRef, useState } from "react";

const UseInfinityObserver = (pageSize: number) => {
  const [page, setPage] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchMore = useCallback(() => {
    const nextPage = page + 1;
    const start = nextPage * pageSize;
    const end = start + pageSize;

    setPage(nextPage);
  }, [page]);

  const lastItemRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (observer.current) observer.current.disconnect();
      if (!node) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      });

      observer.current.observe(node);
    },
    [fetchMore]
  );

  useEffect(() => {
    // 첫 로드
    fetchMore();
  }, []);

  return { page, observer };
};

export default UseInfinityObserver;
