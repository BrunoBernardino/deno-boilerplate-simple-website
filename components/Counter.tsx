import React, { useEffect, useState } from 'react';

export default function Counter({ initialValue = 0 }: { initialValue?: number }) {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    window.history.pushState({ count }, '', `/react/${count}`);
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        This button has been clicked {count} time{count === 1 ? '' : 's'}!
      </button>
    </div>
  );
}
