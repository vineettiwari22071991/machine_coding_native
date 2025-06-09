type MovieItem = {
  id: number,
  original_title: string,
  overview: string,
  popularity: string,
  poster_path: string,
  release_date: string,
  title: string
}

type ApiState<T> = {
    data: T | null,
    loading: boolean,
    error: string,
    fetchData: (...args: any[]) => Promise<void>
}