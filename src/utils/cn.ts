const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' '); //className Merge용 함수 추후 clsx로 변경 시도 예정


export default cn