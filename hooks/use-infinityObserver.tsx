import { CommentType } from "@/components/Guestbook";
import { useCallback, useEffect, useRef, useState } from "react";

const UseInfinityObserver = (fetch: () => Promise<any>) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [data, setData] = useState<CommentType[]>([]);
  const [isLast, setIsLast] = useState(false);

  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    if (!node) return;

    observer.current = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        const fetchData = await fetch();
        console.log("isLast", fetchData.islast);
        if (!fetchData.islast) {
          setData(fetchData.data);
        }
        setIsLast(fetchData.islast);
      }
    });

    observer.current.observe(node);
  }, []);

  useEffect(() => {
    // 첫 로드
    (async () => {
      const fetchData = await fetch();
      setData(fetchData.data);
      setIsLast(fetchData.islast);
    })();
  }, []);

  return { ref: lastItemRef, data, isLast };
};

export default UseInfinityObserver;
