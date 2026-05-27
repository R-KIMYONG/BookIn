import ResetPasswordPage from './_components/ResetPasswordPage';

type PageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};
const page = async ({ searchParams }: PageProps) => {
  const { token } = await searchParams;
  return <ResetPasswordPage token={token ?? ''} />;
};

export default page;
