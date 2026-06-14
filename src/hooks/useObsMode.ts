import { useSearch } from '@tanstack/react-router'

export function useObsMode(): boolean {
  const search = useSearch({ strict: false }) as { obs?: string | boolean }
  return search.obs === '1' || search.obs === true || search.obs === 'true'
}
