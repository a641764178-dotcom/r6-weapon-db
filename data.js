// ============================================
// R6S 武器配件数据库 - 数据层
// 版本基准: Y11S1.1 (2026-03-24)
// 分类体系: 主武器7类 + 副武器4类
// ============================================

const ATTACHMENT_DATA = {
    barrels: {
        muzzle_brake: {
            name: '制退器', nameEn: 'Muzzle Brake', slot: 'barrel', icon: '🔧',
            effects: [
                { type: 'positive', label: '首发后坐力减少', value: '-45%' },
                { type: 'positive', label: '回正时间减少', value: '-45%' },
                { type: 'neutral', label: '水平后坐力', value: '不变' },
                { type: 'neutral', label: '伤害', value: '不变' }
            ],
            description: '核心作用是压制第一发子弹的上跳幅度。半自动武器（DMR/手枪）每发都是"首发"，效果最大化。',
            bestFor: '半自动武器、DMR、点射打法'
        },
        compensator: {
            name: '补偿器', nameEn: 'Compensator', slot: 'barrel', icon: '⚙️',
            effects: [
                { type: 'positive', label: '水平后坐力减少', value: '-35%' },
                { type: 'neutral', label: '垂直/首发后坐力', value: '不变' },
                { type: 'neutral', label: '伤害', value: '不变' }
            ],
            description: '水平后坐力是左右随机晃动，玩家几乎无法手动补偿。补偿器直接减少这种随机性，使弹道更集中在垂直线上。',
            bestFor: '全自动高射速武器、长扫射'
        },
        flash_hider: {
            name: '消焰器', nameEn: 'Flash Hider', slot: 'barrel', icon: '🔥',
            effects: [
                { type: 'positive', label: '每发垂直后坐力减少', value: '-15%' },
                { type: 'positive', label: '首发垂直后坐力额外减少', value: '-13%' },
                { type: 'positive', label: '枪口火焰', value: '完全隐藏' },
                { type: 'neutral', label: '伤害', value: '不变' }
            ],
            description: '制退器和补偿器的折中方案，提供全面但不极端的后坐力改善，同时隐藏枪口火焰。',
            bestFor: '万金油选择、中射速自动武器'
        },
        suppressor: {
            name: '消音器', nameEn: 'Suppressor', slot: 'barrel', icon: '🤫',
            effects: [
                { type: 'positive', label: '射击方向标记', value: '完全消除' },
                { type: 'positive', label: '射击声音距离', value: '大幅降低' },
                { type: 'positive', label: '枪口火焰', value: '完全隐藏' },
                { type: 'info', label: '伤害惩罚', value: '无 (Y7S3后)' },
                { type: 'negative', label: '后坐力减少', value: '无' }
            ],
            description: 'Y7S3后消音器不再降低伤害！核心价值是信息战——敌人被命中时不会看到射击来源方向标记。代价是放弃后坐力控制。',
            bestFor: '游走/侧翼干员、隐蔽打法'
        },
        extended_barrel: {
            name: '加长枪管', nameEn: 'Extended Barrel', slot: 'barrel', icon: '📏',
            effects: [
                { type: 'positive', label: '伤害衰减幅度减少', value: '-15~20%' },
                { type: 'neutral', label: '衰减起始距离', value: '不变' },
                { type: 'negative', label: '后坐力减少', value: '无' }
            ],
            description: '数据挖掘确认，加长枪管不会推迟伤害衰减开始距离，实际效果是减少衰减幅度。在中远距离交战中有效保留更多伤害。',
            bestFor: '后坐力可控的中远距离武器'
        }
    },
    grips: {
        vertical_grip: {
            name: '垂直握把', nameEn: 'Vertical Grip', slot: 'grip', icon: '✊',
            effects: [
                { type: 'positive', label: '垂直后坐力减少', value: '~15-20%' },
                { type: 'neutral', label: '腰射精度', value: '略微提升' },
                { type: 'neutral', label: 'ADS速度', value: '不变' }
            ],
            description: '直接减少射击时枪口上跳幅度。效果叠加在枪管配件之上。对后坐力大的武器几乎是刚需。精确百分比从未被官方公布。',
            bestFor: '后坐力大的武器、新手玩家'
        },
        angled_grip: {
            name: '转角握把', nameEn: 'Angled Grip', slot: 'grip', icon: '📐',
            effects: [
                { type: 'positive', label: 'ADS速度加快', value: '-32%' },
                { type: 'neutral', label: '后坐力', value: '不变' }
            ],
            description: '减少32%的ADS时间意味着更快完成瞄准。在围攻"谁先瞄到谁先赢"的节奏中，ADS速度差距可能决定生死。前提是控枪水平足够。',
            bestFor: '后坐力低的武器、高水平玩家'
        }
    },
    underbarrel: {
        laser_sight: {
            name: '激光瞄准器', nameEn: 'Laser Sight', slot: 'underbarrel', icon: '🔴',
            effects: [
                { type: 'positive', label: '腰射扩散减少', value: '~25%' },
                { type: 'negative', label: '副作用', value: '发射可见红色激光点' }
            ],
            description: '只影响不开镜时的射击精度。红色激光点会暴露位置和瞄准方向，但远距离几乎看不到。霰弹枪几乎必装。',
            bestFor: '霰弹枪、冲锋手枪、盾牌干员'
        }
    }
};

// ADS时间基准 + 转角握把效果
const ADS_TIMES = {
    ar:  { base: 400, angled: 272, saved: 128, label: '突击步枪' },
    smg: { base: 300, angled: 204, saved: 96, label: '冲锋枪' },
    lmg: { base: 450, angled: 306, saved: 144, label: '轻机枪' },
    dmr: { base: 450, angled: 306, saved: 144, label: '射手步枪' },
    pistol: { base: 200, angled: 136, saved: 64, label: '手枪' }
};

// 瞄准镜 ADS 灵敏度乘数
const SIGHT_MULTIPLIERS = [
    { mag: '1.0x', multiplier: 1.0 },
    { mag: '1.5x', multiplier: 0.9 },
    { mag: '2.0x', multiplier: 0.8 },
    { mag: '2.5x', multiplier: 0.7 },
    { mag: '3.0x', multiplier: 0.6 },
    { mag: '5.0x', multiplier: 0.4 },
    { mag: '12.0x', multiplier: 0.17 }
];

// ---- 武器分类体系 ----
// 主武器 (Primary)
// ar       = 突击步枪
// smg      = 冲锋枪
// lmg      = 轻机枪
// sniper   = 狙击步枪
// dmr      = 射手步枪
// shotgun  = 霰弹枪
// slug     = 独头霰弹枪
//
// 副武器 (Secondary)
// shotgun_sec = 霰弹枪（次要）
// pistol      = 手枪
// smg_sec     = 冲锋枪（次要）
// revolver    = 左轮手枪

const TYPE_NAMES = {
    // 主武器
    ar: '突击步枪', smg: '冲锋枪', lmg: '轻机枪',
    sniper: '狙击步枪', dmr: '射手步枪', shotgun: '霰弹枪', slug: '独头霰弹枪',
    // 副武器
    shotgun_sec: '霰弹枪(次要)', pistol: '手枪', smg_sec: '冲锋枪(次要)', revolver: '左轮手枪'
};

const WEAPON_CATEGORY = {
    // 主武器类型
    ar: 'primary', smg: 'primary', lmg: 'primary', sniper: 'primary',
    dmr: 'primary', shotgun: 'primary', slug: 'primary',
    // 副武器类型
    shotgun_sec: 'secondary', pistol: 'secondary', smg_sec: 'secondary', revolver: 'secondary'
};

// ---- 完整武器数据库 ----
const WEAPONS = [

    // ============================================================
    //                       主 武 器
    // ============================================================

    // ===== 突击步枪 (AR) =====
    { name: 'M4', type: 'ar', damage: 44, rpm: 750, mag: 30, operators: ['Maverick'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Commando 9', type: 'ar', damage: 36, rpm: 780, mag: 25, operators: ['Mozzie'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'L85A2', type: 'ar', damage: 47, rpm: 670, mag: 30, operators: ['Sledge','Thatcher'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'AR33', type: 'ar', damage: 41, rpm: 749, mag: 25, operators: ['Thatcher'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'G36C', type: 'ar', damage: 38, rpm: 780, mag: 30, operators: ['Ash','Iana'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'R4-C', type: 'ar', damage: 39, rpm: 860, mag: 30, operators: ['Ash'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['angled_grip'] } },
    { name: '556XI', type: 'ar', damage: 47, rpm: 690, mag: 30, operators: ['Thermite','Osa'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'F2', type: 'ar', damage: 37, rpm: 980, mag: 25, operators: ['Twitch','Solid Snake'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] },
      y11s1_new: { grips: ['vertical_grip','angled_grip'] },
      notes: 'Y11S1新增垂直/转角握把' },
    { name: 'AK-12', type: 'ar', damage: 40, rpm: 850, mag: 30, operators: ['Fuze','Ace'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'AUG A2', type: 'ar', damage: 42, rpm: 720, mag: 30, operators: ['IQ','Wamai'], side: 'mixed',
      barrels: ['muzzle_brake','flash_hider','suppressor'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: ['muzzle_brake'], grips: [] } },
    { name: '552 Commando', type: 'ar', damage: 47, rpm: 690, mag: 30, operators: ['IQ'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: '416-C CARBINE', type: 'ar', damage: 38, rpm: 740, mag: 25, operators: ['Jäger'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['angled_grip'] } },
    { name: 'C8-SFW', type: 'ar', damage: 40, rpm: 837, mag: 30, operators: ['Buck'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] },
      notes: 'Skeleton Key占用握把槽' },
    { name: 'Mk17 CQB', type: 'ar', damage: 49, rpm: 585, mag: 20, operators: ['Blackbeard'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'PARA-308', type: 'ar', damage: 48, rpm: 650, mag: 30, operators: ['Capitão'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Type-89', type: 'ar', damage: 40, rpm: 850, mag: 20, operators: ['Hibana'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'C7E', type: 'ar', damage: 46, rpm: 800, mag: 30, operators: ['Jackal'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'M762', type: 'ar', damage: 45, rpm: 730, mag: 30, operators: ['Zofia'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'V308', type: 'ar', damage: 44, rpm: 700, mag: 50, operators: ['Lion'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'Spear .308', type: 'ar', damage: 42, rpm: 700, mag: 30, operators: ['Finka','Thunderbird'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['angled_grip'] } },
    { name: 'AR-15.50', type: 'ar', damage: 62, rpm: 450, mag: 10, operators: ['Maverick'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      notes: '半自动' },
    { name: 'AK-74M', type: 'ar', damage: 44, rpm: 650, mag: 40, operators: ['Nomad'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: '无握把槽' },
    { name: 'ARX200', type: 'ar', damage: 47, rpm: 700, mag: 20, operators: ['Iana','Nomad'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'F90', type: 'ar', damage: 38, rpm: 780, mag: 30, operators: ['Gridlock'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['angled_grip'] } },
    { name: 'SC3000K', type: 'ar', damage: 45, rpm: 780, mag: 25, operators: ['Zero'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'POF-9', type: 'ar', damage: 37, rpm: 740, mag: 30, operators: ['Sens'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'PCX-33', type: 'ar', damage: 37, rpm: 800, mag: 30, operators: ['Solis'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },

    // ===== 冲锋枪 (SMG) =====
    { name: 'FMG-9', type: 'smg', damage: 34, rpm: 800, mag: 30, operators: ['Smoke','Nøkk'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['compensator','extended_barrel'], grips: [] } },
    { name: 'MP5K', type: 'smg', damage: 30, rpm: 800, mag: 30, operators: ['Mute','Wamai'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'UMP45', type: 'smg', damage: 38, rpm: 600, mag: 25, operators: ['Castle','Pulse'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'MP5', type: 'smg', damage: 27, rpm: 800, mag: 30, operators: ['Doc','Rook','Melusi'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['compensator','extended_barrel'], grips: ['angled_grip'] } },
    { name: 'P90', type: 'smg', damage: 22, rpm: 970, mag: 50, operators: ['Doc','Rook'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: [],
      y7s3_new: { barrels: ['compensator'], grips: [] } },
    { name: 'MP5SD', type: 'smg', damage: 30, rpm: 800, mag: 30, operators: ['Echo'], side: 'def',
      barrels: [],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      notes: '内置消音器，无法更换枪管' },
    { name: '9x19VSN', type: 'smg', damage: 34, rpm: 750, mag: 30, operators: ['Kapkan','Tachanka','Azami'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'MP7', type: 'smg', damage: 32, rpm: 900, mag: 30, operators: ['Bandit','Zero','Fenrir'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: '9mm C1', type: 'smg', damage: 36, rpm: 575, mag: 34, operators: ['Frost'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','compensator','flash_hider'], grips: ['vertical_grip'] } },
    { name: 'MPX', type: 'smg', damage: 26, rpm: 830, mag: 30, operators: ['Valkyrie','Warden'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'M12', type: 'smg', damage: 42, rpm: 550, mag: 30, operators: ['Caveira'], side: 'def',
      barrels: ['compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['compensator'], grips: [] } },
    { name: 'PDW9', type: 'smg', damage: 34, rpm: 750, mag: 50, operators: ['Jackal','Osa'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Vector .45', type: 'smg', damage: 23, rpm: 1200, mag: 25, operators: ['Mira','Goyo'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'T-5 SMG', type: 'smg', damage: 28, rpm: 900, mag: 30, operators: ['Lesion','Oryx'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: ['vertical_grip','angled_grip'] } },
    { name: 'Scorpion EVO', type: 'smg', damage: 23, rpm: 1080, mag: 40, operators: ['Ela'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'K1A', type: 'smg', damage: 36, rpm: 720, mag: 30, operators: ['Vigil'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Mx4 Storm', type: 'smg', damage: 26, rpm: 950, mag: 30, operators: ['Alibi'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'AUG A3', type: 'smg', damage: 36, rpm: 700, mag: 30, operators: ['Kaid'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'P10 RONI', type: 'smg', damage: 26, rpm: 980, mag: 15, operators: ['Mozzie'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'UZK50GI', type: 'smg', damage: 36, rpm: 700, mag: 22, operators: ['Thorn'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },

    // ===== 轻机枪 (LMG) =====
    { name: 'M249', type: 'lmg', damage: 48, rpm: 650, mag: 100, operators: ['Capitão'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake'], grips: ['angled_grip'] } },
    { name: '6P41', type: 'lmg', damage: 49, rpm: 680, mag: 100, operators: ['Fuze','Finka'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','compensator'], grips: ['angled_grip'] } },
    { name: 'G8A1', type: 'lmg', damage: 37, rpm: 850, mag: 50, operators: ['IQ','Amaru'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake'], grips: [] } },
    { name: 'T-95 LSW', type: 'lmg', damage: 46, rpm: 650, mag: 80, operators: ['Ying','Flores'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'LMG-E', type: 'lmg', damage: 41, rpm: 720, mag: 150, operators: ['Zofia'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'ALDA 5.56', type: 'lmg', damage: 35, rpm: 900, mag: 80, operators: ['Maestro'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'M249 SAW', type: 'lmg', damage: 44, rpm: 650, mag: 60, operators: ['Gridlock'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','compensator'], grips: ['angled_grip'] } },
    { name: 'DP27', type: 'lmg', damage: 49, rpm: 550, mag: 70, operators: ['Tachanka'], side: 'def',
      barrels: [],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: '仅可装瞄准镜+激光' },

    // ===== 狙击步枪 (Sniper) =====
    { name: 'CSRX 300', type: 'sniper', damage: 127, rpm: 50, mag: 5, operators: ['Kali'], side: 'atk',
      barrels: [],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: '栓动狙击步枪，内置 5x/12x 倍镜' },

    // ===== 射手步枪 (DMR) =====
    { name: '417', type: 'dmr', damage: 69, rpm: 450, mag: 10, operators: ['Twitch','Lion','Sens'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'OTs-03', type: 'dmr', damage: 71, rpm: 380, mag: 10, operators: ['Glaz'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['vertical_grip','angled_grip'] } },
    { name: 'CAMRS', type: 'dmr', damage: 69, rpm: 450, mag: 10, operators: ['Buck'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Skeleton Key占用握把槽' },
    { name: 'SR-25', type: 'dmr', damage: 61, rpm: 450, mag: 20, operators: ['Blackbeard','Flores'], side: 'atk',
      barrels: ['muzzle_brake','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'Mk 14 EBR', type: 'dmr', damage: 60, rpm: 450, mag: 20, operators: ['Dokkaebi','Aruni'], side: 'mixed',
      barrels: ['muzzle_brake','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'PMR90A2', type: 'dmr', damage: 62, rpm: 450, mag: 20, operators: ['Thatcher','Capitão','Nøkk','Solid Snake'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Y11S1新增射手步枪' },

    // ===== 霰弹枪 (Shotgun - 弹丸) =====
    { name: 'M870', type: 'shotgun', damage: 60, rpm: 0, mag: 5, operators: ['Bandit','Jäger'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'M590A1', type: 'shotgun', damage: 48, rpm: 0, mag: 7, operators: ['Smoke','Mute','Thatcher'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'M1014', type: 'shotgun', damage: 34, rpm: 0, mag: 8, operators: ['Thermite','Castle','Pulse'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: '14', type: 'shotgun', damage: 53, rpm: 0, mag: 7, operators: ['Capitão'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'SG-CQB', type: 'shotgun', damage: 53, rpm: 0, mag: 7, operators: ['Doc','Rook'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'SASG-12', type: 'shotgun', damage: 50, rpm: 0, mag: 8, operators: ['Fuze','Finka','Kapkan'], side: 'mixed',
      barrels: [], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SUPER 90', type: 'shotgun', damage: 35, rpm: 0, mag: 8, operators: ['Frost'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SPAS-12', type: 'shotgun', damage: 34, rpm: 0, mag: 7, operators: ['Valkyrie'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'SPAS-15', type: 'shotgun', damage: 30, rpm: 0, mag: 6, operators: ['Caveira'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SuperNova', type: 'shotgun', damage: 55, rpm: 0, mag: 7, operators: ['Echo','Hibana'], side: 'mixed',
      barrels: ['suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'FO-12', type: 'shotgun', damage: 25, rpm: 0, mag: 10, operators: ['Ela'], side: 'def',
      barrels: ['extended_barrel'], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '全自动霰弹枪' },
    { name: 'SIX12', type: 'shotgun', damage: 35, rpm: 0, mag: 6, operators: ['Ying','Lesion'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '左轮式霰弹枪' },
    { name: 'SIX12 SD', type: 'shotgun', damage: 35, rpm: 0, mag: 6, operators: ['Ying','Lesion','Nøkk'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '消音版左轮式霰弹枪' },

    // ===== 独头霰弹枪 (Slug) =====
    { name: 'BOSG.12.2', type: 'slug', damage: 125, rpm: 0, mag: 2, operators: ['Vigil','Dokkaebi'], side: 'mixed',
      barrels: [], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '双管独头弹' },
    { name: 'ACS12', type: 'slug', damage: 69, rpm: 300, mag: 30, operators: ['Maestro','Alibi'], side: 'def',
      barrels: [], grips: ['angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动独头弹' },
    { name: 'TCSG12', type: 'slug', damage: 57, rpm: 450, mag: 10, operators: ['Kaid','Goyo'], side: 'def',
      barrels: ['suppressor'], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动独头弹' },


    // ============================================================
    //                       副 武 器
    // ============================================================

    // ===== 霰弹枪·次要 (Secondary Shotgun) =====
    { name: 'ITA12S', type: 'shotgun_sec', damage: 38, rpm: 0, mag: 5, operators: ['Jackal','Mira','Goyo'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '副武器泵动霰弹枪' },
    { name: 'Super Shorty', type: 'shotgun_sec', damage: 35, rpm: 0, mag: 3, operators: ['Castle','Gridlock','Wamai','Melusi','Lesion'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '副武器短管霰弹枪' },
    { name: 'ITA12S (Frost)', type: 'shotgun_sec', damage: 38, rpm: 0, mag: 5, operators: ['Frost'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '副武器泵动霰弹枪' },

    // ===== 手枪 (Pistol) =====
    { name: '5.7 USG', type: 'pistol', damage: 42, rpm: 0, mag: 20, operators: ['IQ','Ash','Nøkk'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P226 MK 25', type: 'pistol', damage: 50, rpm: 0, mag: 15, operators: ['Sledge','Thatcher'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'M45 MEUSOC', type: 'pistol', damage: 58, rpm: 0, mag: 7, operators: ['Castle','Pulse','Thermite'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P9', type: 'pistol', damage: 45, rpm: 0, mag: 16, operators: ['Doc','Rook','Twitch','Lion','Montagne'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'PMM', type: 'pistol', damage: 61, rpm: 0, mag: 8, operators: ['Fuze','Glaz','Kapkan','Tachanka','Finka'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'GSH-18', type: 'pistol', damage: 44, rpm: 0, mag: 18, operators: ['Fuze','Glaz','Kapkan','Tachanka','Finka'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P12', type: 'pistol', damage: 44, rpm: 0, mag: 15, operators: ['Bandit','Jäger','IQ','Blitz'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Mk1 9mm', type: 'pistol', damage: 48, rpm: 0, mag: 13, operators: ['Buck','Frost'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'D-50', type: 'pistol', damage: 71, rpm: 0, mag: 7, operators: ['Blackbeard','Valkyrie','Nøkk'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '高伤害沙漠之鹰' },
    { name: 'PRB92', type: 'pistol', damage: 42, rpm: 0, mag: 15, operators: ['Capitão','Caveira'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Luison', type: 'pistol', damage: 65, rpm: 0, mag: 12, operators: ['Caveira'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: 'Caveira专属，内置消音器，可审讯倒地敌人' },
    { name: 'P229', type: 'pistol', damage: 51, rpm: 0, mag: 12, operators: ['Hibana','Echo'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Q-929', type: 'pistol', damage: 60, rpm: 0, mag: 10, operators: ['Ying','Lesion'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'RG15', type: 'pistol', damage: 38, rpm: 0, mag: 15, operators: ['Ela','Zofia'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '内置微型红点瞄具' },
    { name: '1911 TACOPS', type: 'pistol', damage: 55, rpm: 0, mag: 8, operators: ['Dokkaebi','Maverick'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: '.44 Mag Semi-Auto', type: 'pistol', damage: 54, rpm: 0, mag: 7, operators: ['Kaid','Nomad'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '高伤害半自动' },
    { name: 'SDP 9mm', type: 'pistol', damage: 47, rpm: 0, mag: 16, operators: ['Gridlock','Mozzie'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P-10C', type: 'pistol', damage: 40, rpm: 0, mag: 15, operators: ['Warden','Clash'], side: 'def',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'GONNE-6', type: 'pistol', damage: 10, rpm: 0, mag: 1, operators: ['Glaz','Dokkaebi','Finka','Iana','Gridlock','Amaru','Flores','Zero','Sens','Lion','Nøkk'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '单发破坏工具，可摧毁防弹设备' },
    { name: 'TACIT .45', type: 'pistol', damage: 52, rpm: 0, mag: 8, operators: ['Solid Snake'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: 'Y11S1新增，内置消音器+反射瞄具' },
    { name: 'Bailiff 410', type: 'pistol', damage: 30, rpm: 0, mag: 5, operators: ['Maestro','Alibi','Oryx','Wamai'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '副武器左轮霰弹枪，主要用于开洞' },

    // ===== 冲锋枪·次要 (Secondary SMG / Machine Pistol) =====
    { name: 'C75 Auto', type: 'smg_sec', damage: 35, rpm: 1000, mag: 26, operators: ['Dokkaebi','Vigil','Thorn'], side: 'mixed',
      barrels: ['compensator','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'SMG-11', type: 'smg_sec', damage: 32, rpm: 1270, mag: 16, operators: ['Smoke','Mute','Sledge','Amaru'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','extended_barrel'], grips: ['angled_grip'] } },
    { name: 'SMG-12', type: 'smg_sec', damage: 28, rpm: 1270, mag: 32, operators: ['Dokkaebi','Vigil','Warden'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor'],
      grips: ['angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'Bearing 9', type: 'smg_sec', damage: 33, rpm: 1100, mag: 25, operators: ['Hibana','Echo','Tachanka'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['muzzle_brake','extended_barrel'], grips: [] } },
    { name: 'SPSMG9', type: 'smg_sec', damage: 33, rpm: 980, mag: 20, operators: ['Kali','Clash'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['muzzle_brake','compensator','extended_barrel'], grips: [] } },
    { name: 'Reaper MK2', type: 'smg_sec', damage: 30, rpm: 900, mag: 20, operators: ['Fenrir','Oryx','Pulse','Rook','Sledge','Ying'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Y10S3 分配给 Oryx/Pulse/Rook/Sledge/Ying' },

    // ===== 左轮手枪 (Revolver) =====
    { name: 'LFP586', type: 'revolver', damage: 78, rpm: 0, mag: 6, operators: ['Doc','Rook','Twitch','Lion','Montagne'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '.357 Magnum 左轮' },
    { name: 'Keratos .357', type: 'revolver', damage: 78, rpm: 0, mag: 6, operators: ['Maestro','Alibi'], side: 'def',
      barrels: ['suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '可装消音器的左轮' },
    { name: 'GONNE-6 Rev', type: 'revolver', damage: 78, rpm: 0, mag: 5, operators: ['Kaid','Nomad'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '.44 Mag 左轮（非半自动版）' }
];

// ---- 官方更新信息 ----
const UPDATES = [
    {
        type: 'patch',
        date: '2026-03-24',
        title: 'Y11S1.1 中期补丁',
        content: '<ul><li><strong>M12 伤害提升</strong>：40 → 42 (Caveira)</li><li><strong>POF-9 伤害提升</strong>：35 → 37 (Sens)</li><li>Flores 遥控炸弹退出延迟 2s → 1s</li><li>Iana 全息复制持续时间 15s → 18s</li><li>Jäger 主动防御冷却 10s → 9s</li><li>Nøkk HEL持续时间 10s → 13s</li><li>Rook 护甲额外HP 20 → 25</li><li>Wamai 磁力激活时间 2s → 1.5s</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/1e0rA6EwYGMNvMTSM9hmTA/y11s11-patch-notes'
    },
    {
        type: 'patch',
        date: '2026-03-03',
        title: 'Y11S1 Operation Silent Hunt — 新赛季',
        content: '<ul><li>🆕 <strong>新干员 Solid Snake</strong>（进攻方3速1血）：主武器 F2/PMR90A2，技能 Soliton Radar + 战场拾取系统</li><li>🔧 <strong>F2 新增握把</strong>：垂直握把、转角握把、水平握把（原仅有垂直握把）</li><li>🆕 <strong>Flores 获得 T-95 LSW</strong> 轻机枪作为额外主武器选项</li><li>🛡️ 盾牌干员无法冲刺穿过未破坏路障</li><li>📍 观察阻断器部署时间 2.5s → 1s</li><li>🗺️ 海岸线/别墅/俄勒冈地图翻新</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'designer',
        date: '2026-02-16',
        title: 'Y11S1 设计师笔记',
        content: '<ul><li><strong>Skopós 重做</strong>：速度 2→3，血量 2→1，切换冷却 3s→0.5s，近战改为Aruni式拳击</li><li><strong>F2 配件扩展</strong>：新增垂直/转角/水平握把，提升操控性（影响 Twitch、Solid Snake）</li><li><strong>Flores</strong>：新增 T-95 LSW 轻机枪选项</li><li><strong>Ela</strong>：Grzmot 震荡持续时间 7s→9s</li><li><strong>Amaru</strong>：Garra Hook 次数 4→5</li><li><strong>Ying</strong>：Candela 闪光时间 1.4s→1.6s</li><li><strong>Alibi</strong>：Prisma 最后 Ping 不再提前消失</li></ul>',
        link: 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/news-updates/5fWCjoCU8toUJiBdMSj0UA/y11s1-designers-notes'
    },
    {
        type: 'balance',
        date: '2026-01',
        title: 'Y10S4.2 平衡调整',
        content: '<ul><li>Thorn 干员平衡调整</li><li>Bug 修复和质量优化</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'patch',
        date: '2025-12',
        title: 'Y10S4.1 — 肢体伤害回滚',
        content: '<ul><li><strong>肢体伤害回滚</strong>：恢复围攻X之前的肢体伤害倍率</li><li>社区长达数月的呼吁终于得到回应</li><li>间接削弱盾牌干员（四肢受伤恢复正常意味着盾牌暴露的四肢更脆弱）</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'designer',
        date: '2025-09',
        title: 'Y10S3 Operation High Stakes — 武器配件重大变更',
        content: '<ul><li>🔴 <strong>防守方倍镜全面移除</strong>：所有防守方自动武器不再可装备 >1x 放大倍镜</li><li>🔴 <strong>Blackbeard 全面削弱</strong>：MK17弹匣25→20，ADS恢复0.5s→0.9s</li><li>🟢 <strong>Reaper MK2 强化并分发</strong>：分配给 Oryx/Pulse/Rook/Sledge/Ying</li><li>🔄 副武器霰弹枪重新分配：Fenrir失去Bailiff 410，Wamai获得Super Shorty</li><li>🛡️ 盾牌干员投掷手雷时盾牌不再提供保护</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'patch',
        date: '2025-06',
        title: 'Y10S2 围攻X — 十周年大改',
        content: '<ul><li><strong>肢体伤害削弱</strong>：命中手臂和腿部的伤害降低（后于Y10S4.1回滚）</li><li>游戏整体翻新：UI、排名系统、地图等全方位更新</li><li>对武器手感和战斗节奏产生深远影响</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    },
    {
        type: 'designer',
        date: '2022-08',
        title: 'Y7S3 — 配件系统大重做（里程碑）',
        content: '<ul><li>✅ <strong>消音器移除伤害惩罚</strong></li><li>✅ <strong>全武器垂直后坐力上调</strong>（PC端）</li><li>✅ 大量武器获得新枪管/握把/瞄准镜选项</li><li>✅ 激光瞄准器全面普及</li><li>核心理念：增加后坐力，让枪管配件选择变成有意义的策略决策</li></ul>',
        link: 'https://www.ubisoft.com/game/rainbow-six/siege/news-updates'
    }
];
