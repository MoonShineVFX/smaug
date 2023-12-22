import { trpc } from '../utils/trpc';

export default function IndexPage() {
  const hello = trpc.hello.useQuery({ text: 'client' });
  const menus = trpc.menus.all.useQuery();
  const categories = trpc.categories.getByName.useQuery({name: 'Project 2019'});
  if (!hello.data || !menus.data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>
        <p>{hello.data.greeting}</p>
      </div>
      <div>
        <p>{menus.data.menus[0].name}</p>
      </div>
      { categories.isSuccess ?
        <div>
          <p>{categories.data.list[0].id}</p>
        </div>
        :
        <div>
          <p>Loading...</p>
        </div>
      }
    </>
  );
}