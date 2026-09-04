import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import DiggingFlow from '../DiggingFlow';
import { DiggingQuestion } from '@/shared/domain/digging/questionBank';
import userEvent from '@testing-library/user-event';

const mockQuestions: DiggingQuestion[] = [
  {
    id: 'q1',
    dimension: 'mood',
    prompt: '오늘 기분은?',
    options: [
      { id: 'a', label: '좋아요', signal: '긍정' },
      { id: 'b', label: '별로예요', signal: '부정' },
    ],
  },
  {
    id: 'q2',
    dimension: 'purpose',
    prompt: '지금 채우고 싶은 결핍은?',
    options: [
      { id: 'a', label: '마음의 위안', signal: '정서적 결핍·위로' },
      { id: 'b', label: '지적인 자극', signal: '앎·사고의 갈증' },
      { id: 'c', label: '짜릿한 재미', signal: '자극·오락 결핍' },
      { id: 'd', label: '삶의 방향', signal: '의미·동기·나침반' },
    ],
  },
  {
    id: 'q3',
    dimension: 'reality',
    prompt: '읽고 싶은 세계관은?',
    options: [
      { id: 'a', label: '현실 그대로', signal: '현실·일상·리얼리즘' },
      { id: 'b', label: '살짝 비튼 평행세계', signal: 'SF·대체현실·상상' },
      { id: 'c', label: '아득한 먼 미래', signal: 'SF·미래·문명' },
      { id: 'd', label: '완전한 이세계', signal: '판타지·세계관·모험' },
    ],
  },
  {
    id: 'q4',
    dimension: 'tempo',
    prompt: '선호하는 챕터 길이는?',
    options: [
      { id: 'a', label: '짧게 뚝뚝 끊기는', signal: '짧은 호흡·틈새 독서' },
      { id: 'b', label: '적당한 호흡', signal: '표준·균형' },
      { id: 'c', label: '길고 깊게 이어지는', signal: '몰입·밀도·장편' },
    ],
  },
  {
    id: 'q5',
    dimension: 'situation',
    prompt: '지금 감당할 수 있는 두께는?',
    options: [
      { id: 'a', label: '앉은자리에서 끝나는 얇은 책', signal: '단편·에세이·짧은 분량' },
      { id: 'b', label: '적당히 며칠 걸리는 책', signal: '표준 분량·부담 없는 장편' },
      { id: 'c', label: '두껍고 깊게 파고드는 책', signal: '대작·심층·장기 몰입' },
    ],
  },
];

describe('DiggingFlow컨포넌트 UI Test', () => {
  // 1.디깅페이지에서 문제 제대로 로딩됬는지 보고
  // 2.답을 클릭하면 다음문제로 가는지?
  // 3.이전 누르면 이전 문제로 가는지?
  // 4.답을 선택하면 활성화되는지 이전할때도 활성화 되는지?

  beforeEach(() => {
    localStorage.clear();
  });
  it('DiggingFlow 화면 렌더 테스트', () => {
    render(<DiggingFlow initialQuestions={mockQuestions} isLoggedIn={false} />);

    expect(screen.getByText('오늘 기분은?')).toBeInTheDocument(); //문제 렌더여부
    expect(screen.getByText('좋아요')).toBeInTheDocument(); //답  렌더여부
    expect(screen.getByText('1')).toBeInTheDocument(); // 진행바 1인지
  });
  it('DiggingFlow 답을 클릭 시 다음문제로 이동여부 테스트', async () => {
    const user = userEvent.setup();
    render(<DiggingFlow initialQuestions={mockQuestions} isLoggedIn={false} />);

    await user.click(screen.getByText('좋아요'));

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('지금 채우고 싶은 결핍은?')).toBeInTheDocument();
    });
  });
  it('이전 누르면 이전 문제로 가는지?', async () => {
    const user = userEvent.setup();
    render(<DiggingFlow initialQuestions={mockQuestions} isLoggedIn={false} />);

    await user.click(screen.getByText('좋아요'));

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('이전 질문'));

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });
  it('답을 선택하면 활성화되는지 이전할때도 활성화 되는지?', async () => {
    const user = userEvent.setup();
    render(<DiggingFlow initialQuestions={mockQuestions} isLoggedIn={false} />);

    await user.click(screen.getByText('좋아요'));

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    expect(screen.getByText('2')).toBeInTheDocument(); // 현재 문제2로 넘어옴

    await user.click(screen.getByLabelText('이전 질문'));

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    expect(screen.getByText('다음')).toBeInTheDocument();
  });
});
