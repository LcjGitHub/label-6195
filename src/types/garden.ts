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
