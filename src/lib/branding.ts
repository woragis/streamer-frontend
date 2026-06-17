import type { BrandingState } from '@/stores/types'

export type BrandDomain = 'codes' | 'calisthenics'

export function brandingHandle(branding: BrandingState, domain: BrandDomain): string {
  if (domain === 'codes') {
    return branding.codesHandle || branding.handle || '@WoragisCodes'
  }
  return branding.calisthenicsHandle || branding.handle || '@WoragisCalisthenics'
}

export function normalizeBranding(branding: Partial<BrandingState>): BrandingState {
  const legacy = branding.handle ?? '@WoragisCodes'
  return {
    codesHandle: branding.codesHandle ?? legacy,
    calisthenicsHandle: branding.calisthenicsHandle ?? '@WoragisCalisthenics',
    handle: legacy,
    brandTitle: branding.brandTitle ?? 'LEETCODE LIVE',
    motto: branding.motto ?? 'FOCUS • DISCIPLINE • CONSISTENCY',
    calisthenicsMotto: branding.calisthenicsMotto ?? 'DISCIPLINE TODAY FREEDOM TOMORROW',
    schedule: branding.schedule ?? '',
    social: {
      discord: branding.social?.discord ?? '',
      twitter: branding.social?.twitter ?? '',
      youtube: branding.social?.youtube ?? '',
      kick: branding.social?.kick ?? '',
    },
  }
}
