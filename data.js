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
    },
    sights: {
        red_dot: {
            name: '红点瞄准镜', nameEn: 'Red Dot Sight', slot: 'sight', icon: '🔴',
            mag: '1.0x',
            effects: [
                { type: 'info', label: '放大倍率', value: '1.0x' },
                { type: 'positive', label: '视野', value: '最大' },
                { type: 'neutral', label: 'ADS速度影响', value: '无' }
            ],
            description: '无放大倍率的反射式瞄具，视野最大，适合近距离快速交战。',
            bestFor: '近距离CQB、快速清角'
        },
        holographic: {
            name: '全息瞄准镜', nameEn: 'Holographic Sight', slot: 'sight', icon: '🟢',
            mag: '1.0x',
            effects: [
                { type: 'info', label: '放大倍率', value: '1.0x' },
                { type: 'positive', label: '准星清晰度', value: '高' },
                { type: 'neutral', label: 'ADS速度影响', value: '无' }
            ],
            description: '全息投影技术，准星环形设计便于快速对准目标中心，框架稍大但准星辨识度高。',
            bestFor: '中近距离、需要精准瞄点'
        },
        reflex: {
            name: '反射瞄准镜', nameEn: 'Reflex Sight', slot: 'sight', icon: '🔺',
            mag: '1.0x',
            effects: [
                { type: 'info', label: '放大倍率', value: '1.0x' },
                { type: 'positive', label: '框架遮挡', value: '最小' },
                { type: 'neutral', label: 'ADS速度影响', value: '无' }
            ],
            description: '三角形准星、开放式框架遮挡最少。个人偏好差异大，部分玩家觉得三角准星不如圆点直觉。',
            bestFor: '偏好开放视野的玩家'
        },
        scope_1_5x: {
            name: '1.5倍镜', nameEn: 'Scope 1.5x', slot: 'sight', icon: '🔍',
            mag: '1.5x',
            effects: [
                { type: 'info', label: '放大倍率', value: '1.5x' },
                { type: 'positive', label: '中距离辨识', value: '略有提升' },
                { type: 'negative', label: 'ADS灵敏度乘数', value: '0.9x' }
            ],
            description: '最低倍率放大镜，视野损失最小，适合需要轻微放大又不想牺牲太多视野的场景。',
            bestFor: '防守方替代高倍镜'
        },
        scope_2_0x: {
            name: '2.0倍镜', nameEn: 'Scope 2.0x', slot: 'sight', icon: '🔍',
            mag: '2.0x',
            effects: [
                { type: 'info', label: '放大倍率', value: '2.0x' },
                { type: 'neutral', label: '视野', value: '中等' },
                { type: 'negative', label: 'ADS灵敏度乘数', value: '0.8x' }
            ],
            description: '平衡的中距离倍镜，适合需要一定放大但又不想太窄视野的情况。',
            bestFor: '中距离交战'
        },
        scope_2_5x: {
            name: '2.5倍镜', nameEn: 'Scope 2.5x (ACOG)', slot: 'sight', icon: '🔭',
            mag: '2.5x',
            effects: [
                { type: 'info', label: '放大倍率', value: '2.5x' },
                { type: 'positive', label: '中远距离优势', value: '显著' },
                { type: 'negative', label: 'ADS灵敏度乘数', value: '0.7x' },
                { type: 'negative', label: '近距离劣势', value: '视野窄' }
            ],
            description: '经典ACOG倍镜，曾是进攻方的标志性配件。中远距离优势明显，但近距离视野受限。',
            bestFor: '中远距离架点、进攻方长距离交战'
        },
        scope_3_0x: {
            name: '3.0倍镜', nameEn: 'Scope 3.0x', slot: 'sight', icon: '🔭',
            mag: '3.0x',
            effects: [
                { type: 'info', label: '放大倍率', value: '3.0x' },
                { type: 'positive', label: '远距离精度', value: '极佳' },
                { type: 'negative', label: 'ADS灵敏度乘数', value: '0.6x' },
                { type: 'negative', label: '近距离', value: '严重劣势' }
            ],
            description: '高倍率瞄具，仅适合远距离交战。近距离CQB中使用几乎是自杀行为。',
            bestFor: 'DMR、远距离架点'
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

// ---- 干员图标 ----
// 来源: r6operators npm包 (marcopixel), 通过 jsDelivr CDN 加载
// URL格式: https://cdn.jsdelivr.net/npm/r6operators@2.12.0/dist/icons/{key}.svg
const OPERATOR_ICON_CDN = 'https://cdn.jsdelivr.net/npm/r6operators@2.12.0/dist/icons/';
const OPERATOR_ICON_MAP = {
    'Ace': 'ace', 'Alibi': 'alibi', 'Amaru': 'amaru', 'Aruni': 'aruni', 'Ash': 'ash',
    'Azami': 'azami', 'Bandit': 'bandit', 'Blackbeard': 'blackbeard', 'Blitz': 'blitz',
    'Brava': 'brava', 'Buck': 'buck', 'Capitão': 'capitao', 'Castle': 'castle',
    'Caveira': 'caveira', 'Clash': 'clash', 'Deimos': 'deimos', 'Denari': 'denari',
    'Doc': 'doc', 'Dokkaebi': 'dokkaebi', 'Echo': 'echo', 'Ela': 'ela',
    'Fenrir': 'fenrir', 'Finka': 'finka', 'Flores': 'flores', 'Frost': 'frost',
    'Fuze': 'fuze', 'Glaz': 'glaz', 'Goyo': 'goyo', 'Gridlock': 'gridlock',
    'Grim': 'grim', 'Hibana': 'hibana', 'IQ': 'iq', 'Iana': 'iana',
    'Jackal': 'jackal', 'Jäger': 'jager', 'Kaid': 'kaid', 'Kali': 'kali',
    'Kapkan': 'kapkan', 'Lesion': 'lesion', 'Lion': 'lion', 'Maestro': 'maestro',
    'Maverick': 'maverick', 'Melusi': 'melusi', 'Mira': 'mira', 'Montagne': 'montagne',
    'Mozzie': 'mozzie', 'Mute': 'mute', 'Nomad': 'nomad', 'Nøkk': 'nokk',
    'Oryx': 'oryx', 'Osa': 'osa', 'Pulse': 'pulse', 'Ram': 'ram',
    'Rauora': 'rauora', 'Rook': 'rook', 'Sens': 'sens', 'Sentry': 'sentry',
    'Skopos': 'skopos', 'Sledge': 'sledge', 'Smoke': 'smoke', 'Solis': 'solis',
    'Striker': 'striker', 'Tachanka': 'tachanka', 'Thatcher': 'thatcher',
    'Thermite': 'thermite', 'Thorn': 'thorn', 'Thunderbird': 'thunderbird',
    'Tubarão': 'tubarao', 'Twitch': 'twitch', 'Valkyrie': 'valkyrie',
    'Vigil': 'vigil', 'Wamai': 'wamai', 'Warden': 'warden', 'Ying': 'ying',
    'Zero': 'zero', 'Zofia': 'zofia'
};

// 获取干员图标URL，没有图标的返回null
function getOperatorIconURL(name) {
    const key = OPERATOR_ICON_MAP[name];
    return key ? OPERATOR_ICON_CDN + key + '.svg' : null;
}

// ---- 完整武器数据库 ----
const WEAPONS = [

    // ============================================================
    //                       主 武 器
    // ============================================================

    // ===== 突击步枪 (AR) =====
    { name: 'M4', type: 'ar', damage: 44, rpm: 750, mag: 30, operators: ['Maverick','Striker'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Commando 9', type: 'ar', damage: 36, rpm: 780, mag: 25, operators: ['Mozzie','Sentry'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'L85A2', type: 'ar', damage: 47, rpm: 670, mag: 30, operators: ['Sledge','Thatcher'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'AR33', type: 'ar', damage: 41, rpm: 749, mag: 25, operators: ['Thatcher','Flores'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'G36C', type: 'ar', damage: 38, rpm: 780, mag: 30, operators: ['Ash','Iana'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'R4-C', type: 'ar', damage: 39, rpm: 860, mag: 25, operators: ['Ash','Ram'], side: 'atk',
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
    { name: '552 Commando', type: 'ar', damage: 43, rpm: 690, mag: 30, operators: ['IQ','Grim'], side: 'atk',
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
    { name: 'Mk17 CQB', type: 'ar', damage: 44, rpm: 585, mag: 20, operators: ['Blackbeard'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'PARA-308', type: 'ar', damage: 47, rpm: 650, mag: 30, operators: ['Capitão','Brava'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'Type-89', type: 'ar', damage: 40, rpm: 850, mag: 20, operators: ['Hibana'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'C7E', type: 'ar', damage: 42, rpm: 800, mag: 30, operators: ['Jackal'], side: 'atk',
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
    { name: 'AR-15.50', type: 'dmr', damage: 67, rpm: 439, mag: 10, operators: ['Maverick','Tubarão'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      notes: '半自动' },
    { name: 'AK-74M', type: 'ar', damage: 44, rpm: 650, mag: 40, operators: ['Nomad','Deimos'], side: 'atk',
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
    { name: 'POF-9', type: 'ar', damage: 37, rpm: 740, mag: 50, operators: ['Sens'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'PCX-33', type: 'ar', damage: 36, rpm: 745, mag: 31, operators: ['Skopos'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },

    // ===== 冲锋枪 (SMG) =====
    { name: 'FMG-9', type: 'smg', damage: 34, rpm: 800, mag: 30, operators: ['Smoke','Nøkk','Denari'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['compensator','extended_barrel'], grips: [] } },
    { name: 'MP5K', type: 'smg', damage: 30, rpm: 800, mag: 30, operators: ['Mute','Wamai'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'UMP45', type: 'smg', damage: 42, rpm: 600, mag: 25, operators: ['Castle','Pulse'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'MP5', type: 'smg', damage: 27, rpm: 800, mag: 30, operators: ['Doc','Rook','Melusi'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['compensator','extended_barrel'], grips: ['angled_grip'] } },
    { name: 'P90', type: 'smg', damage: 22, rpm: 970, mag: 50, operators: ['Doc','Rook','Solis'], side: 'def',
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
    { name: 'MPX', type: 'smg', damage: 26, rpm: 830, mag: 30, operators: ['Valkyrie','Warden','Tubarão'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },
    { name: 'M12', type: 'smg', damage: 42, rpm: 550, mag: 30, operators: ['Caveira'], side: 'def',
      barrels: ['compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['compensator'], grips: [] } },
    { name: 'PDW9', type: 'smg', damage: 34, rpm: 800, mag: 50, operators: ['Jackal','Osa'], side: 'atk',
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
    { name: 'Scorpion EVO', type: 'smg', damage: 23, rpm: 1080, mag: 40, operators: ['Ela','Denari'], side: 'def',
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
    { name: 'P10 RONI', type: 'smg', damage: 26, rpm: 980, mag: 15, operators: ['Mozzie','Aruni'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'UZK50GI', type: 'smg', damage: 36, rpm: 700, mag: 22, operators: ['Thorn'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['extended_barrel'], grips: [] } },

    // ===== 轻机枪 (LMG) =====
    { name: 'M249', type: 'lmg', damage: 48, rpm: 650, mag: 100, operators: ['Capitão','Striker','Rauora'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake'], grips: ['angled_grip'] } },
    { name: '6P41', type: 'lmg', damage: 46, rpm: 680, mag: 100, operators: ['Fuze','Finka'], side: 'atk',
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
    { name: 'LMG-E', type: 'lmg', damage: 41, rpm: 720, mag: 150, operators: ['Zofia','Ram'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'ALDA 5.56', type: 'lmg', damage: 35, rpm: 900, mag: 80, operators: ['Maestro'], side: 'def',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'M249 SAW', type: 'lmg', damage: 48, rpm: 650, mag: 60, operators: ['Gridlock'], side: 'atk',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','compensator'], grips: ['angled_grip'] } },
    { name: 'DP27', type: 'lmg', damage: 60, rpm: 550, mag: 70, operators: ['Tachanka'], side: 'def',
      barrels: [],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: '仅可装瞄准镜+激光' },

    // ===== 狙击步枪 (Sniper) =====
    { name: 'CSRX 300', type: 'sniper', damage: 135, rpm: 55, mag: 5, operators: ['Kali'], side: 'atk',
      barrels: [],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: '栓动狙击步枪，内置 5x/12x 倍镜' },

    // ===== 射手步枪 (DMR) =====
    { name: '417', type: 'dmr', damage: 69, rpm: 444, mag: 20, operators: ['Twitch','Lion','Sens','Rauora'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'OTs-03', type: 'dmr', damage: 71, rpm: 374, mag: 15, operators: ['Glaz'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['vertical_grip','angled_grip'] } },
    { name: 'CAMRS', type: 'dmr', damage: 69, rpm: 442, mag: 20, operators: ['Buck','Brava'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Skeleton Key占用握把槽' },
    { name: 'SR-25', type: 'dmr', damage: 61, rpm: 450, mag: 20, operators: ['Blackbeard','Flores','Striker'], side: 'atk',
      barrels: ['muzzle_brake','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: ['angled_grip'] } },
    { name: 'Mk 14 EBR', type: 'dmr', damage: 60, rpm: 450, mag: 20, operators: ['Dokkaebi','Aruni'], side: 'mixed',
      barrels: ['muzzle_brake','flash_hider','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'PMR90A2', type: 'dmr', damage: 62, rpm: 444, mag: 20, operators: ['Solid Snake','Thatcher','Capitão','Hibana','Nøkk'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'],
      grips: ['vertical_grip','angled_grip'],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Y11S1新增射手步枪' },

    // ===== 霰弹枪 (Shotgun - 弹丸) =====
    // 伤害为单颗弹丸伤害（每发8颗弹丸），数据源: GitHub实测Y11S1.1 + 灰机wiki面板
    { name: 'M870', type: 'shotgun', damage: 42, rpm: 0, mag: 7, operators: ['Bandit','Jäger','Thorn','Sentry'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'M590A1', type: 'shotgun', damage: 48, rpm: 0, mag: 7, operators: ['Smoke','Mute','Thatcher','Sledge','Warden','Deimos'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'M1014', type: 'shotgun', damage: 28, rpm: 0, mag: 8, operators: ['Thermite','Castle','Pulse','Ace'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SG-CQB', type: 'shotgun', damage: 44, rpm: 0, mag: 7, operators: ['Doc','Rook','Twitch','Grim','Lion'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'SASG-12', type: 'shotgun', damage: 26, rpm: 0, mag: 10, operators: ['Finka','Kapkan','Fenrir'], side: 'def',
      barrels: [], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SUPER 90', type: 'shotgun', damage: 27, rpm: 0, mag: 8, operators: ['Frost','Melusi'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SPAS-12', type: 'shotgun', damage: 31, rpm: 0, mag: 7, operators: ['Valkyrie','Oryx'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SPAS-15', type: 'shotgun', damage: 24, rpm: 0, mag: 6, operators: ['Caveira','Thunderbird'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '半自动霰弹枪' },
    { name: 'SuperNova', type: 'shotgun', damage: 48, rpm: 0, mag: 7, operators: ['Echo','Hibana','Amaru'], side: 'mixed',
      barrels: ['suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪' },
    { name: 'FO-12', type: 'shotgun', damage: 26, rpm: 0, mag: 10, operators: ['Ela'], side: 'def',
      barrels: ['extended_barrel'], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '全自动霰弹枪' },
    { name: 'SIX12', type: 'shotgun', damage: 46, rpm: 0, mag: 6, operators: ['Ying'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '左轮式霰弹枪' },
    { name: 'SIX12 SD', type: 'shotgun', damage: 46, rpm: 0, mag: 6, operators: ['Lesion','Nøkk'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '消音版左轮式霰弹枪' },
    { name: 'ITA12L', type: 'shotgun', damage: 41, rpm: 0, mag: 8, operators: ['Jackal','Mira','Solis'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '泵动霰弹枪（长管版）' },

    // ===== 独头霰弹枪 (Slug) =====
    // 伤害为单发伤害（单颗独头弹），数据源: GitHub实测Y11S1.1 + 灰机wiki面板
    { name: 'BOSG.12.2', type: 'slug', damage: 125, rpm: 0, mag: 2, operators: ['Vigil','Dokkaebi'], side: 'mixed',
      barrels: [], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '双管独头弹' },
    { name: 'ACS12', type: 'slug', damage: 69, rpm: 300, mag: 30, operators: ['Maestro','Alibi','Azami'], side: 'def',
      barrels: [], grips: ['angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动独头弹' },
    { name: 'TCSG12', type: 'slug', damage: 75, rpm: 450, mag: 10, operators: ['Kaid','Goyo','Sentry'], side: 'def',
      barrels: ['suppressor'], grips: ['vertical_grip','angled_grip'], y7s3_new: { barrels: [], grips: [] }, notes: '半自动独头弹' },
    { name: 'Glaive-12', type: 'slug', damage: 67, rpm: 0, mag: 4, operators: ['Denari'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '独头霰弹枪' },


    // ============================================================
    //                       副 武 器
    // ============================================================

    // ===== 霰弹枪·次要 (Secondary Shotgun) =====
    { name: 'ITA12S', type: 'shotgun_sec', damage: 29, rpm: 0, mag: 5, operators: ['Jackal','Mira','Thermite','Thunderbird','Melusi','Frost','Amaru','Striker'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '副武器泵动霰弹枪' },
    { name: 'Super Shorty', type: 'shotgun_sec', damage: 35, rpm: 0, mag: 3, operators: ['Castle','Gridlock','Wamai','Brava','Clash','Sentry'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] }, notes: '副武器短管霰弹枪' },

    // ===== 手枪 (Pistol) =====
    { name: '5.7 USG', type: 'pistol', damage: 42, rpm: 0, mag: 20, operators: ['Zero','Nøkk','Castle','Thermite','Fenrir','Ash','Pulse','Striker'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P226 MK 25', type: 'pistol', damage: 50, rpm: 0, mag: 15, operators: ['Sledge','Thatcher','Smoke','Mute','Kali','Tubarão','Denari'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'M45 MEUSOC', type: 'pistol', damage: 58, rpm: 0, mag: 7, operators: ['Castle','Pulse','Thermite','Ash'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P9', type: 'pistol', damage: 45, rpm: 0, mag: 16, operators: ['Doc','Rook','Twitch','Lion','Montagne','Ace'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'PMM', type: 'pistol', damage: 61, rpm: 0, mag: 8, operators: ['Fuze','Glaz','Kapkan','Tachanka','Finka','Osa'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'GSH-18', type: 'pistol', damage: 44, rpm: 0, mag: 18, operators: ['Fuze','Glaz','Kapkan','Tachanka','Finka','Rauora','Flores'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P12', type: 'pistol', damage: 44, rpm: 0, mag: 15, operators: ['Bandit','Jäger','IQ','Blitz','Wamai'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Mk1 9mm', type: 'pistol', damage: 48, rpm: 0, mag: 13, operators: ['Buck','Frost','Ram','Iana'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'D-50', type: 'pistol', damage: 71, rpm: 0, mag: 7, operators: ['Blackbeard','Valkyrie','Nøkk','Azami'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '高伤害沙漠之鹰' },
    { name: 'PRB92', type: 'pistol', damage: 42, rpm: 0, mag: 15, operators: ['Capitão','Caveira','Aruni','Nomad'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Luison', type: 'pistol', damage: 65, rpm: 0, mag: 12, operators: ['Caveira'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: 'Caveira专属，内置消音器，可审讯倒地敌人' },
    { name: 'P229', type: 'pistol', damage: 51, rpm: 0, mag: 12, operators: ['Hibana','Echo','Skopos','Goyo','Grim'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'Q-929', type: 'pistol', damage: 60, rpm: 0, mag: 10, operators: ['Ying','Lesion','Thunderbird'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'RG15', type: 'pistol', damage: 38, rpm: 0, mag: 15, operators: ['Ela','Zofia','Melusi'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '内置微型红点瞄具' },
    { name: '1911 TACOPS', type: 'pistol', damage: 55, rpm: 0, mag: 8, operators: ['Dokkaebi','Maverick','Thorn'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'USP40', type: 'pistol', damage: 48, rpm: 0, mag: 12, operators: ['Jackal','Mira','Oryx','Brava'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: '.44 Mag Semi-Auto', type: 'pistol', damage: 54, rpm: 0, mag: 7, operators: ['Kaid','Nomad'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '高伤害半自动' },
    { name: 'SDP 9mm', type: 'pistol', damage: 47, rpm: 0, mag: 16, operators: ['Gridlock','Mozzie','Sens'], side: 'mixed',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'P-10C', type: 'pistol', damage: 40, rpm: 0, mag: 15, operators: ['Warden','Clash','Jäger'], side: 'def',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] } },
    { name: 'GONNE-6', type: 'pistol', damage: 10, rpm: 0, mag: 1, operators: ['Glaz','Dokkaebi','Finka','Iana','Gridlock','Amaru','Flores','Zero','Sens','Lion','Nøkk'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '单发破坏工具，可摧毁防弹设备' },
    { name: 'TACIT .45', type: 'pistol', damage: 52, rpm: 0, mag: 8, operators: ['Solid Snake'], side: 'atk',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: 'Y11S1新增，内置消音器+反射瞄具' },
    { name: 'Bailiff 410', type: 'pistol', damage: 30, rpm: 0, mag: 5, operators: ['Maestro','Alibi','Oryx','Doc','Grim'], side: 'def',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '副武器左轮霰弹枪，主要用于开洞' },
    { name: '.44 Vendetta', type: 'pistol', damage: 78, rpm: 0, mag: 6, operators: ['Deimos'], side: 'atk',
      barrels: ['muzzle_brake','suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: 'Deimos专属高伤害左轮' },

    // ===== 冲锋枪·次要 (Secondary SMG / Machine Pistol) =====
    { name: 'C75 Auto', type: 'smg_sec', damage: 35, rpm: 1000, mag: 26, operators: ['Dokkaebi','Vigil','Thorn','Kali','Sentry'], side: 'mixed',
      barrels: ['compensator','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'SMG-11', type: 'smg_sec', damage: 32, rpm: 1270, mag: 16, operators: ['Smoke','Mute','Sledge','Amaru','Solis'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: ['angled_grip'],
      y7s3_new: { barrels: ['muzzle_brake','extended_barrel'], grips: ['angled_grip'] } },
    { name: 'SMG-12', type: 'smg_sec', damage: 28, rpm: 1270, mag: 32, operators: ['Dokkaebi','Vigil','Warden'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor'],
      grips: ['angled_grip'],
      y7s3_new: { barrels: [], grips: [] } },
    { name: 'Bearing 9', type: 'smg_sec', damage: 33, rpm: 1100, mag: 25, operators: ['Hibana','Echo','Tachanka','Thunderbird','Glaz'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['muzzle_brake','extended_barrel'], grips: [] } },
    { name: 'SPSMG9', type: 'smg_sec', damage: 33, rpm: 980, mag: 20, operators: ['Kali','Clash'], side: 'mixed',
      barrels: ['muzzle_brake','compensator','flash_hider','suppressor','extended_barrel'],
      grips: [],
      y7s3_new: { barrels: ['muzzle_brake','compensator','extended_barrel'], grips: [] } },
    { name: 'Reaper MK2', type: 'smg_sec', damage: 31, rpm: 765, mag: 33, operators: ['Fenrir','Oryx','Pulse','Rook','Sledge','Ying','Maverick','Rauora'], side: 'mixed',
      barrels: ['compensator','flash_hider','suppressor'],
      grips: [],
      y7s3_new: { barrels: [], grips: [] },
      notes: 'Y10S3 分配给 Oryx/Pulse/Rook/Sledge/Ying' },

    // ===== 左轮手枪 (Revolver) =====
    { name: 'LFP586', type: 'revolver', damage: 78, rpm: 0, mag: 6, operators: ['Doc','Rook','Twitch','Lion','Montagne','Kaid'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '.357 Magnum 左轮' },
    { name: 'Keratos .357', type: 'revolver', damage: 78, rpm: 0, mag: 6, operators: ['Maestro','Alibi','Bandit','Wamai'], side: 'mixed',
      barrels: ['suppressor'], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '可装消音器的左轮' },
    { name: 'GONNE-6 Rev', type: 'revolver', damage: 78, rpm: 0, mag: 5, operators: ['Kaid','Nomad'], side: 'mixed',
      barrels: [], grips: [], y7s3_new: { barrels: [], grips: [] },
      notes: '.44 Mag 左轮（非半自动版）' }
];

// ---- 武器扩展数据 ----
// 瞄具/下挂/机动性/换弹时间/后坐力模式/伤害衰减
// 伤害衰减规则 (Bruce游戏内实测 2026-04-01):
//   衰减公式: min = floor(damage × 衰减系数), 衰减区间内线性递减后向下取整
//   突击步枪(ar):      系数0.6, 25-35m  | 冲锋枪(smg):      系数0.6, 18-28m
//   轻机枪(lmg):       系数0.65, 30-40m | 狙击枪(sniper):    系数0.8, 30-40m
//   射手步枪(dmr):     系数0.7, 30-40m  | 独头霰弹枪(slug):  系数0.6, 15-25m
//   手枪(pistol):      系数0.6, 12-15m  | 副武器SMG(smg_sec): 系数0.6, 18-28m
//   左轮(revolver):    系数0.6, 12-15m
//   多头霰弹枪(shotgun/shotgun_sec): 双段衰减 5-7m(系数0.75) + 10-13m(系数0.6), 二次衰减不中间取整
const WEAPON_EXTENDED = {
    // === 突击步枪 ===
    'M4': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.3,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '稳定上升，略向右偏' },
        falloff: { start: 25, end: 35, min: 26 }
    },
    'Commando 9': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.1,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '非常平稳，几乎直线上升' },
        falloff: { start: 25, end: 35, min: 21 }
    },
    'L85A2': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.3,
        recoil: { vertical: 'low', horizontal: 'high', pattern: '垂直后坐力低，水平晃动大' },
        falloff: { start: 25, end: 35, min: 28 }
    },
    'AR33': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，有轻微左右摇摆' },
        falloff: { start: 25, end: 35, min: 24 }
    },
    'G36C': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.4,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '后坐力非常小，容易控制' },
        falloff: { start: 25, end: 35, min: 22 }
    },
    'R4-C': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.4,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '垂直后坐力高，水平偏移小' },
        falloff: { start: 25, end: 35, min: 23 }
    },
    '556XI': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，稳定可控' },
        falloff: { start: 25, end: 35, min: 28 }
    },
    'F2': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.6, reloadEmpty: 3.3,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '极高射速导致极高垂直后坐力，需要强力下压' },
        falloff: { start: 25, end: 35, min: 22 }
    },
    'AK-12': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.6, reloadEmpty: 3.4,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '前几发稳定，第4发后水平后坐力恶化' },
        falloff: { start: 25, end: 35, min: 24 }
    },
    'AUG A2': {
        sights: ['red_dot','holographic','reflex','scope_2_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '非常稳定，适合新手' },
        falloff: { start: 25, end: 35, min: 25 }
    },
    '552 Commando': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，弹道略向右偏' },
        falloff: { start: 25, end: 35, min: 25 }
    },
    '416-C CARBINE': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '垂直上跳明显但水平稳定' },
        falloff: { start: 25, end: 35, min: 22 }
    },
    'C8-SFW': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.3,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '极高后坐力，Skeleton Key占用下挂' },
        falloff: { start: 25, end: 35, min: 24 }
    },
    'Mk17 CQB': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.6,
        recoil: { vertical: 'high', horizontal: 'medium', pattern: '7.62mm大口径，单发后坐力大但射速低补偿' },
        falloff: { start: 25, end: 35, min: 26 }
    },
    'PARA-308': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.8,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，弹道偏右' },
        falloff: { start: 25, end: 35, min: 28 }
    },
    'Type-89': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 3.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等垂直后坐力，水平稳定' },
        falloff: { start: 25, end: 35, min: 24 }
    },
    'C7E': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.7, reloadEmpty: 3.3,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '非常平稳的弹道，容易全自动控枪' },
        falloff: { start: 25, end: 35, min: 25 }
    },
    'M762': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '高后坐力，弹道呈S形左右摇摆' },
        falloff: { start: 25, end: 35, min: 27 }
    },
    'V308': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 3.2, reloadEmpty: 4.0,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，50发弹匣提供持续火力' },
        falloff: { start: 25, end: 35, min: 26 }
    },
    'Spear .308': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，非常容易控制' },
        falloff: { start: 25, end: 35, min: 25 }
    },
    'AR-15.50': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '半自动，单发后坐力大但有恢复时间' },
        falloff: { start: 30, end: 40, min: 46 }
    },
    'AK-74M': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '典型AK后坐力模式，无握把加剧控枪难度' },
        falloff: { start: 25, end: 35, min: 26 }
    },
    'ARX200': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.6, reloadEmpty: 3.2,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，水平稳定' },
        falloff: { start: 25, end: 35, min: 28 }
    },
    'F90': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，适合远距离连射' },
        falloff: { start: 25, end: 35, min: 22 }
    },
    'SC3000K': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.6, reloadEmpty: 3.3,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，整体平稳' },
        falloff: { start: 25, end: 35, min: 27 }
    },
    'POF-9': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.2,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '9mm口径，后坐力非常小' },
        falloff: { start: 25, end: 35, min: 22 }
    },
    'PCX-33': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.2,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，防守方可用' },
        falloff: { start: 25, end: 35, min: 21 }
    },

    // === 冲锋枪 ===
    'FMG-9': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'low', horizontal: 'medium', pattern: '低垂直，中等水平后坐力' },
        falloff: { start: 18, end: 28, min: 20 }
    },
    'MP5K': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，适合近距离扫射' },
        falloff: { start: 18, end: 28, min: 18 }
    },
    'UMP45': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'very_low', horizontal: 'very_low', pattern: '几乎无后坐力，激光般稳定' },
        falloff: { start: 18, end: 28, min: 25 }
    },
    'MP5': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，滚柱闭锁带来平稳射击' },
        falloff: { start: 18, end: 28, min: 16 }
    },
    'P90': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.0,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，高射速需要控制' },
        falloff: { start: 18, end: 28, min: 13 }
    },
    'MP5SD': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '与MP5相似的低后坐力' },
        falloff: { start: 18, end: 28, min: 18 }
    },
    '9x19VSN': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '非常稳定的弹道' },
        falloff: { start: 18, end: 28, min: 20 }
    },
    'MP7': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等垂直后坐力，水平稳定' },
        falloff: { start: 18, end: 28, min: 19 }
    },
    '9mm C1': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低射速带来极低后坐力' },
        falloff: { start: 18, end: 28, min: 21 }
    },
    'MPX': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'very_low', horizontal: 'very_low', pattern: '接近零后坐力，被称为"激光枪"' },
        falloff: { start: 18, end: 28, min: 15 }
    },
    'M12': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低射速带来稳定后坐力' },
        falloff: { start: 18, end: 28, min: 25 }
    },
    'PDW9': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.1,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，50发弹匣提供持续火力' },
        falloff: { start: 18, end: 28, min: 20 }
    },
    'Vector .45': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.0, reloadEmpty: 2.8,
        recoil: { vertical: 'very_low', horizontal: 'high', pattern: '垂直极低(Super V系统)，水平随机且大' },
        falloff: { start: 18, end: 28, min: 13 }
    },
    'T-5 SMG': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.3, reloadEmpty: 2.9,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低后坐力，近距离非常好用' },
        falloff: { start: 18, end: 28, min: 16 }
    },
    'Scorpion EVO': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.1,
        recoil: { vertical: 'very_high', horizontal: 'very_high', pattern: '极高后坐力，全游戏最难控制的冲锋枪之一' },
        falloff: { start: 18, end: 28, min: 13 }
    },
    'K1A': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，容易控制' },
        falloff: { start: 18, end: 28, min: 21 }
    },
    'Mx4 Storm': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'low', horizontal: 'medium', pattern: '低垂直，中等水平后坐力' },
        falloff: { start: 18, end: 28, min: 15 }
    },
    'AUG A3': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 3.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '犊牛式布局，后坐力稳定' },
        falloff: { start: 18, end: 28, min: 21 }
    },
    'P10 RONI': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，15发弹匣限制火力持续' },
        falloff: { start: 18, end: 28, min: 15 }
    },
    'UZK50GI': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.4, reloadEmpty: 3.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，整体可控' },
        falloff: { start: 18, end: 28, min: 21 }
    },

    // === 轻机枪 ===
    'M249': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 5.5, reloadEmpty: 6.5,
        recoil: { vertical: 'high', horizontal: 'medium', pattern: '高垂直后坐力，弹链供弹换弹极慢' },
        falloff: { start: 30, end: 40, min: 31 }
    },
    '6P41': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 5.0, reloadEmpty: 6.0,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '高后坐力，弹道不可预测' },
        falloff: { start: 30, end: 40, min: 29 }
    },
    'G8A1': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 4.5, reloadEmpty: 5.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，高射速要求持续下压' },
        falloff: { start: 30, end: 40, min: 24 }
    },
    'T-95 LSW': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 3.4, reloadEmpty: 4.4,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，弹鼓供弹' },
        falloff: { start: 30, end: 40, min: 29 }
    },
    'LMG-E': {
        sights: ['red_dot','holographic','reflex','scope_2_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 5.0, reloadEmpty: 6.0,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，150发弹匣' },
        falloff: { start: 30, end: 40, min: 26 }
    },
    'ALDA 5.56': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 4.5, reloadEmpty: 5.5,
        recoil: { vertical: 'medium', horizontal: 'high', pattern: '高射速LMG，水平后坐力较大' },
        falloff: { start: 30, end: 40, min: 22 }
    },
    'M249 SAW': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 4.5, reloadEmpty: 5.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，短枪管版本' },
        falloff: { start: 30, end: 40, min: 31 }
    },
    'DP27': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 4.0, reloadEmpty: 5.0,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '低射速带来稳定的后坐力' },
        falloff: { start: 30, end: 40, min: 39 }
    },

    // === 狙击步枪 ===
    'CSRX 300': {
        sights: [],
        underbarrel: false, mobility: 50,
        reloadTactical: 3.8, reloadEmpty: 4.5,
        recoil: { vertical: 'n/a', horizontal: 'n/a', pattern: '栓动步枪，单发射击无连射后坐力' },
        falloff: { start: 30, end: 40, min: 108 }, // [实测] 135→108 (系数0.8, 30-40m)
        specialNote: '内置5x/12x双倍率瞄准镜，不可更换'
    },

    // === 射手步枪 ===
    '417': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '半自动，单发上跳大但回正快' },
        falloff: { start: 30, end: 40, min: 48 }
    },
    'OTs-03': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '半自动，后坐力大但射速慢有恢复时间' },
        falloff: { start: 30, end: 40, min: 49 },
        specialNote: '热感瞄准镜可切换'
    },
    'CAMRS': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，后坐力中等' },
        falloff: { start: 30, end: 40, min: 48 }
    },
    'SR-25': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.9, reloadEmpty: 3.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，20发弹匣提供持续火力' },
        falloff: { start: 30, end: 40, min: 42 }
    },
    'Mk 14 EBR': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，中等后坐力' },
        falloff: { start: 30, end: 40, min: 42 }
    },
    'PMR90A2': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: true, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动射手步枪，Y11S1新增' },
        falloff: { start: 30, end: 40, min: 43 }
    },

    // === 霰弹枪 (弹丸) ===
    // 霰弹枪伤害衰减: 每发射出8颗弹丸, falloff的damage值为单颗弹丸伤害
    // falloff格式: { start: 第一段衰减起始(5m), midStart: 第一段衰减结束(7m), mid: 中间伤害值, midEnd: 第二段衰减起始(10m), end: 第二段衰减结束(13m), min: 最低伤害, pellets: 弹丸数 }
    // 第一段衰减: 5-7m, 系数0.75, mid = floor(damage × 0.75)
    // 第二段衰减: 10-13m, 系数0.6 (基于原始伤害), min = floor(damage × 0.75 × 0.6) = floor(damage × 0.45)
    // 二次衰减不在中间取整，一次性完成两次衰减计算后再向下取整
    // ⚠️ 数据可信度说明:
    //   - 标注 [Fandom-verified] 的数据经 Fandom Wiki Siege 页面二次验证
    //   - falloff 为 null 表示暂无可靠来源，宁缺毋错
    //   - 数据源优先级: 育碧官网 > 灰机wiki > Fandom Wiki (需确认为Siege数据)
    'M870': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x','scope_2_5x','scope_3_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，单发后坐力大但有充足恢复时间' },
        falloff: { start: 5, midStart: 7, mid: 31, midEnd: 10, end: 13, min: 18, pellets: 8 } // [GitHub实测Y11S1.1] 42→31→18
    },
    'M590A1': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x','scope_2_5x','scope_3_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，后坐力大但可控' },
        falloff: { start: 5, midStart: 7, mid: 36, midEnd: 10, end: 13, min: 21, pellets: 8 } // [GitHub实测Y11S1.1] 48→36→21
    },
    'M1014': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，连续射击后坐力累积' },
        falloff: { start: 5, midStart: 7, mid: 21, midEnd: 10, end: 13, min: 12, pellets: 8 } // [GitHub实测Y11S1.1] 28→21→12
    },
    'SG-CQB': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x','scope_2_5x','scope_3_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，单发伤害高' },
        falloff: { start: 5, midStart: 7, mid: 33, midEnd: 10, end: 13, min: 19, pellets: 8 } // [GitHub实测Y11S1.1] 44→33→19
    },
    'SASG-12': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '半自动，AK平台，弹匣供弹可快速换弹' },
        falloff: { start: 5, midStart: 7, mid: 19, midEnd: 10, end: 13, min: 11, pellets: 8 } // [GitHub实测Y11S1.1] 26→19→11
    },
    'SUPER 90': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，惯性闭锁系统后坐力适中' },
        falloff: { start: 5, midStart: 7, mid: 20, midEnd: 10, end: 13, min: 12, pellets: 8 } // [GitHub实测Y11S1.1] 27→20→12
    },
    'SPAS-12': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，后坐力中等' },
        falloff: { start: 5, midStart: 7, mid: 23, midEnd: 10, end: 13, min: 13, pellets: 8 } // [GitHub实测Y11S1.1] 31→23→13
    },
    'SPAS-15': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '半自动，弹匣供弹，后坐力平稳' },
        falloff: { start: 5, midStart: 7, mid: 18, midEnd: 10, end: 13, min: 10, pellets: 8 } // [GitHub实测Y11S1.1] 24→18→10
    },
    'SuperNova': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x','scope_2_5x','scope_3_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，ComforTech缓冲系统' },
        falloff: { start: 5, midStart: 7, mid: 36, midEnd: 10, end: 13, min: 21, pellets: 8 } // [GitHub实测Y11S1.1] 48→36→21
    },
    'FO-12': {
        sights: ['red_dot','holographic','reflex','scope_1_5x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.34, reloadEmpty: 3.29,
        recoil: { vertical: 'very_high', horizontal: 'high', pattern: '全自动霰弹枪，极高射速带来剧烈后坐力' },
        falloff: { start: 5, midStart: 7, mid: 18, midEnd: 10, end: 13, min: 10, pellets: 8 } // [GitHub实测Y11S1.1] 24→18→10
    },
    'SIX12': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.0, reloadEmpty: 4.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '旋转弹仓供弹，后坐力中等' },
        falloff: { start: 5, midStart: 7, mid: 34, midEnd: 10, end: 13, min: 20, pellets: 8 } // [GitHub实测Y11S1.1] 46→34→20
    },
    'SIX12 SD': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.0, reloadEmpty: 4.0,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '自带消音器的旋转弹仓霰弹枪' },
        falloff: { start: 5, midStart: 7, mid: 34, midEnd: 10, end: 13, min: 20, pellets: 8 } // [GitHub实测Y11S1.1] 46→34→20（与SIX12相同）
    },
    'ITA12L': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 4.6, reloadEmpty: 4.6,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '泵动霰弹枪，长管版ITA12' },
        falloff: { start: 5, midStart: 7, mid: 30, midEnd: 10, end: 13, min: 18, pellets: 8 } // 基于同类武器衰减模式
    },

    // === 独头霰弹枪 ===
    // 独头弹和普通枪械一样是单段衰减（两段伤害）
    // 衰减规则: 系数0.6, 15-25m, min = floor(damage × 0.6)
    'BOSG.12.2': {
        sights: ['red_dot','holographic','reflex','scope_2_5x','scope_3_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.0,
        recoil: { vertical: 'very_high', horizontal: 'low', pattern: '双管独头弹，巨大的单发后坐力' },
        falloff: { start: 15, end: 25, min: 75 } // [GitHub实测Y11S1.1] 125→75 (Y9S4.2: 衰减15-25m, 最低60%)
    },
    'ACS12': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.8,
        recoil: { vertical: 'high', horizontal: 'medium', pattern: '半自动独头弹，30发弹匣持续输出' },
        falloff: { start: 15, end: 25, min: 41 } // [GitHub实测Y11S1.1] 69→41 (Y9S4.2: 衰减15-25m, 最低60%)
    },
    'TCSG12': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x','scope_2_5x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.8, reloadEmpty: 3.5,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '半自动独头弹，450RPM射速' },
        falloff: { start: 15, end: 25, min: 45 } // [GitHub实测Y11S1.1] 75→45 (Y9S4.2: 57→75buff, 衰减15-25m, 最低60%)
    },
    'Glaive-12': {
        sights: ['red_dot','holographic','reflex','scope_1_5x','scope_2_0x'],
        underbarrel: false, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.0,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '独头霰弹枪' },
        falloff: { start: 15, end: 25, min: 40 } // 独头霰弹枪统一衰减: 15-25m, 最低60% → 67×0.6≈40
    },

    // === 副武器 - 霰弹枪 ===
    'ITA12S': {
        sights: [],
        underbarrel: false, mobility: 50,
        reloadTactical: 3.0, reloadEmpty: 3.0,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '副武器泵动霰弹枪，用于破墙' },
        falloff: { start: 5, midStart: 7, mid: 21, midEnd: 10, end: 13, min: 13, pellets: 8 } // [GitHub实测Y11S1.1] 29→21→13
    },
    'Super Shorty': {
        sights: [],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 2.5,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '短管霰弹枪，散布极大，用于破墙' },
        falloff: { start: 5, midStart: 7, mid: 26, midEnd: 10, end: 13, min: 15, pellets: 8 } // [灰机wiki面板35×8 + 同类衰减模式推算] 35→26→15
    },

    // === 副武器 - 冲锋枪 ===
    'C75 Auto': {
        sights: [],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.2, reloadEmpty: 2.8,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '1000RPM射速，后坐力大且铁瞄遮挡严重' },
        falloff: { start: 18, end: 28, min: 21 }
    },
    'SMG-11': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: true, mobility: 50,
        reloadTactical: 1.8, reloadEmpty: 2.4,
        recoil: { vertical: 'very_high', horizontal: 'very_high', pattern: '极高后坐力，16发弹匣不到1秒清空' },
        falloff: { start: 18, end: 28, min: 19 }
    },
    'SMG-12': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.0, reloadEmpty: 2.6,
        recoil: { vertical: 'very_high', horizontal: 'very_high', pattern: '极高后坐力，全游戏最难控制武器之一' },
        falloff: { start: 18, end: 28, min: 16 }
    },
    'Bearing 9': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 1.9, reloadEmpty: 2.5,
        recoil: { vertical: 'high', horizontal: 'high', pattern: '1100RPM高射速，后坐力大' },
        falloff: { start: 18, end: 28, min: 19 }
    },
    'SPSMG9': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 1.9, reloadEmpty: 2.5,
        recoil: { vertical: 'medium', horizontal: 'medium', pattern: '中等后坐力，副武器中较可控' },
        falloff: { start: 18, end: 28, min: 19 }
    },
    'Reaper MK2': {
        sights: ['red_dot','holographic','reflex'],
        underbarrel: false, mobility: 50,
        reloadTactical: 2.0, reloadEmpty: 2.6,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '中等后坐力，通用副武器SMG' },
        falloff: { start: 18, end: 28, min: 18 }
    },

    // === 副武器 - 手枪 (精选代表性) ===
    '5.7 USG': {
        sights: [], underbarrel: true, mobility: 50,
        reloadTactical: 1.6, reloadEmpty: 2.2,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '半自动手枪，后坐力小' },
        falloff: { start: 12, end: 15, min: 25 }
    },
    'P12': {
        sights: [], underbarrel: true, mobility: 50,
        reloadTactical: 1.6, reloadEmpty: 2.2,
        recoil: { vertical: 'low', horizontal: 'low', pattern: '半自动手枪，标准后坐力' },
        falloff: { start: 12, end: 15, min: 26 }
    },
    'PMM': {
        sights: [], underbarrel: true, mobility: 50,
        reloadTactical: 1.5, reloadEmpty: 2.1,
        recoil: { vertical: 'medium', horizontal: 'low', pattern: '高伤害手枪，后坐力稍大' },
        falloff: { start: 12, end: 15, min: 36 }
    },
    'D-50': {
        sights: [], underbarrel: true, mobility: 50,
        reloadTactical: 1.8, reloadEmpty: 2.4,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '沙漠之鹰，极大后坐力' },
        falloff: { start: 12, end: 15, min: 42 }
    },
    'LFP586': {
        sights: [], underbarrel: false, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 2.5,
        recoil: { vertical: 'very_high', horizontal: 'medium', pattern: '左轮，单发后坐力极大' },
        falloff: { start: 12, end: 15, min: 46 }
    },
    'Keratos .357': {
        sights: [], underbarrel: false, mobility: 50,
        reloadTactical: 2.5, reloadEmpty: 2.5,
        recoil: { vertical: 'high', horizontal: 'low', pattern: '底部枪管设计降低上跳' },
        falloff: { start: 12, end: 15, min: 46 }
    }
};

// ---- 武器详细档案 ----
// 数据来源: Fandom Wiki / R6灰机Wiki / Ubisoft官方
const WEAPON_DETAILS = {
    // ===== 突击步枪 =====
    'M4': {
        realName: 'Colt M4A1 Block II',
        caliber: '5.56x45mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Colt',
        trivia: [
            '游戏内模型为 M4A1 Block II，采用 SOPMOD II 计划的 Daniel Defense RIS II Mk18 护木和 12.5 英寸枪管。',
            '配件细节充满 Maverick 的战地个性：消音器包布减少热气，弹匣底部绑绳圈充当土制 Ranger Plate。',
            '从护木前方看进去，游戏中的 M4 没有导气系统——被玩家戏称为"魔法驱动"。'
        ]
    },
    'Commando 9': {
        realName: 'Colt 9mm SMG (RO635 系列)',
        caliber: '9x19mm Parabellum',
        country: '🇺🇸 美国',
        manufacturer: 'Colt',
        trivia: [
            '原型为柯尔特 9mm 冲锋枪系列（9mm AR Commando），游戏建模融合了 RO639 的照门和 RO635 的快慢机等多个型号特征。',
            '虽然归类为突击步枪但发射 9mm 手枪弹，Y8S4 前一直错误地套用冲锋枪的伤害衰减。',
            '现实中柯尔特冲锋枪弹匣只有 20 发和 32 发两种规格，游戏中的 25 发弹匣并不存在。'
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
        realName: 'Remington R4 Compact',
        caliber: '5.56x45mm NATO',
        country: '🇺🇸 美国',
        manufacturer: 'Remington Arms',
        trivia: [
            'R4-C 的"C"代表 Compact，是雷明顿 R4 系列的短枪管版本，配备 7 英寸（177.8mm）枪管。',
            '雷明顿 2012 年获得美军合同后生产 R4，但因与柯尔特的法律纠纷，美军转向 FN 采购，R4 随后转入民用和执法市场。',
            '游戏中配有 Magpul MOE® 握把、CTR® 枪托和雷明顿 RAHG 四面导轨护木。'
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
        realName: 'AK-12 (2012 原型版)',
        caliber: '5.45x39mm',
        country: '🇷🇺 俄罗斯',
        manufacturer: 'Izhmash (卡拉什尼科夫集团)',
        trivia: [
            '游戏中的 AK-12 严格基于 2012 年"雷特尼克"竞标原型，与 2016 年俄军列装的量产版（AK-400/6P70）完全不同。',
            '2012 原型版特征：全长度顶部导轨、旋钮式快慢机（取代传统 AK 大拨片）、可拆式枪机拉柄和四段可调枪托。',
            '该原型因零组件强度不足和可靠性问题在测试中失败，最终被放弃，项目回归传统 AK 设计。'
        ]
    },
    'AUG A2': {
        realName: 'Steyr AUG A2',
        caliber: '5.56x45mm NATO',
        country: '🇦🇹 奥地利',
        manufacturer: 'Steyr Mannlicher',
        trivia: [
            'AUG（Armee-Universal-Gewehr，"军队通用步枪"）在竞标中击败 FN FAL、FN CAL、Vz58 和 M16，凭精度、重量和可靠性全面胜出。',
            'A2 版本将 A1 一体式 1.5 倍镜座改为销针固定的可拆卸式，允许更换不同镜座和皮卡汀尼导轨。',
            '游戏中的枪管长度介于全尺寸和 AUG-P 短枪管之间，属于游戏化调整。'
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
            'HK416C 的研发源于 2001 年三角洲部队需求：用 H&K G36 的短行程活塞系统替换 M4 的直接导气，解决可靠性问题。',
            '约 2009 年公开，为响应英国 SAS 对紧凑短突击步枪的需求。9 英寸短枪管搭配类似 MP5A3 的滑管式折叠枪托，折叠后极为紧凑。',
            '机瞄瞄准时，后照门和前准星组成类似"●ω●"的颜文字表情，被玩家认为十分可爱。'
        ]
    },
    'C8-SFW': {
        realName: 'Colt Canada C8 SFW',
        caliber: '5.56x45mm NATO',
        country: '🇨🇦 加拿大',
        manufacturer: 'Colt Canada (前 Diemaco)',
        trivia: [
            'C8 SFW（Special Forces Weapon）基于 C8 卡宾枪（M725），配有改进的 400mm 重型枪管和 RIS 导轨护木。',
            '游戏建模实际上更接近柯尔特 933 型（11.5 英寸枪管），而非 C8-SFW 标志性的 16 英寸重型枪管。',
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
        realName: 'IMBEL PARAFAL (FAL 现代化改型)',
        caliber: '7.62x51mm NATO',
        country: '🇧🇷 巴西 / 🇧🇪 比利时',
        manufacturer: 'IMBEL / FN Herstal',
        trivia: [
            '原型为巴西 IMBEL 对已服役 30+ 年 FAL 步枪的现代化改装（PARAFAL/MD-97L），包括短枪管、聚合物部件和导轨。',
            '游戏建模融合了 DSA SA58 OSW 的上机匣和旧式 FAL 的下机匣，弹匣形似 DSA 25 发弹匣但游戏设定为 30 发。',
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
        realName: 'Colt Canada C7NLD (荷兰定制版)',
        caliber: '5.56x45mm NATO',
        country: '🇨🇦 加拿大 / 🇳🇱 荷兰',
        manufacturer: 'Colt Canada',
        trivia: [
            'C7E 实际是荷兰订购的 C7A1 改型（C7NLD），装备 Magpul PRS 精密步枪枪托和四轨前护木。',
            '配备 20 英寸长枪管，游戏模型非常长，被玩家戏称为"西班牙长矛"。',
            '现实中 GEO（西班牙特种作战小组）并未装备 AR15 系列步枪，这是育碧的艺术加工。'
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
        realName: 'FN F2000 Tactical',
        caliber: '5.56x45mm NATO (现实) / .300 BLK (游戏设定)',
        country: '🇧🇪 比利时',
        manufacturer: 'FN Herstal',
        trivia: [
            '名称来自育碧《细胞分裂》系列中 Sam Fisher 使用的 SC3000 步枪，现实原型为 FN F2000 Tactical（取消原厂光学瞄准镜版）。',
            'F2000 最独特的设计是"前抛壳"系统——空弹壳通过枪管上方的抛壳管从前方排出，左撇子也能使用。',
            '游戏中进行了大量魔改：口径改为 .300 BLK、枪托和弹匣井形状修改、拉机柄改为 AUG 式固定设计。'
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
        realName: 'H&K MP5A5 (2014 现代化版)',
        caliber: '9x19mm Parabellum',
        country: '🇩🇪 德国',
        manufacturer: 'Heckler & Koch',
        trivia: [
            '游戏内型号为 2014 SHOT SHOW 上推出的沙黄色现代化 MP5A5，带三面导轨护木和 MP5F 加厚橡胶底板枪托。',
            '1977 年摩加迪沙劫机事件和 1980 年伊朗大使馆人质事件中，GSG-9 和 SAS 使用 MP5 的画面让这把枪一夜成名。',
            '采用独特的滚柱延迟闭锁系统（源自 G3/CETME），射击精度远超同类吹回式冲锋枪。'
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
        realName: '定制直拉式栓动步枪 (无明确现实原型)',
        caliber: '.300 Winchester Magnum',
        country: '未知',
        manufacturer: '虚构 / 定制',
        trivia: [
            '官方描述为"定制直拉式栓动步枪"，采用直拉枪机操作而非传统的旋转后拉式，在游戏中独一无二。',
            '自带不可拆卸的 5x/12x 双倍率瞄准镜，可穿透软墙留下大洞、一击摧毁封阻板、击退所有防弹护盾。',
            '射击后弹道轨迹可见 1 秒（57 米长），所有玩家可见，因此连续射击会暴露位置。'
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
    'ITA12L': {
        realName: 'Fabarm SDASS (Long)',
        caliber: '12 Gauge',
        country: '🇮🇹 意大利',
        manufacturer: 'Fabarm',
        trivia: [
            'ITA12L 是 ITA12S 的长管版本，作为主武器使用。',
            '泵动霰弹枪，弹容量比短管版多3发。'
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
            'TCSG12 经历多次调整：84→57→63→75（Y9S4.2 buff至75）。',
            '可装消音器的独头弹霰弹枪，在远距离仍有不错的精度。'
        ]
    },
    'Glaive-12': {
        realName: '虚构武器',
        caliber: '12 Gauge Slug',
        country: '未知',
        manufacturer: '虚构',
        trivia: [
            'Denari 专属独头霰弹枪，4发弹容量。'
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

// ---- 武器图片资源映射 ----
// 来源: Fandom Wiki CDN (static.wikia.nocookie.net/rainbowsix)
// 缩略图格式: R6S_[FileName].png  后坐力图格式: [Key]_Recoil.png
// 手动映射 — Fandom文件名不完全统一，需逐武器确认

const FANDOM_CDN = 'https://static.wikia.nocookie.net/rainbowsix/images';
const HUIJI_CDN = 'https://huiji-public.huijistatic.com/r6s/uploads';

// 武器图片映射表 — hash路径通过 Fandom MediaWiki API 逐一验证 (2026-03-30)
// 格式: { thumb: 'X/XX/文件名', recoil: 'X/XX/文件名' | null }
const WEAPON_IMAGES = {
    // === 突击步枪 ===
    // huijiRecoil: 灰机wiki后坐力图 hash路径 (无握把_无枪口 版本)
    'R4-C':            { thumb: '2/27/R6S_R4-C.png', recoil: '3/30/R4C_Recoil.png', huijiRecoil: '9/9d/Backlash_r4c_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'L85A2':           { thumb: '9/94/R6S_L85A2.png', recoil: null, huijiRecoil: '0/0d/Backlash_l85a2_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'G36C':            { thumb: '4/49/R6S_G36C.png', recoil: null, huijiRecoil: '6/65/Backlash_g36c_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AK-12':           { thumb: 'b/bc/R6S_AK-12.png', recoil: 'f/fa/AK12_Recoil.png', huijiRecoil: 'e/e0/Backlash_ak12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'F2':              { thumb: '9/94/R6S_F2.png', recoil: null, huijiRecoil: '7/71/Backlash_f2_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '556XI':           { thumb: '8/81/R6S_556xi.png', recoil: null, huijiRecoil: '6/6f/Backlash_556xi_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M4':              { thumb: 'c/cf/R6S_M4.png', recoil: null, huijiRecoil: '2/23/Backlash_m4_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AR33':            { thumb: '4/40/R6S_AR33.png', recoil: null, huijiRecoil: 'f/f8/Backlash_ar33_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Commando 9':      { thumb: '9/9d/R6S_Commando_9.png', recoil: null, huijiRecoil: '4/42/Backlash_commando9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AUG A2':          { thumb: '5/5e/R6S_AUG_A2.png', recoil: null, huijiRecoil: 'f/f9/Backlash_auga2_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '552 Commando':    { thumb: '0/0d/R6S_552_Commando.png', recoil: null, huijiRecoil: '7/77/Backlash_552commando_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '416-C CARBINE':   { thumb: 'a/a8/R6S_416-C_Carbine.png', recoil: null, huijiRecoil: 'c/c1/Backlash_416ccarbine_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'C8-SFW':          { thumb: '6/65/R6S_C8-SFW.png', recoil: null, huijiRecoil: '6/6b/Backlash_c8sfw_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Mk17 CQB':        { thumb: '3/31/R6S_Mk17_CQB.png', recoil: null, huijiRecoil: '5/5c/Backlash_mk17cqb_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'PARA-308':        { thumb: '2/29/R6S_PARA-308.png', recoil: null, huijiRecoil: 'b/ba/Backlash_para308_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Type-89':         { thumb: 'f/f0/R6S_Type-89.png', recoil: null, huijiRecoil: '1/13/Backlash_type89_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'C7E':             { thumb: 'b/b1/R6S_C7E.png', recoil: null, huijiRecoil: '1/12/Backlash_c7e_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M762':            { thumb: 'b/be/R6S_M762.png', recoil: null, huijiRecoil: '1/13/Backlash_m762_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'V308':            { thumb: 'e/e7/R6S_V308.png', recoil: null, huijiRecoil: 'c/ce/Backlash_v308_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Spear .308':      { thumb: '5/58/R6S_Spear_.308.png', recoil: null, huijiRecoil: '3/3e/Backlash_spear308_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AR-15.50':        { thumb: '1/18/R6S_AR-15.50.png', recoil: null, huijiRecoil: 'f/f4/Backlash_ar1550_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AK-74M':          { thumb: 'a/a6/R6S_AK-74M.png', recoil: null, huijiRecoil: '7/7b/Backlash_ak74m_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ARX200':          { thumb: '7/7f/R6S_ARX200.png', recoil: null, huijiRecoil: '8/81/Backlash_arx200_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'F90':             { thumb: '3/3a/R6S_F90.png', recoil: null, huijiRecoil: '6/62/Backlash_f90_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SC3000K':         { thumb: '2/2b/R6S_SC3000K.png', recoil: null, huijiRecoil: 'a/ae/Backlash_sc3000k_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'POF-9':           { thumb: null, recoil: null, huijiRecoil: 'a/af/Backlash_pof9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'PCX-33':          { thumb: null, recoil: null }, // 灰机wiki暂无此武器后坐力图

    // === 冲锋枪 ===
    'FMG-9':           { thumb: 'f/f2/R6S_FMG-9.png', recoil: null, huijiRecoil: 'c/ca/Backlash_fmg9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MP5K':            { thumb: '8/8f/R6S_MP5K.png', recoil: null, huijiRecoil: 'd/d4/Backlash_mp5k_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'UMP45':           { thumb: '0/02/R6S_UMP45.png', recoil: null, huijiRecoil: '8/8a/Backlash_ump45_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MP5':             { thumb: '6/6c/R6S_MP5_.png', recoil: null, huijiRecoil: '2/28/Backlash_mp5_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P90':             { thumb: 'e/ec/R6S_P90.png', recoil: null, huijiRecoil: '0/0a/Backlash_p90_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MP5SD':           { thumb: 'e/e7/R6S_MP5SD.png', recoil: null, huijiRecoil: '7/7e/Backlash_mp5sd_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '9x19VSN':         { thumb: 'f/f8/R6S_9x19VSN.png', recoil: null, huijiRecoil: '5/5c/Backlash_9x19vsn_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MP7':             { thumb: '7/7d/R6S_MP7.png', recoil: null, huijiRecoil: 'f/f9/Backlash_mp7_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '9mm C1':          { thumb: 'b/b4/R6S_9mmC1.jpg', recoil: null, huijiRecoil: 'd/da/Backlash_9mmc1_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'MPX':             { thumb: '0/0b/R6S_MPX.png', recoil: null, huijiRecoil: '8/8f/Backlash_mpx_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M12':             { thumb: 'a/ad/R6S_M12.png', recoil: null, huijiRecoil: '6/67/Backlash_m12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'PDW9':            { thumb: '8/88/R6S_PDW9.png', recoil: null, huijiRecoil: '0/0d/Backlash_pdw9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Vector .45':      { thumb: '2/29/R6S_Vector_.45_ACP.png', recoil: null, huijiRecoil: 'a/a6/Backlash_vector45acp_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'T-5 SMG':         { thumb: '9/90/R6S_T-5_SMG.png', recoil: null, huijiRecoil: '4/41/Backlash_t5smg_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Scorpion EVO':    { thumb: '5/57/R6S_Scorpion_EVO_3_A1.png', recoil: null, huijiRecoil: 'e/e1/Backlash_scorpionevo3a1_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'K1A':             { thumb: 'e/e4/R6S_K1A.png', recoil: null, huijiRecoil: '6/64/Backlash_k1a_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Mx4 Storm':       { thumb: '4/48/R6S_Mx4_Storm.png', recoil: null, huijiRecoil: 'e/e3/Backlash_mx4storm_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'AUG A3':          { thumb: '6/62/R6S_AUG_A3.png', recoil: null, huijiRecoil: '4/44/Backlash_auga3_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P10 RONI':        { thumb: 'b/b4/R6S_P10_RONI.png', recoil: null, huijiRecoil: 'f/f8/Backlash_p10roni_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'UZK50GI':         { thumb: null, recoil: null, huijiRecoil: 'b/ba/Backlash_uzk50gi_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },

    // === 轻机枪 ===
    'M249':            { thumb: 'e/ea/R6S_M249.png', recoil: null, huijiRecoil: '5/52/Backlash_m249_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '6P41':            { thumb: '4/4a/R6S_6P41.png', recoil: null, huijiRecoil: 'c/cd/Backlash_6p41_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'G8A1':            { thumb: '6/6d/R6S_G8A1.png', recoil: null, huijiRecoil: '0/09/Backlash_g8a1_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'T-95 LSW':        { thumb: 'c/cf/R6S_T-95_LSW.png', recoil: null, huijiRecoil: '1/16/Backlash_t95lsw_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'LMG-E':           { thumb: '5/5a/R6S_LMG-E.png', recoil: null, huijiRecoil: '9/95/Backlash_lmge_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ALDA 5.56':       { thumb: '9/91/R6S_ALDA_5.56.png', recoil: null, huijiRecoil: '8/84/Backlash_alda556_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M249 SAW':        { thumb: '8/8f/R6S_M249_SAW.png', recoil: null, huijiRecoil: '2/26/Backlash_m249saw_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'DP27':            { thumb: '4/4a/R6S_DP27.png', recoil: null, huijiRecoil: '5/53/Backlash_dp27_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },

    // === 狙击/射手 ===
    'CSRX 300':        { thumb: '9/99/R6S_CSRX_300.png', recoil: null, huijiRecoil: '8/8c/Backlash_csrx300_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '417':             { thumb: '1/18/R6S_417.png', recoil: null, huijiRecoil: '4/40/Backlash_417_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'OTs-03':          { thumb: '9/9d/R6S_OTs-03.png', recoil: null, huijiRecoil: '9/98/Backlash_ots03_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'CAMRS':           { thumb: '6/6d/R6S_CAMRS.png', recoil: null, huijiRecoil: 'e/e3/Backlash_camrs_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SR-25':           { thumb: '0/0f/R6S_SR-25.png', recoil: null, huijiRecoil: '6/60/Backlash_sr25_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Mk 14 EBR':       { thumb: 'd/d3/R6S_Mk_14_EBR.png', recoil: null, huijiRecoil: 'a/a9/Backlash_mk14ebr_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },

    // === 霰弹枪 ===
    'M870':            { thumb: '7/78/R6S_M870.png', recoil: null, huijiRecoil: 'd/db/Backlash_m870_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M590A1':          { thumb: 'c/c0/R6S_M590A1.png', recoil: null, huijiRecoil: '8/8a/Backlash_m590a1_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'M1014':           { thumb: '8/8b/R6S_M1014.png', recoil: null, huijiRecoil: '0/02/Backlash_m1014_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SG-CQB':          { thumb: '3/36/R6S_SG-CQB.png', recoil: null, huijiRecoil: '5/50/Backlash_sgcqb_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SASG-12':         { thumb: '3/38/R6S_SASG-12.png', recoil: null, huijiRecoil: '0/07/Backlash_sasg12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SUPER 90':        { thumb: '7/7c/R6S_Super_90.png', recoil: null, huijiRecoil: 'f/ff/Backlash_super90_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SPAS-12':         { thumb: '8/8d/R6S_SPAS-12.png', recoil: null, huijiRecoil: 'a/a2/Backlash_spas12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SPAS-15':         { thumb: '0/06/R6S_SPAS-15.png', recoil: null, huijiRecoil: 'a/aa/Backlash_spas15_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SuperNova':       { thumb: 'b/b0/R6S_SuperNova.png', recoil: null, huijiRecoil: '9/95/Backlash_supernova_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'FO-12':           { thumb: '6/64/R6S_FO-12.png', recoil: null, huijiRecoil: 'f/f9/Backlash_fo12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SIX12':           { thumb: null, recoil: null, huijiRecoil: '0/06/Backlash_six12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SIX12 SD':        { thumb: null, recoil: null, huijiRecoil: 'c/c4/Backlash_six12sd_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'BOSG.12.2':       { thumb: 'd/d7/R6S_BOSG.12.2.png', recoil: null, huijiRecoil: 'f/fa/Backlash_bosg122_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ACS12':           { thumb: 'a/ac/R6S_ACS12.png', recoil: null, huijiRecoil: '4/45/Backlash_acs12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'TCSG12':          { thumb: 'b/bf/R6S_TCSG12.png', recoil: null, huijiRecoil: '6/67/Backlash_tcsg12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ITA12L':          { thumb: null, recoil: null, huijiRecoil: null },
    'Glaive-12':       { thumb: null, recoil: null, huijiRecoil: null },

    // === 副武器 ===
    'SMG-11':          { thumb: '3/3b/R6S_SMG-11.png', recoil: null, huijiRecoil: 'e/e7/Backlash_smg11_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SMG-12':          { thumb: '4/4b/R6S_SMG-12.png', recoil: null, huijiRecoil: '7/70/Backlash_smg12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Bearing 9':       { thumb: '9/94/R6S_Bearing_9.png', recoil: null, huijiRecoil: '3/37/Backlash_bearing9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'C75 Auto':        { thumb: '8/8b/R6S_C75_Auto.png', recoil: null, huijiRecoil: 'f/fa/Backlash_c75auto_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'SPSMG9':          { thumb: 'a/aa/R6S_SPSMG9.png', recoil: null, huijiRecoil: '0/00/Backlash_spsmg9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    '5.7 USG':         { thumb: 'e/e1/R6S_5.7_USG.png', recoil: null, huijiRecoil: '9/90/Backlash_57usg_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P226 MK 25':      { thumb: '5/5b/R6S_P226_Mk_25.png', recoil: null, huijiRecoil: 'f/f0/Backlash_p226mk25_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P9':              { thumb: '3/39/R6S_P9.png', recoil: null, huijiRecoil: '9/91/Backlash_p9_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'PMM':             { thumb: '7/73/R6S_PMM.png', recoil: null, huijiRecoil: '4/43/Backlash_pmm_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'P12':             { thumb: '9/95/R6S_P12.png', recoil: null, huijiRecoil: '5/57/Backlash_p12_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'D-50':            { thumb: '1/1a/R6S_D-50.png', recoil: null, huijiRecoil: '6/6a/Backlash_d50_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'LFP586':          { thumb: '1/1f/R6S_LFP586.png', recoil: null, huijiRecoil: 'b/bf/Backlash_lfp586_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Keratos .357':    { thumb: '6/61/R6S_Keratos_.357.png', recoil: null, huijiRecoil: '6/64/Backlash_keratos357_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'ITA12S':          { thumb: null, recoil: null, huijiRecoil: '2/2a/Backlash_ita12s_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
    'Super Shorty':    { thumb: null, recoil: null, huijiRecoil: '7/75/Backlash_supershorty_%E6%97%A0%E6%8F%A1%E6%8A%8A_%E6%97%A0%E6%9E%AA%E5%8F%A3.jpg' },
};

// 生成完整CDN URL的工具函数
function getWeaponThumbURL(weaponName) {
    const img = WEAPON_IMAGES[weaponName];
    if (!img || !img.thumb) return null;
    return FANDOM_CDN + '/' + img.thumb + '/revision/latest?cb=20220525145532';
}

function getWeaponRecoilURL(weaponName) {
    const img = WEAPON_IMAGES[weaponName];
    if (!img) return null;
    // 优先使用灰机wiki后坐力图（游戏内截图，更直观）
    if (img.huijiRecoil) return HUIJI_CDN + '/' + img.huijiRecoil;
    // 回退到Fandom散布图
    if (img.recoil) return FANDOM_CDN + '/' + img.recoil + '/revision/latest?cb=20210414053705';
    return null;
}

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
