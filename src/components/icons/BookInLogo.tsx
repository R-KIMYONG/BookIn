type BookInLogoProps = { size?: number; className?: string };

export const BookInLogo = ({ size = 46, className }: BookInLogoProps) => {
  const letter: React.CSSProperties = {
    fontFamily: '"Poppins", var(--font-poppins, system-ui), sans-serif',
    fontWeight: 200,
    fontSize: size,
    letterSpacing: '0.01em',
    lineHeight: 1,
  };
  const oH = size * 0.75; // o-클러스터 높이
  const inH = size * 0.57; // In 말풍선 높이

  return (
    <span
      role="img"
      aria-label="BookIn"
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', color: 'currentColor' }}
    >
      <span style={letter}>B</span>

      {/* oo: 두 원 겹침 + 겹친 곳 채팅창 */}
      <svg viewBox="-1 0 46 38" height={oH} style={{ display: 'block', margin: '0 1px' }} aria-hidden="true">
        <circle cx="13" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="31" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <rect x="15" y="10" width="14" height="20" rx="4" fill="currentColor" />
        <path d="M18 16H26M18 20H23M18 24H27" stroke="#AF5858" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <span style={letter}>k</span>

      {/* In 말풍선 */}
      <svg viewBox="0 0 50 46" height={inH} style={{ display: 'block', marginLeft: 3 }} aria-hidden="true">
        <path
          d="M8 3H44A5 5 0 0 1 49 8V25A5 5 0 0 1 44 30H22L11 41V30H8A5 5 0 0 1 3 25V8A5 5 0 0 1 8 3Z"
          fill="currentColor"
        />
        <text
          x="26"
          y="22"
          textAnchor="middle"
          fill="#AF5858"
          style={{ fontFamily: '"Poppins", var(--font-poppins, system-ui), sans-serif', fontWeight: 600 }}
          fontSize="19"
        >
          In
        </text>
      </svg>
    </span>
  );
};
