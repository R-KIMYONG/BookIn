import { QUESTION_BANK } from '@/shared/domain/digging/questionBank';
import { selectQuestions } from '@/shared/domain/digging/selectQuestions';
import DiggingFlow from './_components/DiggingFlow';
import { QUESTIONS_COUNT } from '@/shared/domain/digging/constants';
import { createClient } from '@/shared/lib/supabase/server';

const DiggingPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const questions = selectQuestions({
    quesition: QUESTION_BANK,
    seed: Date.now(),
    options: { count: QUESTIONS_COUNT, dimension: ['mood', 'purpose'] },
  });

  const isLoggedIn = !!user;
  return <DiggingFlow initialQuestions={questions} isLoggedIn={isLoggedIn}/>;
};

export default DiggingPage;
