import { QUESTION_BANK } from '@/shared/domain/digging/questionBank';
import { selectQuestions } from '@/shared/domain/digging/selectQuestions';
import DiggingFlow from './_components/DiggingFlow';
import { QUESTIONS_COUNT } from '@/shared/domain/digging/constants';
import { getCurrentUser } from '@/shared/lib/auth/getCurrentUser';

const DiggingPage = async () => {
  const user = await getCurrentUser();

  const questions = selectQuestions({
    quesition: QUESTION_BANK,
    seed: Date.now(),
    options: { count: QUESTIONS_COUNT, dimension: ['mood', 'purpose'] },
  });

  const isLoggedIn = !!user;
  return <DiggingFlow initialQuestions={questions} isLoggedIn={isLoggedIn} />;
};

export default DiggingPage;
