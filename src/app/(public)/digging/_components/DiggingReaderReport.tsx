import { DiggingReader } from '@/shared/domain/digging/types';
import { LibraryBig, MessageSquareQuote, Sparkles } from 'lucide-react';

const DiggingReaderReport = ({ reader }: { reader: DiggingReader | null }) => {
  return (
    <div className="w-full max-w-md  p-6 sm:p-8 flex flex-col gap-6 items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-main/10">
        <Sparkles className="h-6 w-6 text-main" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-xs text-gray-500">당신은</h3>
        <p className="text-sm font-bold leading-relaxed ">{reader?.readerType}</p>
      </div>
      <ul className="flex flex-wrap justify-center gap-2">
        {reader?.moodTags.map((m, i) => (
          <li key={i} className="rounded-full bg-main bg-opacity-30 text-main px-3 py-1.5 text-xs font-medium">
            {m.split(',')[0].trim()}
          </li>
        ))}
      </ul>
      <p className="text-xs">{reader?.reason}</p>
      <div className="bg-main bg-opacity-30 flex items-start gap-2 p-3 rounded-md">
        <MessageSquareQuote className="text-main" />
        <p className="text-xs text-main">{reader?.searchQuery}</p>
      </div>

      <div className="w-full flex flex-col items-center gap-1">
        <div className="flex items-center w-full justify-between">
          <div className="h-[1px] flex-1 bg-gray-200" />
          <div className="flex items-center justify-center gap-2 px-3">
            <LibraryBig size={15} className="text-main" />
            <p className="text-xs whitespace-nowrap">당신을 위해 파낸 Book</p>
          </div>
          <div className="h-[1px] flex-1 bg-gray-200" />
        </div>
        <div className="flex text-xs text-gray-400">
          <p>{reader?.categories.join(' • ')}에서 골랐어요</p>
        </div>
      </div>
    </div>
  );
};

export default DiggingReaderReport;
