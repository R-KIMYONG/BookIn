type MenuIconProps = {
  size?: number;
  className?: string;
  onClick: () => void;
};

const BAR = 'origin-left rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(.68,-0.6,.32,1.6)]';

const MenuIcon = ({ size = 20, className, onClick }: MenuIconProps) => {
  const gap = Math.round(size * 0.22); // 간격 = 폭의 22%
  const thickness = Math.max(2, Math.round(size * 0.1)); // 두께 = 폭의 10%, 최소 2px
  const barStyle = { width: size, height: thickness };

  return (
    <button
      type="button"
      aria-label="카테고리 메뉴"
      className={`group flex flex-col items-start ${className ?? ''}`}
      style={{ gap }}
      onClick={onClick}
    >
      <span className={`${BAR} scale-x-100 group-hover:scale-x-[0.6]`} style={barStyle} />
      <span className={`${BAR} delay-75 scale-x-[0.66] group-hover:scale-x-100`} style={barStyle} />
      <span className={`${BAR} delay-150 scale-x-[0.83] group-hover:scale-x-50`} style={barStyle} />
    </button>
  );
};

export default MenuIcon;
