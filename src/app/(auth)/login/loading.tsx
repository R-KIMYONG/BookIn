const Bar = ({ className }: { className: string }) => <div className={`rounded-xl bg-gray-100 ${className}`} />;

const Loading = () => (
  <div className="min-h-[calc(100vh-3rem)] bg-[#f6f5f7] overflow-hidden flex items-center justify-center px-4">
    <div className="w-full max-w-[420px]">
      <div
        className="rounded-2xl bg-white shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] ring-1 ring-black/5 p-6 sm:p-7 animate-pulse"
        aria-busy="true"
        aria-label="로그인 화면 불러오는 중"
      >
        {/* Email / Password: 라벨 + 입력칸 */}
        <Bar className="mb-1.5 h-4 w-12" />
        <Bar className="mb-3 h-[46px] w-full" />
        <Bar className="mb-1.5 h-4 w-16" />
        <Bar className="h-[46px] w-full" />
        {/* 로그인 유지 / 비밀번호 찾기 */}
        <div className="my-5 flex justify-between">
          <Bar className="h-4 w-24" />
          <Bar className="h-4 w-28" />
        </div>
        {/* 로그인 버튼 */}
        <Bar className="h-10 w-full" />
        {/* OR 구분선: 실제와 같은 마크업 그대로 */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-[11px] font-semibold text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        {/* 소셜 로그인: 44px 원 3개 */}
        <div className="mt-2 flex justify-center gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-11 w-11 rounded-full bg-gray-100" />
          ))}
        </div>
        {/* 회원가입 안내 */}
        <Bar className="mx-auto mt-6 h-4 w-40" />
      </div>
      {/* 하단 안내: 고정 문구라 실제 텍스트 그대로 */}
      <p className="mt-6 text-center text-[11px] text-gray-400">
        로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
      </p>
    </div>
  </div>
);

export default Loading;
