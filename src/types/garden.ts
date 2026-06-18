/** 造园要素详情段落 */
export interface GardenElementSection {
  title: string
  content: string
}

/** 造园要素 */
export interface GardenElement {
  id: string
  name: string
  category: string
  desc: string
  image: string
  sections: GardenElementSection[]
}

/** 分类选项 */
export type GardenCategory = '全部' | string

/** 江南名园 */
export interface FamousGarden {
  id: string
  name: string
  city: string
  description: string
  techniqueIds: string[]
  image: string
}

/** 对照选中项 */
export type CompareSlot = 'left' | 'right'

/** 对照状态 */
export interface CompareState {
  leftId: string | null
  rightId: string | null
}

/** 对比表格行 */
export interface CompareTableRow {
  title: string
  leftContent: string | null
  rightContent: string | null
}
