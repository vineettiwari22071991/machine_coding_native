import { useCallback, useState } from "react";

export function useApi<T>(
    apiFunc:(...args: any[])=>Promise<T>
): ApiState<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")


    const fetchData = useCallback(
        async (...args: any[]) => {
          setLoading(true)
          setError("")
          try{
            const result = await apiFunc(...args)
            setData(result)
          }catch(err: any){
            setError(err.message || "Something went wrong")

          }finally{
            setLoading(false)
          }
        },[apiFunc]
    )

    return {data, loading, error, fetchData}
}