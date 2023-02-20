interface IQuery {
  id : string
}

export async function fetchCategories() {
  const res = await fetch('/api/cateogries')
  const data = await res.json()

  return data
}
export async function fetchInitalProps(){
  const res = await fetch('/api/cateogries')
  const data = await res.json()

  return data
}
export async function fetchAssets({id}:IQuery) {
  const res = await fetch('/api/assets/categoryId=' + id)
  const data = await res.json()

  return data
}

//testTmdb
//ac53d6d75da27e33c65825f9b41bb633
//https://api.themoviedb.org/3/movie/550?api_key=ac53d6d75da27e33c65825f9b41bb633

export async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json();
  return data;
}

export async function testTmdb(){
  const res = await fetch(
    'https://api.themoviedb.org/3/movie/popular?api_key=ac53d6d75da27e33c65825f9b41bb633&language=en-US&page=1'
  );
  const data = await res.json();
  return data
}