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

// ---- 武器详细档案 ----
// 数据来源: Fandom Wiki / R6灰机Wiki / Ubisoft官方
const WEAPON_DETAILS = {
    // ===== 突击步枪 =====
    'M4': {
        realName: 'Remington R4',
        caliber: '5.56x45mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Remington Arms',
        trivia: [
            '游戏内模型基于 Remington R4（非军用 M4 卡宾枪），可从枪身刻印和无前托设计区分。',
            'Maverick 是唯一可以使用该武器的干员，他的背景设定为在阿富汗长期独立行动的 Delta Force 队员。'
        ]
    },
    'Commando 9': {
        realName: 'CAA RONI Glock Carbine Kit',
        caliber: '9x19mm Parabellum',
        country: '🇮🇱 以色列',
        manufacturer: 'CAA Industries',
        trivia: [
            '游戏中名为"Commando 9"，实际原型为 CAA RONI 套件——一种可将 Glock 手枪转换为卡宾枪的转换架。',
            '虽然归类为突击步枪但发射 9mm 手枪弹，这解释了其较低的 36 点基础伤害。'
        ]
    },
    'L85A2': {
        realName: 'SA80 L85A2',
        caliber: '5.56x45mm NATO',
        country: '🇬🇧 英国',
        manufacturer: 'Royal Small Arms Factory / H&K',
        trivia: [
            '原型 L85A1 因可靠性问题臭名昭著（故障率极高），后由 H&K 德国公司全面翻新为 A2 版本。',
            '这是英国军队的标准制式步枪，采用犊牛式布局，弹匣在扳机后方。',
            'Sledge 和 Thatcher 均来自英国 SAS，与该武器的英军背景一致。'
        ]
    },
    'AR33': {
        realName: 'H&K HK33',
        caliber: '5.56x45mm NATO',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'HK33 是 G3 步枪的 5.56mm 版本，采用相同的滚柱延迟闭锁机构。',
            '是 Thatcher 的备选步枪，现实中 SAS 并不常规使用此武器。'
        ]
    },
    'G36C': {
        realName: 'H&K G36C',
        caliber: '5.56x45mm NATO',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'G36C 是 G36 突击步枪的紧凑版本，"C"代表 Compact。缩短的枪管和折叠枪托使其适合 CQB。',
            '现实中被德国 GSG-9、西班牙 GEO 和多个北约特种部队使用。'
        ]
    },
    'R4-C': {
        realName: 'Remington R4',
        caliber: '5.56x45mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Remington Arms',
        trivia: [
            '后缀"-C"代表 Compact，是 R4 的短管版本。Ash 的标志性武器，以高射速和极佳的手感著称。',
            '曾一度被认为是进攻方最强突击步枪之一，因此多次被削弱（移除 ACOG、调整后坐力）。'
        ]
    },
    '556XI': {
        realName: 'SIG Sauer 556xi',
        caliber: '5.56x45mm NATO',
        country: '🇨🇭 瑞士 / 🇺🇸 美国',
        manufacturer: 'SIG Sauer',
        trivia: [
            'SIG 556xi 是一种模块化步枪，可以通过更换枪管和弹匣适配器切换口径（5.56mm / 7.62x39mm / .300 BLK）。',
            '"xi"代表该系列的最新迭代版本，修复了早期 SIG 556 的一些可靠性问题。'
        ]
    },
    'F2': {
        realName: 'FAMAS F1/G2',
        caliber: '5.56x45mm NATO',
        country: '🇫🇷 法国',
        manufacturer: 'GIAT Industries (Nexter)',
        trivia: [
            'FAMAS 绰号"Le Clairon"（军号），是法国军队的标准制式步枪（已被 HK416F 替代）。',
            '以 980 RPM 的超高射速著称，是游戏中射速最高的突击步枪之一，理论 DPS 极高。',
            '采用独特的杠杆延迟闭锁系统，在军用步枪中非常少见。'
        ]
    },
    'AK-12': {
        realName: 'AK-12 (2018 production model)',
        caliber: '5.45x39mm',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            'AK-12 是 AK 系列的现代化版本，2018 年被俄军正式列装。保留了 AK 经典的长行程活塞导气系统。',
            '游戏中的模型更接近早期原型（带四面皮卡汀尼导轨），而非最终量产版。'
        ]
    },
    'AUG A2': {
        realName: 'Steyr AUG A2',
        caliber: '5.56x45mm NATO',
        country: '🇦🇹 奥地利',
        manufacturer: 'Steyr Mannlicher',
        trivia: [
            'AUG（Armee-Universal-Gewehr，"军队通用步枪"）是世界上最成功的犊牛式步枪之一。',
            '奥地利军队自 1978 年起列装，至今仍在使用。在游戏中分配给同为 GSG-9（德国）的 IQ。'
        ]
    },
    '552 Commando': {
        realName: 'SIG SG 552 Commando',
        caliber: '5.56x45mm NATO',
        country: '🇨🇭 瑞士',
        manufacturer: 'SIG Sauer (Swiss Arms)',
        trivia: [
            'SG 552 是 SG 550 突击步枪的紧凑卡宾版本，枪管长度从 528mm 缩短至 226mm。',
            '在多个特种部队中服役，因其在紧凑尺寸下依然保持的高精度而受到好评。'
        ]
    },
    '416-C CARBINE': {
        realName: 'H&K HK416C',
        caliber: '5.56x45mm NATO',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'HK416C 是 HK416 的超短版本，最初为特种部队设计。采用短行程活塞系统，比 M4 更可靠。',
            'Jäger 作为德国 GSG-9 成员使用此武器在设定上合理——GSG-9 实际装备 HK416。',
            'HK416 的标准版本于 2011 年被美国海军海豹突击队用于击毙本·拉登的行动中。'
        ]
    },
    'C8-SFW': {
        realName: 'Colt Canada C8 SFW',
        caliber: '5.56x45mm NATO',
        country: '🇨🇦 加拿大',
        manufacturer: 'Colt Canada',
        trivia: [
            'C8 SFW（Special Forces Weapon）是加拿大特种部队专用版本，配有重枪管以提高持续射击能力。',
            'Buck 无法使用握把配件，因为下挂的 Skeleton Key（M26 MASS 霰弹枪模块）占用了握把导轨。'
        ]
    },
    'Mk17 CQB': {
        realName: 'FN SCAR-H CQC',
        caliber: '7.62x51mm NATO',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            'SCAR-H（Heavy）发射 7.62mm 全威力步枪弹，CQC 版本采用缩短枪管以适应近距离作战。',
            '高伤害低射速的特性反映了 7.62mm 的大口径子弹特点。',
            '现实中主要装备美军特种作战司令部（USSOCOM）。'
        ]
    },
    'PARA-308': {
        realName: 'FN FAL PARA',
        caliber: '7.62x51mm NATO',
        country: '🇧🇪 比利时 / 🇧🇷 巴西',
        manufacturer: 'FN Herstal / IMBEL',
        trivia: [
            'FAL（Fusil Automatique Léger，"轻型自动步枪"）绰号"自由世界的右臂"，冷战期间被 90 多个国家采用。',
            'PARA 版本配有折叠枪托，最初为伞兵设计。巴西版由 IMBEL 授权生产。',
            'Capitão 作为巴西 BOPE 成员使用此武器非常契合——巴西军警大量使用 FAL 系列。'
        ]
    },
    'Type-89': {
        realName: '89式 5.56mm 小銃',
        caliber: '5.56x45mm NATO',
        country: '🇯🇵 日本',
        manufacturer: '豊和工業 (Howa)',
        trivia: [
            '89 式步枪是日本自卫队的现役制式步枪，由丰和工业制造。仅 20 发弹匣是游戏平衡考虑。',
            '由于日本武器出口限制，89 式几乎不可能在日本以外见到，使其成为游戏中最"稀有"的真实武器之一。'
        ]
    },
    'C7E': {
        realName: 'Colt Canada C7',
        caliber: '5.56x45mm NATO',
        country: '🇨🇦 加拿大',
        manufacturer: 'Colt Canada',
        trivia: [
            'C7 是加拿大版的 M16A2，带有一些本土改进。"E"可能代表某种电子光学版本。',
            '被誉为攻方最平衡的突击步枪之一——46 伤害配 800 射速提供极佳的 DPS。'
        ]
    },
    'M762': {
        realName: 'FB Beryl M762',
        caliber: '7.62x39mm M43',
        country: '🇵🇱 波兰',
        manufacturer: 'FB Radom',
        trivia: [
            'Beryl 是波兰基于 AK 平台自主研发的突击步枪，名字来源于绿宝石矿物 Beryl。',
            'M762 是出口型号，发射 7.62x39mm 弹药，而波兰军队标准型号发射 5.56mm NATO。',
            'Zofia 作为波兰 GROM 成员使用此武器完美契合背景设定。'
        ]
    },
    'V308': {
        realName: 'KRISS Vector (虚构改型)',
        caliber: '7.62x51mm NATO (游戏设定)',
        country: '🇺🇸 美国',
        manufacturer: 'KRISS USA (虚构版)',
        trivia: [
            'V308 是游戏虚构武器——现实中不存在 7.62mm NATO 口径的 KRISS Vector。',
            '50 发弹匣 + 全威力步枪弹的组合在现实中会导致武器过重、后坐力难以控制。',
            '名字中的"V"来自 Vector，"308"指 .308 Winchester（7.62x51mm 的民用名称）。'
        ]
    },
    'Spear .308': {
        realName: 'SIG MCX Spear',
        caliber: '.277 SIG Fury / 7.62x51mm (游戏设定 .308)',
        country: '🇺🇸 美国',
        manufacturer: 'SIG Sauer',
        trivia: [
            '现实中 SIG MCX Spear 赢得了美军 NGSW（Next Generation Squad Weapon）竞标，被命名为 XM7。',
            '原型设计使用全新的 .277 SIG Fury 弹药（6.8x51mm），具有比传统 5.56mm 更远的有效射程和更强的穿甲能力。',
            '游戏中命名为".308"是简化处理——实际口径设定并不完全准确。'
        ]
    },
    'AR-15.50': {
        realName: 'Beowulf AR-15 (.50 Beowulf)',
        caliber: '.50 Beowulf',
        country: '🇺🇸 美国',
        manufacturer: 'Alexander Arms',
        trivia: [
            '.50 Beowulf 是一种大口径 AR-15 平台弹药，专为近距离高停止力设计。',
            '10 发弹匣和半自动模式反映了大口径弹药的实际限制——后坐力太大不适合全自动。',
            '62 点基础伤害是突击步枪中最高的。'
        ]
    },
    'AK-74M': {
        realName: 'AK-74M',
        caliber: '5.45x39mm',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            'AK-74M 是 AK-74 的现代化版本，"M"代表 Modernized。采用聚合物折叠枪托和导轨系统。',
            '无握把槽是平衡考虑——该武器拥有 40 发大弹匣。'
        ]
    },
    'ARX200': {
        realName: 'Beretta ARX200',
        caliber: '7.62x51mm NATO',
        country: '🇮🇹 意大利',
        manufacturer: 'Beretta',
        trivia: [
            'ARX200 是 ARX160 的放大版本，发射 7.62mm NATO 弹药，设计为班用自动武器/精确射手角色。',
            '具有模块化设计，可快速更换枪管组件以适应不同战术需求。'
        ]
    },
    'F90': {
        realName: 'Thales F90',
        caliber: '5.56x45mm NATO',
        country: '🇦🇺 澳大利亚',
        manufacturer: 'Thales Australia',
        trivia: [
            'F90 是 Steyr AUG 的澳大利亚现代化版本，由 Thales 澳大利亚分公司开发。',
            '2016 年被澳大利亚国防军选为 F88 Austeyr 的替代品，是该国最新的制式步枪。',
            'Gridlock 作为 SASR（澳大利亚特种空勤团）成员使用此武器完全合理。'
        ]
    },
    'SC3000K': {
        realName: 'FN FNC (改型)',
        caliber: '5.56x45mm NATO',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            '游戏中的 SC3000K 外观高度接近 FN FNC，但名称是虚构的。',
            'Zero（Sam Fisher）在彩虹六号与细胞分裂联动中带来了这把武器，呼应了 FN 在美国特战圈的广泛使用。'
        ]
    },
    'POF-9': {
        realName: 'POF-9 (Pakistan Ordnance Factories)',
        caliber: '9x19mm Parabellum',
        country: '🇵🇰 巴基斯坦',
        manufacturer: 'Pakistan Ordnance Factories',
        trivia: [
            'POF-9 是巴基斯坦军工厂生产的冲锋枪/卡宾枪，虽然归类为突击步枪但发射 9mm 弹药。',
            '是 Sens 的主武器，37 伤害的低数值反映了 9mm 口径的特性。'
        ]
    },
    'PCX-33': {
        realName: '虚构武器',
        caliber: '9x19mm Parabellum (推测)',
        country: '🇨🇴 哥伦比亚 (设定)',
        manufacturer: '虚构',
        trivia: [
            'PCX-33 没有明确的现实原型，外观融合了多种现代冲锋枪/卡宾枪的设计元素。',
            '作为 Solis 的武器引入，Solis 来自哥伦比亚。'
        ]
    },

    // ===== 冲锋枪 =====
    'FMG-9': {
        realName: 'Magpul FMG-9',
        caliber: '9x19mm Parabellum',
        country: '🇺🇸 美国',
        manufacturer: 'Magpul Industries',
        trivia: [
            'FMG-9（Folding Machine Gun-9）可以折叠成一个类似手电筒的长方体，展开后成为功能完整的冲锋枪。',
            '该武器是概念原型，从未量产。基于 Glock 18 机匣，使用 Glock 弹匣。'
        ]
    },
    'MP5K': {
        realName: 'H&K MP5K',
        caliber: '9x19mm Parabellum',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'MP5K（K = Kurz，德语"短"）是 MP5 的超紧凑版本，枪管仅 115mm。',
            '专为 VIP 保护和隐蔽携带设计，可以放入公文包射击（配合特殊公文包装置）。'
        ]
    },
    'UMP45': {
        realName: 'H&K UMP45',
        caliber: '.45 ACP',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'UMP（Universal Machine Pistol）是 MP5 的低成本继任者，大量使用聚合物材料降低成本和重量。',
            '.45 ACP 弹药使其拥有较高的单发伤害（38）但射速较低（600 RPM），与现实特性一致。'
        ]
    },
    'MP5': {
        realName: 'H&K MP5A2',
        caliber: '9x19mm Parabellum',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'MP5 可能是世界上最著名的冲锋枪，自 1966 年问世以来被超过 40 个国家的军警采用。',
            '采用独特的滚柱延迟闭锁系统（源自 G3 步枪），射击精度远超同类吹回式冲锋枪。',
            '1980 年伊朗大使馆人质事件中 SAS 使用 MP5 突入的画面让这把枪一夜成名。'
        ]
    },
    'P90': {
        realName: 'FN P90',
        caliber: '5.7x28mm',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            'P90 采用革命性的顶部水平弹匣设计，50 发弹匣水平放置在枪身上方。',
            '5.7x28mm 弹药专为穿透软质护甲设计，这也是 NATO 要求开发此弹药的原因。',
            '因其未来感的外形在科幻影视中大量出镜，最著名的是《星际之门》系列。'
        ]
    },
    'MP5SD': {
        realName: 'H&K MP5SD',
        caliber: '9x19mm Parabellum',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'MP5SD 的"SD"代表 Schalldämpfer（德语"消音器"），拥有一体化消音枪管。',
            '枪管上有30个小孔将火药气体导入消音器罩，同时将弹头减速至亚音速，无需使用亚音速弹药。',
            '游戏中无法更换枪管配件是因为消音器是枪管的一部分，不可拆卸。'
        ]
    },
    '9x19VSN': {
        realName: 'PP-19-01 Vityaz-SN',
        caliber: '9x19mm Parabellum',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            'Vityaz-SN 基于 AK 平台改造为发射 9mm 弹药的冲锋枪，保留了 AK 标志性的操作方式。',
            '"Vityaz"在俄语中意为"勇士"，该武器被俄罗斯 FSB、MVD 等多个安全部队使用。'
        ]
    },
    'MP7': {
        realName: 'H&K MP7A1',
        caliber: '4.6x30mm',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'MP7 开发目的是在紧凑尺寸下提供穿透 NATO CRISAT 标准护甲的能力。',
            '4.6x30mm 弹药是 H&K 对 FN 5.7x28mm 的竞争回应，两种弹药在穿甲测试中互有胜负。',
            '折叠后仅 415mm 长（比很多手枪加消音器还短），非常适合隐蔽携带。'
        ]
    },
    '9mm C1': {
        realName: 'Sterling L2A3 (加拿大版)',
        caliber: '9x19mm Parabellum',
        country: '🇨🇦 加拿大 / 🇬🇧 英国',
        manufacturer: 'Sterling Armaments',
        trivia: [
            'C1 是加拿大版的 Sterling 冲锋枪，从 1953 年一直服役到 1990 年代。',
            'Sterling 以其侧面插入的弧形弹匣和高可靠性著称，在包括马尔维纳斯/福克兰群岛战争中实战使用。'
        ]
    },
    'MPX': {
        realName: 'SIG Sauer MPX',
        caliber: '9x19mm Parabellum',
        country: '🇺🇸 美国',
        manufacturer: 'SIG Sauer',
        trivia: [
            'MPX 采用短行程活塞系统（而非传统冲锋枪的反冲式），可靠性更高、射击更平稳。',
            '26 点的低伤害使其在数据上不太吸引人，但极低的后坐力让它成为一把"激光枪"。'
        ]
    },
    'M12': {
        realName: 'Beretta M12',
        caliber: '9x19mm Parabellum',
        country: '🇮🇹 意大利',
        manufacturer: 'Beretta',
        trivia: [
            'Beretta M12 是 1958 年设计的冲锋枪，采用包络式枪机设计以缩短全枪长度。',
            '曾被意大利军队、巴西军警以及多个国家的安全部队使用。',
            'Caveira 作为巴西 BOPE 成员使用此武器——巴西确实大量进口了 M12。'
        ]
    },
    'PDW9': {
        realName: '虚构武器 (类似 SIG MPX/LWRC SMG-45)',
        caliber: '9x19mm Parabellum',
        country: '🇪🇸 西班牙 (设定)',
        manufacturer: '虚构',
        trivia: [
            'PDW9 没有明确的现实原型，外观融合了多种现代 PDW 设计。',
            '50 发大弹匣使其成为进攻方的持续火力选项。'
        ]
    },
    'Vector .45': {
        realName: 'KRISS Vector Gen II',
        caliber: '.45 ACP',
        country: '🇺🇸 美国',
        manufacturer: 'KRISS USA',
        trivia: [
            'KRISS Vector 采用革命性的"Super V"系统，将后坐力向下方重新引导，大幅降低射击时的枪口上跳。',
            '1200 RPM 的极高射速是游戏中冲锋枪之最，反映了 Vector 实际的高射速能力。',
            '25 发弹匣配 1200 RPM 意味着一秒钟就能清空弹匣。'
        ]
    },
    'T-5 SMG': {
        realName: '虚构武器 (类似 JS 9mm)',
        caliber: '9x19mm Parabellum',
        country: '🇨🇳 中国 (设定)',
        manufacturer: '虚构',
        trivia: [
            '游戏中的 T-5 SMG 外观类似中国 JS 9mm 冲锋枪，但名称和具体设计为虚构。',
            '900 RPM 的高射速配合适中的后坐力，使其成为防守方热门选择。'
        ]
    },
    'Scorpion EVO': {
        realName: 'CZ Scorpion EVO 3 A1',
        caliber: '9x19mm Parabellum',
        country: '🇨🇿 捷克',
        manufacturer: 'CZ (Česká zbrojovka)',
        trivia: [
            'EVO 3 A1 是全新设计，与经典的 Vz.61 蝎式冲锋枪除了名字外没有关系。',
            '1080 RPM 超高射速配 40 发弹匣，数据上非常凶猛，但后坐力是游戏中最难控制的之一。',
            'Ela 是波兰 GROM 干员，现实中捷克 EVO 确实出口到了波兰。'
        ]
    },
    'K1A': {
        realName: 'Daewoo K1A',
        caliber: '5.56x45mm NATO',
        country: '🇰🇷 韩国',
        manufacturer: 'S&T Motiv (前大宇精密)',
        trivia: [
            'K1A 在韩国被归类为冲锋枪（SMG），但实际发射 5.56mm 步枪弹——这种分类在全球是独特的。',
            '是韩国特种部队和军官的标准武器，在游戏中分配给韩国 707 特殊任务营的 Vigil。'
        ]
    },
    'Mx4 Storm': {
        realName: 'Beretta Mx4 Storm',
        caliber: '9x19mm Parabellum',
        country: '🇮🇹 意大利',
        manufacturer: 'Beretta',
        trivia: [
            'Mx4 Storm 是 Cx4 Storm 民用卡宾枪的军用/执法全自动版本。',
            '可与 Beretta Px4 Storm 手枪共用弹匣，体现了 Beretta Storm 系列的模块化理念。'
        ]
    },
    'AUG A3': {
        realName: 'Steyr AUG A3 SMG',
        caliber: '9x19mm Parabellum',
        country: '🇦🇹 奥地利',
        manufacturer: 'Steyr Mannlicher',
        trivia: [
            'AUG 系列的模块化设计允许通过更换枪管组件将步枪转换为 9mm 冲锋枪。',
            'A3 版本增加了标准皮卡汀尼导轨，取代了早期型号的内置光学瞄准具。'
        ]
    },
    'P10 RONI': {
        realName: 'CAA RONI Kit + CZ P-10 C',
        caliber: '9x19mm Parabellum',
        country: '🇮🇱 以色列 / 🇨🇿 捷克',
        manufacturer: 'CAA Industries / CZ',
        trivia: [
            '与 Commando 9 类似，P10 RONI 也是将手枪（CZ P-10 C）装入 RONI 套件转换为卡宾枪。',
            '15 发的小弹匣是其最大弱点，反映了底层仍是手枪弹匣的限制。'
        ]
    },
    'UZK50GI': {
        realName: '虚构武器 (类似 UZI PRO)',
        caliber: '.50 GI (游戏设定)',
        country: '🇮🇪 爱尔兰 (设定)',
        manufacturer: '虚构',
        trivia: [
            '外观类似以色列 UZI PRO，但名称和口径（.50 GI）为游戏虚构。',
            '.50 GI 在现实中确实存在——是一种将 .45 ACP 口径放大到 .50 的手枪弹。'
        ]
    },

    // ===== 轻机枪 =====
    'M249': {
        realName: 'FN M249 SAW',
        caliber: '5.56x45mm NATO',
        country: '🇧🇪 比利时 / 🇺🇸 美国',
        manufacturer: 'FN Herstal',
        trivia: [
            'M249 SAW（Squad Automatic Weapon）是美军标准班组自动武器，基于 FN Minimi 设计。',
            '100 发弹链箱是其标准配置，可提供持续的压制火力。',
            '游戏中 48 伤害 + 100 发弹匣的组合使其成为强力的区域封锁武器。'
        ]
    },
    '6P41': {
        realName: 'RPK-16',
        caliber: '5.45x39mm',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            '6P41 是 RPK-16 的俄军 GRAU 编号。RPK-16 是基于 AK-12 平台的现代化轻机枪。',
            '可以使用标准 AK 弹匣或 96 发弹鼓，游戏中的 100 发设定接近弹鼓容量。'
        ]
    },
    'G8A1': {
        realName: 'H&K HK21 / G8',
        caliber: '7.62x51mm NATO (原型) / 5.56mm (游戏)',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'G8A1 基于 HK21 通用机枪的轻量化版本，采用 HK 标志性的滚柱延迟闭锁系统。',
            '游戏中 850 RPM 的高射速使其成为最具攻击性的轻机枪，适合积极推进的玩法。'
        ]
    },
    'T-95 LSW': {
        realName: '95 式班用机枪 (QJB-95)',
        caliber: '5.8x42mm DBP-87',
        country: '🇨🇳 中国',
        manufacturer: '中国兵器工业集团',
        trivia: [
            'QJB-95 是 95 式自动步枪的班用机枪版本，配有重枪管和弹鼓。',
            '发射中国自主研发的 5.8x42mm 弹药，这种口径不属于任何 NATO 或华约标准。',
            '犊牛式布局使其在同类武器中长度最短，适合室内作战。'
        ]
    },
    'LMG-E': {
        realName: 'FN Minimi（机枪版）',
        caliber: '5.56x45mm NATO',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            '游戏内的 LMG-E 外观非常接近 FN Minimi Mk3 或其出口型号。',
            '150 发的巨大弹匣容量使其成为游戏中弹药最多的自动武器之一。'
        ]
    },
    'ALDA 5.56': {
        realName: 'Beretta ARX200 LMG (虚构衍生)',
        caliber: '5.56x45mm NATO',
        country: '🇮🇹 意大利',
        manufacturer: 'Beretta',
        trivia: [
            '游戏中的 ALDA 5.56 没有精确对应的现实原型，可能基于 Beretta 的轻武器概念。',
            '900 RPM 是 LMG 类别中最高的射速，配合 80 发弹匣提供恐怖的持续火力。'
        ]
    },
    'M249 SAW': {
        realName: 'FN M249 SAW (短枪管版)',
        caliber: '5.56x45mm NATO',
        country: '🇧🇪 比利时 / 🇺🇸 美国',
        manufacturer: 'FN Herstal',
        trivia: [
            '与 Capitão 的 M249 不同，Gridlock 的 M249 SAW 使用短枪管配置和 60 发弹匣。',
            '较少的弹匣容量（60 vs 100）通过更灵活的操控性来平衡。'
        ]
    },
    'DP27': {
        realName: 'DP-27 (Degtyaryov)',
        caliber: '7.62x54mmR',
        country: '🇷🇺 俄罗斯/苏联',
        manufacturer: 'Degtyaryov Plant',
        trivia: [
            'DP-27 是二战时期苏联的标准轻机枪，1928 年列装，以极高的可靠性著称。',
            '其标志性的圆形弹盘（pan magazine）放在枪身上方，给人留下深刻印象。',
            '游戏中 Tachanka 使用这把"古董"级武器，呼应了他"Lord Tachanka"的 meme 形象和苏联军人设定。'
        ]
    },

    // ===== 狙击步枪 =====
    'CSRX 300': {
        realName: '虚构武器 (类似 PGM Ultima Ratio)',
        caliber: '.300 Win Mag',
        country: '🇫🇷 法国 (推测)',
        manufacturer: '虚构',
        trivia: [
            'CSRX 300 没有精确的现实原型，但设计风格接近法国 PGM 系列或 AI AX 系列栓动步枪。',
            '127 伤害是全游戏最高，即使打四肢也能造成巨大伤害。',
            '栓动射速极低（50 RPM），错过一发可能就意味着死亡。Kali 是唯一使用此武器的干员。'
        ]
    },

    // ===== 射手步枪 =====
    '417': {
        realName: 'H&K HK417',
        caliber: '7.62x51mm NATO',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            'HK417 是 HK416 的 7.62mm 版本，定位为精确射手步枪。采用相同的短行程活塞系统。',
            '被法国军队选为 Fusil à Tir de Précision（精确射击步枪），与游戏中分配给法国干员一致。'
        ]
    },
    'OTs-03': {
        realName: 'SVU-AS (OTs-03)',
        caliber: '7.62x54mmR',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'TsKIB SOO',
        trivia: [
            'SVU 是 SVD 狙击步枪的犊牛式改型，大幅缩短了全枪长度以适应城市作战。',
            '"OTs-03"是该武器的设计局编号，AS 后缀表示可全自动射击（游戏中未体现）。',
            'Glaz 作为 Spetsnaz 狙击手使用此武器非常契合。'
        ]
    },
    'CAMRS': {
        realName: 'Colt Canada C20 (CAMRS)',
        caliber: '7.62x51mm NATO',
        country: '🇨🇦 加拿大',
        manufacturer: 'Colt Canada',
        trivia: [
            'CAMRS（Canadian Army Marksman Rifle System）是加拿大军队的精确射手步枪。',
            '基于 AR-10 平台，与 SR-25 有很多共同点。'
        ]
    },
    'SR-25': {
        realName: 'KAC SR-25 / M110 SASS',
        caliber: '7.62x51mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Knight\'s Armament Company',
        trivia: [
            'SR-25 被美军采用为 M110 SASS（Semi-Automatic Sniper System）。',
            '20 发弹匣比大多数 DMR 的 10 发大一倍，提供了更好的持续火力。'
        ]
    },
    'Mk 14 EBR': {
        realName: 'Mk 14 Enhanced Battle Rifle',
        caliber: '7.62x51mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Smith Enterprise / Sage International',
        trivia: [
            'Mk 14 EBR 是经典 M14 步枪的现代化改造版，安装了新的可折叠枪托和皮卡汀尼导轨。',
            '在阿富汗和伊拉克战场上因其远距离精度和 7.62mm 的停止力而受到特种部队青睐。'
        ]
    },
    'PMR90A2': {
        realName: '虚构武器',
        caliber: '7.62x51mm NATO (推测)',
        country: '未知',
        manufacturer: '虚构',
        trivia: [
            'Y11S1 新增的射手步枪，分配给 Thatcher、Capitão、Nøkk 和 Solid Snake。',
            '没有明确的现实原型，名称中的 PMR 可能暗示"Precision Marksman Rifle"。'
        ]
    },

    // ===== 霰弹枪 =====
    'M870': {
        realName: 'Remington 870',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Remington Arms',
        trivia: [
            'Remington 870 是历史上产量最大的泵动霰弹枪之一，累计生产超过 1100 万支。',
            '被全球无数军队、警察和民用市场使用，是泵动霰弹枪的标杆产品。'
        ]
    },
    'M590A1': {
        realName: 'Mossberg 590A1',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'O.F. Mossberg & Sons',
        trivia: [
            'M590A1 是唯一通过美军 MIL-S-3443 标准测试的泵动霰弹枪。',
            '与 Remington 870 的竞争是霰弹枪界的"可口可乐 vs 百事可乐"。SAS 两把霰弹枪都有。'
        ]
    },
    'M1014': {
        realName: 'Benelli M4 Super 90 (M1014)',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Benelli Armi',
        trivia: [
            'M1014 是 Benelli M4 的美军编号，是一款半自动战术霰弹枪。',
            '采用独特的 ARGO（Auto Regulating Gas Operated）导气系统，极其可靠。'
        ]
    },
    'SG-CQB': {
        realName: 'Remington 870 CQB',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Remington Arms',
        trivia: [
            '实际上是 870 的近距离作战特化版本，配有短枪管和战术配件。',
            '分配给法国 GIGN 的 Doc 和 Rook。'
        ]
    },
    'SASG-12': {
        realName: 'Saiga-12',
        caliber: '12 Gauge',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Kalashnikov Concern',
        trivia: [
            'Saiga-12 是基于 AK 平台的半自动霰弹枪，使用可拆卸弹匣供弹。',
            '是少数基于步枪平台设计的霰弹枪之一。'
        ]
    },
    'SUPER 90': {
        realName: 'Benelli M1 Super 90',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Benelli Armi',
        trivia: [
            'Benelli M1 Super 90 是 M4 的前代产品，采用惯性闭锁系统（而非导气系统）。',
            '分配给加拿大 JTF2 的 Frost。'
        ]
    },
    'SPAS-12': {
        realName: 'Franchi SPAS-12',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Luigi Franchi S.p.A.',
        trivia: [
            'SPAS-12 可在泵动和半自动模式之间切换，在影视作品中极其知名（《终结者》《侏罗纪公园》）。',
            '1994 年在美国被禁止进口，目前已停产，但因影视影响力保持着极高知名度。'
        ]
    },
    'SPAS-15': {
        realName: 'Franchi SPAS-15',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Luigi Franchi S.p.A.',
        trivia: [
            'SPAS-15 是 SPAS-12 的改进型，最大的变化是采用可拆卸弹匣供弹替代管式弹仓。',
            '保留了泵动/半自动双模式切换的设计。'
        ]
    },
    'SuperNova': {
        realName: 'Benelli SuperNova',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Benelli Armi',
        trivia: [
            'SuperNova 是 Benelli Nova 的改进版，采用 ComforTech 后坐力缓冲系统。',
            '游戏中它是少数可以装消音器的霰弹枪之一。'
        ]
    },
    'FO-12': {
        realName: 'Origin-12 (Foster Industries)',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Foster Industries',
        trivia: [
            'Origin-12 是一款全自动战术霰弹枪，可以极快的速度倾泻弹药。',
            '游戏中它是唯一的全自动主武器霰弹枪，10 发弹匣可以在瞬间清空。'
        ]
    },
    'SIX12': {
        realName: 'Crye Precision SIX12',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Crye Precision',
        trivia: [
            'SIX12 采用旋转弹仓（类似左轮手枪），可容纳 6 发霰弹。',
            '设计上可以作为独立武器或安装在 M4/M16 下挂使用。'
        ]
    },
    'SIX12 SD': {
        realName: 'Crye Precision SIX12 SD',
        caliber: '12 Gauge',
        country: '🇺🇸 美国',
        manufacturer: 'Crye Precision',
        trivia: [
            '带消音器的 SIX12 版本，SD = Suppressed。',
            '是游戏中唯一自带消音的霰弹枪，适合隐蔽破墙。'
        ]
    },

    // ===== 独头霰弹枪 =====
    'BOSG.12.2': {
        realName: '虚构武器 (类似 TP-82)',
        caliber: '12 Gauge Slug',
        country: '🇰🇷 韩国 (设定)',
        manufacturer: '虚构',
        trivia: [
            'BOSG.12.2 是一把只有 2 发子弹的双管独头弹霰弹枪，125 伤害可一发爆头击杀。',
            '被社区戏称为"手持加农炮"——两发打空后就只剩下副武器可用。',
            '"BOSG"的名称来源不明，可能是"Breach, Overwatch, Support Gun"的缩写。'
        ]
    },
    'ACS12': {
        realName: 'Origin-12 (独头弹版)',
        caliber: '12 Gauge Slug',
        country: '🇺🇸 美国',
        manufacturer: 'Foster Industries',
        trivia: [
            'ACS12 与 FO-12 共享相同的平台（Origin-12），但配置为发射独头弹。',
            '30 发弹匣 + 半自动的独头弹组合使其可以像步枪一样使用。'
        ]
    },
    'TCSG12': {
        realName: '虚构武器',
        caliber: '12 Gauge Slug',
        country: '🇲🇦 摩洛哥 (设定)',
        manufacturer: '虚构',
        trivia: [
            'TCSG12 最初伤害高达 84 点，后被多次削弱至 57 点。',
            '可装消音器的独头弹霰弹枪，在远距离仍有不错的精度。'
        ]
    },

    // ===== 副武器 - 冲锋枪 =====
    'C75 Auto': {
        realName: 'CZ 75 Automatic',
        caliber: '9x19mm Parabellum',
        country: '🇨🇿 捷克',
        manufacturer: 'CZ (Česká zbrojovka)',
        trivia: [
            'CZ 75 是世界上被仿制最多的手枪设计之一，全自动版本极其少见。',
            '1000 RPM 的射速使其在近距离极其致命，但铁瞄具阻挡严重是最大缺点。'
        ]
    },
    'SMG-11': {
        realName: 'MAC-11 (Ingram)',
        caliber: '.380 ACP (现实) / 9mm (游戏)',
        country: '🇺🇸 美国',
        manufacturer: 'Military Armament Corporation',
        trivia: [
            'MAC-11 是 MAC-10 的缩小版本，原版发射 .380 ACP 弹药。',
            '1270 RPM 的极端射速意味着 16 发弹匣不到一秒就能清空，控枪难度极高。',
            '是 SAS 干员的标志性副武器，也是游戏中技巧上限最高的武器之一。'
        ]
    },
    'SMG-12': {
        realName: 'Brügger & Thomet MP9',
        caliber: '9x19mm Parabellum',
        country: '🇨🇭 瑞士',
        manufacturer: 'B&T AG',
        trivia: [
            'B&T MP9 基于 Steyr TMP 发展而来，是一款极其紧凑的冲锋手枪。',
            '32 发弹匣比 SMG-11 大一倍，但后坐力同样难以控制。'
        ]
    },
    'Bearing 9': {
        realName: 'Minebea PM-9',
        caliber: '9x19mm Parabellum',
        country: '🇯🇵 日本',
        manufacturer: 'Minebea (现 MinebeaMitsumi)',
        trivia: [
            'PM-9 是日本自卫队的冲锋枪，外观非常紧凑。',
            '1100 RPM 的高射速使其成为副武器中的火力强手。'
        ]
    },
    'SPSMG9': {
        realName: 'B&T USW-G (推测)',
        caliber: '9x19mm Parabellum',
        country: '🇨🇭 瑞士',
        manufacturer: 'B&T AG',
        trivia: [
            '外观接近 B&T 的 Universal Service Weapon 概念，是一款紧凑的冲锋手枪。',
            '分配给 Kali 和 Clash 作为副武器。'
        ]
    },
    'Reaper MK2': {
        realName: '虚构武器',
        caliber: '9x19mm Parabellum (推测)',
        country: '未知',
        manufacturer: '虚构',
        trivia: [
            'Y10S3 引入并大量分配给多个干员（Oryx、Pulse、Rook、Sledge、Ying 等）。',
            '作为通用副武器冲锋枪，提供中等但可控的火力输出。'
        ]
    },

    // ===== 副武器 - 手枪精选 =====
    'D-50': {
        realName: 'IMI Desert Eagle .50 AE',
        caliber: '.50 Action Express',
        country: '🇮🇱 以色列 / 🇺🇸 美国',
        manufacturer: 'IMI / Magnum Research',
        trivia: [
            '沙漠之鹰是影视作品中最知名的大口径手枪，.50 AE 版本的后坐力巨大。',
            '71 点伤害是手枪类别中最高之一，两枪就能击杀满血敌人。'
        ]
    },
    'PMM': {
        realName: 'PM Makarov (PMM)',
        caliber: '9x18mm Makarov',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Izhevsk Mechanical Plant',
        trivia: [
            'PMM 是 PM 马卡洛夫手枪的现代化版本，通过增加膛室压力提高了弹道性能。',
            '61 点伤害配合不错的射速，是游戏中最强手枪之一。'
        ]
    },
    'Luison': {
        realName: 'Taurus PT92 (游戏改型)',
        caliber: '9x19mm Parabellum',
        country: '🇧🇷 巴西',
        manufacturer: 'Taurus',
        trivia: [
            'Luison 是 Caveira 的专属手枪，内置消音器。名字可能来自巴西民间传说。',
            '可用于审讯倒地的敌方干员获取全队位置信息，是游戏中独一无二的机制。'
        ]
    },
    'GONNE-6': {
        realName: '虚构武器 (单发榴弹/破障器)',
        caliber: '特殊破障弹',
        country: '未知',
        manufacturer: '虚构',
        trivia: [
            'GONNE-6 只有 1 发弹药，专门用于摧毁防弹设备（如 Maestro 的邪眼、防弹摄像头等）。',
            '不能杀死满血干员（10 伤害），纯粹是战术工具。'
        ]
    },

    // ===== 副武器 - 左轮 =====
    'LFP586': {
        realName: 'Manurhin MR 73',
        caliber: '.357 Magnum',
        country: '🇫🇷 法国',
        manufacturer: 'Manurhin',
        trivia: [
            'MR 73 被认为是世界上精度最高的左轮手枪之一，是法国 GIGN 的标志性武器。',
            'GIGN 前指挥官曾称赞它"是唯一一把你可以信赖用单手在 25 米击中目标的手枪"。'
        ]
    },
    'Keratos .357': {
        realName: 'Chiappa Rhino 60DS',
        caliber: '.357 Magnum',
        country: '🇮🇹 意大利',
        manufacturer: 'Chiappa Firearms',
        trivia: [
            'Chiappa Rhino 独特之处在于枪管对齐最下面的弹膛（而非通常的最上面），大幅降低了射击时枪口上跳。',
            '是游戏中唯一可以装消音器的左轮手枪。'
        ]
    }
};

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
