const Skeleton = ({ type }) => {
  if (type === 'article') {
    return (
      <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-white/5 animate-pulse flex flex-col h-full">
        <div className="h-48 bg-white/5 w-full"></div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
          <div className="space-y-2 flex-grow">
            <div className="h-4 bg-white/5 rounded w-full"></div>
            <div className="h-4 bg-white/5 rounded w-5/6"></div>
          </div>
          <div className="h-3 bg-white/5 rounded w-1/4 mt-6"></div>
        </div>
      </div>
    );
  }

  if (type === 'program') {
    return (
      <div className="relative h-72 rounded-2xl overflow-hidden bg-white/5 border border-white/5 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 flex items-center gap-4 w-full pr-12">
          <div className="w-12 h-12 bg-white/10 rounded-lg flex-shrink-0"></div>
          <div className="space-y-2 flex-grow">
            <div className="h-6 bg-white/10 rounded w-2/3"></div>
            <div className="h-3 bg-white/5 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'episode') {
    return (
      <div className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 shadow-lg flex flex-col animate-pulse">
        <div className="aspect-video bg-white/5 w-full"></div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="h-5 bg-white/10 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-white/5 rounded w-full mb-2"></div>
          <div className="h-3 bg-white/5 rounded w-5/6 mb-4"></div>
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/5">
            <div className="h-3 bg-white/5 rounded w-1/4"></div>
            <div className="h-8 bg-white/10 rounded-full w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'poster') {
      return (
          <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 animate-pulse" style={{ aspectRatio: '3/4.5' }}>
               <div className="absolute inset-x-0 bottom-0 p-6 space-y-4">
                   <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                   <div className="h-8 bg-white/10 rounded w-3/4"></div>
               </div>
          </div>
      )
  }

  return <div className="bg-white/5 rounded animate-pulse w-full h-full"></div>;
};

export default Skeleton;
