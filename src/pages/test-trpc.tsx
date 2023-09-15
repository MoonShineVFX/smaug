import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const hello = trpc.hello.useQuery({ text: 'client' });
  const menus = trpc.menu.all.useQuery();
  if (!hello.data||!menus.data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>
        <p>{hello.data.greeting}</p>
      </div>
      <div>
        <p>{menus.data.list[0].name}</p>
      </div>
    </>
  );
}