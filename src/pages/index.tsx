import DefaultHead from '@/components/defaultHead';
import Title from '@/components/title';
import Shortner from '@/layouts/shortner';

export default function Home() {
  return (
    <>
      <DefaultHead />
      <Title title="Generate your short url" />
      <Shortner />
    </>
  );
}
