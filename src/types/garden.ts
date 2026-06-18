/** 造园要素详情段落 */
export interface GardenElementSection {
  title: string
  content: string
}

/**
 * 造园要素
 * - id: 唯一标识，用于路由跳转与收藏判断
 * - name: 要素名称
 * - category: 所属分类（如"取景技法""空间处理""植物配置""水景要素"）
 * - desc: 简要说明，用于列表页与相关推荐卡片展示
 * - image: 封面图路径
 * - sections: 详细说明段落列表
 */
export interface GardenElement {
  id: string
  name: string
  category: string
  desc: string
  image: string
  sections: GardenElementSection[]
}

/** 相关要素推荐项（GardenElement 的精简视图，用于推荐卡片） */
export type RelatedElementItem = Pick<GardenElement, 'id' | 'name' | 'desc' | 'category'>

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
