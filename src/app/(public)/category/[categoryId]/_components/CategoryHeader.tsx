import { CategoryNode } from '@/shared/domain/category/types';
import CategoryDropdown from './CategoryDropdown';
import CategoryChips from './CategoryChips';

type CategoryHeaderProps = {
  tree: CategoryNode[];
  path: CategoryNode[];
};

// 클라이언트 컴포넌트에는 화면에 필요한 값만 전달 (children까지 넘기면 소분류가 HTML에 포함됨)
const toOptions = (nodes: CategoryNode[]) => nodes.map(({ id, name }) => ({ id, name }));

const CategoryHeader = ({ tree, path }: CategoryHeaderProps) => {
  const [mall, mid, small] = path;
  const chips = mid ? mid.children : mall.children;

  return (
    <header className="flex flex-col gap-2">
      <nav aria-label="카테고리 경로" className="-ml-1 flex items-center gap-1">
        <CategoryDropdown current={mall} options={toOptions(tree)} />
        {mid && (
          <>
            <span aria-hidden="true" className="text-sm text-gray-300">
              ›
            </span>
            <CategoryDropdown current={mid} options={toOptions(mall.children)} />
          </>
        )}
      </nav>
      <h1 className="sr-only">{path[path.length - 1].name}</h1>
      {chips.length > 0 && <CategoryChips chips={toOptions(chips)} allId={mid?.id} activeId={small?.id ?? mid?.id} />}
    </header>
  );
};

export default CategoryHeader;
